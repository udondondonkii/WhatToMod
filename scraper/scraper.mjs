import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const codesArg = args.find((a) => a.startsWith("--codes="))?.slice(8);
const limitArg = args.find((a) => a.startsWith("--limit="))?.slice(8);
const LIMIT = limitArg ? parseInt(limitArg) : 250;

async function getPrioritizedModuleCodes() {
  if (codesArg) return codesArg.split(",").map((c) => c.trim().toUpperCase());
  
  // 1. Fetch the master list of all current modules from NUSMods
  const res = await fetch("https://api.nusmods.com/v2/2025-2026/moduleList.json");
  const list = await res.json();
  const allCodes = list.map((m) => m.moduleCode);

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  
  console.log("[scraper] Querying database exclusion list...");
  
  // 2. Fix: Explicitly ask for modules scraped within the last 3 days. 
  // We paginate up to 10,000 records to ensure we read your complete tracking history.
  const { data: recentlyScraped, error } = await supabase
    .from("sentiment")
    .select("module_code")
    .gt("last_scraped_at", threeDaysAgo)
    .range(0, 9999);

  if (error) {
    console.error("[!] Failed to fetch exclusion list from DB:", error.message);
  }

  const recentlyScrapedSet = new Set(recentlyScraped?.map(p => p.module_code) || []);
  
  // 3. Filter down your backlog locally
  const backlog = allCodes.filter(code => !recentlyScrapedSet.has(code));
  
  return backlog.slice(0, LIMIT);
}

async function scrapeModule(browser, code) {
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    console.log(`Processing ${code}`);
    await page.goto(`https://nusmods.com/courses/${code}`, {
      waitUntil: "load",
      timeout: 25000,
    });

    await page.waitForSelector("#disqus_thread", { timeout: 2000 }).catch(() => null);

    const iframeElement = await page
      .waitForSelector("#disqus_thread iframe[src*='disqus.com']", { timeout: 1500 })
      .catch(() => null);
    
    if (!iframeElement) {
      await context.close();
      return { code, reviews: [], hasDisqus: false, isTimeout: false };
    }

    const disqusFrame = await iframeElement.contentFrame();
    if (!disqusFrame) {
      await context.close();
      return { code, reviews: [], hasDisqus: false, isTimeout: false };
    }

    const postsFound = await disqusFrame.waitForSelector(".post-message", { timeout: 4000 }).catch(() => null);
    
    if (!postsFound) {
      await context.close();
      return { code, reviews: [], hasDisqus: true, isTimeout: false };
    }

    let previousCount = 0;
    let stableRounds = 0;

    while (stableRounds < 2) {
      const loadMoreBtn = await disqusFrame.$('[data-role="more"]');
      if (loadMoreBtn && await loadMoreBtn.isVisible()) {
        await loadMoreBtn.click();
        await page.waitForTimeout(1000); 
      } else {
        stableRounds++;
      }

      const currentCount = await disqusFrame.evaluate(() => document.querySelectorAll(".post-message").length);
      if (currentCount === previousCount) stableRounds++;
      else { stableRounds = 0; previousCount = currentCount; }
    }

    const posts = await disqusFrame.evaluate(() =>
      Array.from(document.querySelectorAll(".post-message")).map((el, i) => ({ id: i, text: el.innerText?.trim() }))
    );

    await context.close();

    const cleanReviews = posts
      .filter((p) => p.text && p.text.length > 10)
      .map(({ id, text }) => ({
        id: `${code}-disqus-${id}`,
        module_code: code,
        text,
        semester: "",
        scraped_at: new Date().toISOString(),
      }));

    return { code, reviews: cleanReviews, hasDisqus: true, isTimeout: false };

  } catch (err) {
    await context.close();
    return { code, reviews: [], hasDisqus: false, isTimeout: true };
  }
}


async function pushRawData(code, reviews, hasDisqus) {
  // Clear older reviews completely
  await supabase.from("reviews").delete().eq("module_code", code);

  const timestamp = new Date().toISOString();

  if (reviews.length > 0) {
    const { error: reviewError } = await supabase.from("reviews").insert(reviews);
    if (reviewError) {
      console.error(`  [!] Supabase Reviews Insert Error (${code}):`, reviewError.message);
      return;
    }
    console.log(`[DB] Successfully pushed ${reviews.length} fresh reviews for ${code}`);

    const { data: updateData, error: updateError } = await supabase
      .from("sentiment")
      .update({ last_scraped_at: timestamp, review_count: reviews.length })
      .eq("module_code", code)
      .select();

    if (updateError) {
      console.error(`  [!] Supabase Sentiment Update Error (${code}):`, updateError.message);
    }

    if (!updateData || updateData.length === 0) {
      const { error: upsertError } = await supabase.from("sentiment").upsert({
        module_code: code,
        last_scraped_at: timestamp,
        review_count: reviews.length,
        workload_level: 'No data'
      }, { onConflict: 'module_code' });
      
      if (upsertError) console.error(`  [!] Supabase Sentiment Upsert Error (${code}):`, upsertError.message);
    }
  }

  if (reviews.length === 0) {
    // Capture the potential database error here
    const { error: placeholderError } = await supabase.from("sentiment").upsert({
      module_code: code,
      review_count: 0,
      last_scraped_at: timestamp,
      workload_level: 'Processed (0 reviews)', // Using this stops the analyzer loop
      difficulty_level: 'No data',
      grade_level: 'No data',
      tips: ["No reviews found yet for this module."]
    }, { onConflict: 'module_code' });

    if (placeholderError) {
      console.error(`[DATABASE WRITE FAILED] for ${code}:`, placeholderError.message);
    } else {
      console.log(`[DB] No reviews found for ${code}. Saved 0-review placeholder row.`);
    }
  }
}

// Execution Block
const targetModules = await getPrioritizedModuleCodes();
console.log(`[scraper] Modules to be scraped: ${targetModules.length}`);

if (targetModules.length === 0) {
  console.log("All modules are fully up to date.");
  process.exit(0);
}

const browser = await chromium.launch({ 
  headless: true,
  args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});

const CONCURRENCY_LIMIT = process.env.GITHUB_ACTIONS ? 2 : 3; 

for (let i = 0; i < targetModules.length; i += CONCURRENCY_LIMIT) {
  const batch = targetModules.slice(i, i + CONCURRENCY_LIMIT);
  
  await Promise.all(batch.map(async (code) => {
    try {
      const result = await scrapeModule(browser, code);
      if (result.isTimeout) {
        console.warn(`  [NETWORK TIMEOUT] ${code} failed to settle. Skipping write.`);
      } else {
        await pushRawData(result.code, result.reviews, result.hasDisqus);
      }
    } catch (batchError) {
      console.error(`[CRITICAL ERROR] Failed processing for ${code}:`, batchError.message);
    }
  }));

  await new Promise((r) => setTimeout(r, 800));
}

await browser.close();
console.log(`\n[scraper] Scraping batch complete.`);