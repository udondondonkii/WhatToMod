import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient';
import { fetchSentiment } from '../../utils/api';

const sentimentCache = {}

// Module lookup cache – populated lazily on first hover
const moduleLookupCache = {}

// Converts a raw Supabase row into the app's module shape
function rowToModule(row) {
    return {
        id: row.id,
        label: row.label,
        level: row.level,
        description: row.description,
        majors: row.majors ?? [],
        compulsoryFor: row.compulsory_for ?? [],
        orGroupId: row.or_group_id ?? undefined,
        isPillar: row.is_pillar,
        isSingleModulePillar: row.is_single_module_pillar,
        pillarLabel: row.pillar_label ?? undefined,
        isLevel4000Pathway: row.is_level4000_pathway,
        options: row.options ?? undefined,
        optionA: row.option_a ?? undefined,
        optionB: row.option_b ?? undefined,
    };
}

async function lookupModule(moduleCode) {
    const key = moduleCode.toLowerCase();
    if (moduleLookupCache[key]) return moduleLookupCache[key];

    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', key)
        .single();

    if (error || !data) {
        // Also search inside pillar options – fetch all and scan
        const { data: all } = await supabase.from('modules').select('id,options,option_a,option_b');
        let found = null;
        for (const row of all ?? []) {
            if (row.options) {
                const match = row.options.find(o => o.id === key);
                if (match) { found = match; break; }
            }
            if (row.option_a) {
                const b1 = row.option_a.basket1?.options?.find(o => o.id === key);
                const b2 = row.option_a.basket2?.options?.find(o => o.id === key);
                if (b1 || b2) { found = b1 ?? b2; break; }
            }
            if (row.option_b) {
                const match = row.option_b.options?.find(o => o.id === key);
                if (match) { found = match; break; }
            }
        }
        moduleLookupCache[key] = found ?? null;
        return moduleLookupCache[key];
    }

    const mod = rowToModule(data);
    moduleLookupCache[key] = mod;
    return mod;
}

export default function ModuleButton({ moduleCode, isSelected, isCompulsory, moduleTreeState, onToggle, fullWidth = false, compact = false }) {
    const [isHovered, setIsHovered] = useState(false)
    const [sentiment, setSentiment] = useState(null)
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(false)
    const [matchedModule, setMatchedModule] = useState(null)
    const [loadingModule, setLoadingModule] = useState(true)
    const hoverTimeout = useRef(null)

    // Fetch module metadata from Supabase on mount
    useEffect(() => {
        let isMounted = true;
        lookupModule(moduleCode).then(mod => {
            if (isMounted) {
                setMatchedModule(mod);
                setLoadingModule(false);
            }
        });
        return () => { isMounted = false; };
    }, [moduleCode]);

    const bgColor = isCompulsory ? '#E1F5EE' : '#FAECE7';
    const textColor = isCompulsory ? '#1D9E75' : '#D85A30';
    const borderColor = isSelected
        ? (isCompulsory ? '#1D9E75' : '#D85A30')
        : 'rgba(0,0,0,0.1)';

    const clearHoverTimeout = () => {
        if (hoverTimeout.current) {
            window.clearTimeout(hoverTimeout.current)
            hoverTimeout.current = null
        }
    }

    const handleMouseEnter = () => { clearHoverTimeout(); setIsHovered(true); }
    const handleMouseLeave = () => {
        clearHoverTimeout()
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(false)
            hoverTimeout.current = null
        }, 50)
    }

    // Fetch sentiment on hover
    useEffect(() => {
        if (!isHovered || sentiment) return

        const cacheKey = moduleCode.toUpperCase()
        const cached = sentimentCache[cacheKey]
        if (cached) { setSentiment(cached); return; }

        let isMounted = true
        setIsLoadingSentiment(true)

        fetchSentiment(cacheKey)
            .then((data) => {
                if (isMounted) {
                    sentimentCache[cacheKey] = data
                    setSentiment(data)
                }
            })
            .finally(() => { if (isMounted) setIsLoadingSentiment(false) })

        return () => { isMounted = false }
    }, [isHovered, moduleCode, sentiment])

    if (loadingModule) {
        return (
            <button disabled style={{ padding: compact ? '8px 12px' : '10px 16px', borderRadius: '10px', opacity: 0.5, fontSize: compact ? '12px' : '14px' }}>
                …
            </button>
        );
    }

    if (!matchedModule) {
        return <button disabled>Unknown</button>;
    }

    const renderSentimentRows = () => {
        if (!sentiment) return null

        const entries = [
            ['workload', sentiment.workload],
            ['difficulty', sentiment.difficulty],
            ['expectedGrade', sentiment.expectedGrade],
        ]

        return entries.map(([key, aspect]) => {
            const pct = Math.round(Math.max(0, Math.min(1, aspect.score)) * 100)
            const barColor = key === 'workload' ? '#D85A30' : key === 'difficulty' ? '#185FA5' : '#1D9E75'
            return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <span style={{ minWidth: '96px', fontSize: '12px', fontWeight: '600', color: '#42413f', textTransform: 'capitalize' }}>
                        {aspect.label}
                    </span>
                    <div style={{ flex: 1, height: '8px', borderRadius: '999px', backgroundColor: '#E8E6E3', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor }} />
                    </div>
                </div>
            )
        })
    }

    return (
        <div
            className="tooltip-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', display: 'inline-block' }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: fullWidth ? '100%' : 'auto',
                    padding: compact ? '8px 12px' : '10px 16px', borderRadius: '10px', cursor: 'pointer',
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    fontWeight: isSelected ? '600' : '500',
                    opacity: isSelected ? 1 : 0.8,
                    transition: 'all 0.15s ease-in-out',
                    textAlign: 'left',
                    fontSize: compact ? '12px' : '14px',
                    lineHeight: 1.3
                }}>
                {matchedModule.label}
            </button>

            {isHovered && (
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'absolute',
                        top: '55%',
                        left: '100%',
                        transform: 'translate(0, -80%)',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        zIndex: 1000,
                        minWidth: '280px',
                        maxWidth: '320px',
                        fontSize: '13px',
                        color: '#1a1a18',
                        lineHeight: '1.5'
                    }}>
                    <Link
                        to={`/insights/${encodeURIComponent(matchedModule.label)}`}
                        state={{
                            from: '/moduleTree',
                            moduleTreeState: {
                                ...moduleTreeState,
                                scrollPosition: window.scrollY,
                            },
                        }}
                        style={{
                            display: 'block',
                            margin: '0 0 8px 0',
                            fontWeight: '600',
                            color: textColor,
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                    >
                        {matchedModule.label}
                    </Link>

                    <p style={{ margin: '0', color: '#5F5E5A', fontSize: '12px' }}>
                        {matchedModule.description}
                    </p>

                    {isLoadingSentiment && (
                        <p style={{ margin: '10px 0 0', color: '#7a766f', fontSize: '12px' }}>
                            Loading review insights...
                        </p>
                    )}
                    {renderSentimentRows()}

                    {sentiment && (
                        <p style={{ margin: '10px 0 0', color: '#7a766f', fontSize: '11px' }}>
                            Based on {sentiment.reviewCount} reviews
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
