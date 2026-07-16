import { Link } from 'react-router-dom';
import { LuFrown, LuUser } from 'react-icons/lu';

const SENTIMENT_LABELS = {
  positive: "Positive",
  negative: "Negative",
  mixed:    "Mixed",
  neutral:  "Neutral",
};

const ASPECT_LABELS = {
  lectures: "Lectures",
  assignments: "Assignments",
  exams: "Exams",
  group_projects: "Group Projects",
  content_difficulty: "Content Difficulty",
  staff_teaching: "Staff & Teaching",
  workload_balance: "Workload Balance",
  tutorials: "Tutorials",
};

const SUGGESTION_CATEGORY_LABELS = {
  teaching_style: "Teaching Style",
  resource_request: "Resource Request",
  assessment_feedback: "Assessment Feedback",
  workload_adjustment: "Workload Adjustment",
  other: "Other",
};

function AspectPill({ aspect, sentiment, note }) {
  const label = SENTIMENT_LABELS[sentiment] ?? SENTIMENT_LABELS.neutral;
  const badgeClass = SENTIMENT_LABELS[sentiment] ? sentiment : "neutral";
  return (
    <div className="aspect-pill-card">
      <div className="aspect-pill-header">
        <span className="aspect-pill-name">{ASPECT_LABELS[aspect] ?? aspect}</span>
        <span className={`aspect-pill-badge ${badgeClass}`}>
          {label}
        </span>
      </div>
      {note && <p className="aspect-pill-note">{note}</p>}
    </div>
  );
}

export function AspectBreakdown({ moduleCode, moduleAspects = [], keyInfo, suggestions = [], professors = [] }) {
  const hasAnyData = moduleAspects.length > 0 || suggestions.length > 0 || professors.length > 0;

  if (!hasAnyData) {
    return (
      <div className="aspect-breakdown-empty">
        <p className="no-data-note">
          No detailed insights generated yet, possibly due to the lack of reviews. (If this is an error, do let us know!)
        </p>
      </div>
    );
  }

  // grouped by sem
  const professorsBySemester = professors.reduce((acc, p) => {
    const sem = p.semester && p.semester !== "Unclear" ? p.semester : "Semester unclear";
    (acc[sem] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="aspect-breakdown">
      {professors.length > 0 && (
        <section aria-label="Professors by semester">
          <p className="aspect-breakdown-label">Past lecturers: </p>
          <p className="text-xs text-red-600 inline-flex items-center gap-1">
            *Note: Data may be inaccurate as it is based on reviews. AI makes mistakes
            <LuFrown size={10} />
          </p>          
        <div className="professors-by-sem">
            {Object.entries(professorsBySemester).map(([sem, profs]) => (
              <div key={sem} className="professor-sem-group">
                <p className="professor-sem-heading">{sem}</p>
                <div className="professors-row">
                  {profs.map((p, i) => (
                    <Link
                      key={i}
                      to={`/professor/${encodeURIComponent(p.name)}`}
                      state={{ fromModuleCode: moduleCode }}
                      className="professor-chip professor-chip-link"
                      title={`Mentioned in ${p.mentionCount} review${p.mentionCount !== 1 ? "s" : ""} — view lecturer page`}
                    >
                      <span className="professor-name">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {moduleAspects.length > 0 && (
        <section aria-label="Aspect breakdown">
          <p className="aspect-breakdown-label">What students say:</p>
          <div className="aspect-pill-grid">
            {moduleAspects.map((a) => (
              <AspectPill key={a.aspect} aspect={a.aspect} sentiment={a.sentiment} note={a.note} />
            ))}
          </div>
        </section>
      )}

      {suggestions.length > 0 && (
        <section className="suggestions-box" aria-label="Student suggestions">
          <p className="tips-label">Suggestions from past students</p>
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li key={i} className="suggestion-item">
                <span className="suggestion-category">
                  {SUGGESTION_CATEGORY_LABELS[s.category] ?? s.category}
                </span>
                <span className="suggestion-text">{s.suggestion}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}