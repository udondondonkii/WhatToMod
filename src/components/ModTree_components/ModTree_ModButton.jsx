import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { rawSupabaseData } from '../../assets/MockModuleDatabase';
import { fetchSentiment } from '../../utils/api';

const sentimentCache = {}

// Create dictionary key-value pair for efficient Module finding
const moduleDatabase = rawSupabaseData.reduce((acc, mod) => {
    if (!acc[mod.id]) acc[mod.id] = mod

    if (mod.isPillar) {
        mod.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option
        })
    }

    if (mod.isLevel4000Pathway) {
        mod.optionA.basket1.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option
        })
        mod.optionA.basket2.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option
        })
        mod.optionB.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option
        })
    }

    return acc
}, {})

export default function ModuleButton({ moduleCode, isSelected, isCompulsory, moduleTreeState, onToggle }) {
    const [isHovered, setIsHovered] = useState(false)
    const [sentiment, setSentiment] = useState(null)
    const [isLoadingSentiment, setIsLoadingSentiment] = useState(false)
    const hoverTimeout = useRef(null)

    const matchedModule = moduleDatabase[moduleCode]
    if (!matchedModule) return <button disabled>Unknown</button>

    // Color system: compulsory uses teal, optional uses coral
    const bgColor = isCompulsory ? '#E1F5EE' : '#FAECE7';
    const textColor = isCompulsory ? '#1D9E75' : '#D85A30';
    const borderColor = isSelected ? (isCompulsory ? '#1D9E75' : '#D85A30') : 'rgba(0,0,0,0.1)';

    const clearHoverTimeout = () => {
        if (hoverTimeout.current) {
            window.clearTimeout(hoverTimeout.current)
            hoverTimeout.current = null
        }
    }

    const handleMouseEnter = () => {
        clearHoverTimeout()
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        clearHoverTimeout()
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(false)
            hoverTimeout.current = null
        }, 50)
    }

    useEffect(() => {
        if (!isHovered || sentiment) return

        const cacheKey = moduleCode.toUpperCase()
        const cached = sentimentCache[cacheKey]
        if (cached) {
            setSentiment(cached)
            return
        }

        let isMounted = true
        setIsLoadingSentiment(true)

        fetchSentiment(cacheKey)
            .then((data) => {
                // console.log('Sentiment response:', data) for debugging purposes
                if (isMounted) {
                    sentimentCache[cacheKey] = data
                    setSentiment(data)
                }
            })
            .finally(() => {
                if (isMounted) setIsLoadingSentiment(false)
            })

        return () => {
            isMounted = false
        }
    }, [isHovered, moduleCode, sentiment])

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
                    padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', 
                    backgroundColor: bgColor,
                    color: textColor,
                    border: `2px solid ${borderColor}`,
                    fontWeight: isSelected ? '600' : '500',
                    opacity: isSelected ? 1 : 0.8,
                    transition: 'all 0.15s ease-in-out'
                }}>
                {matchedModule.label}
            </button>

            {/* Tooltip Box - Future proof structure for additional module info */}
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
                    {/* Module Title */}
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
                    
                    {/* Module Description - Main content */}
                    <p style={{ margin: '0', color: '#5F5E5A', fontSize: '12px' }}>
                        {matchedModule.description}
                    </p>

                    {/* Sentiment category bars */}
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