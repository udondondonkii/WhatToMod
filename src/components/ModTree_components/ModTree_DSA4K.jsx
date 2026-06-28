import React, { useState } from 'react';
import PillarDropdown from './ModTree_PillarMod';

export default function Level4000Pathway({ nodeData, selectedMods, moduleTreeState, onToggleModule }) {
    const [activeTrack, setActiveTrack] = useState('A');
    const radioGroupName = `pathway4k-${nodeData.id}`;

    return (
        <div style={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '14px',
            padding: '16px',
            backgroundColor: '#ffffff',
            maxWidth: '420px',
            margin: '0 auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#185FA5', textAlign: 'center', fontWeight: '600' }}>
                {nodeData.label}
            </h4>

            {/* Track selection — Option A (Coursework) vs Option B (Honours Project) */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px', gap: '10px' }}>
                {[
                    { value: 'A', label: 'Option A (Coursework)' },
                    { value: 'B', label: 'Option B (Honours Project)' },
                ].map(({ value, label }) => {
                    const isActive = activeTrack === value;
                    return (
                        <label key={value} style={{
                            flex: 1, padding: '10px',
                            border: `2px solid ${isActive ? '#185FA5' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
                            backgroundColor: isActive ? '#E6F1FB' : '#F7F6F2',
                            fontWeight: isActive ? '600' : '500',
                            color: isActive ? '#185FA5' : '#5F5E5A',
                            transition: 'all 0.15s ease-in-out'
                        }}>
                            <input
                                type="radio"
                                name={radioGroupName}
                                value={value}
                                checked={isActive}
                                onChange={() => setActiveTrack(value)}
                                style={{ marginRight: '6px' }}
                            />
                            {label}
                        </label>
                    );
                })}
            </div>

            {/* Conditional content per track */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                {activeTrack === 'A' ? (
                    <>
                        {/* DSA4K-specific rule: both baskets must be satisfied for Option A */}
                        <p style={{ fontSize: '12px', margin: '0', color: '#666', fontStyle: 'italic' }}>
                            Pass TWO courses (one from each basket below):
                        </p>
                        <PillarDropdown
                            pillarModule={nodeData.optionA.basket1}
                            selectedMods={selectedMods}
                            moduleTreeState={moduleTreeState}
                            onToggleModule={onToggleModule}
                        />
                        <PillarDropdown
                            pillarModule={nodeData.optionA.basket2}
                            selectedMods={selectedMods}
                            moduleTreeState={moduleTreeState}
                            onToggleModule={onToggleModule}
                        />
                    </>
                ) : (
                    <>
                        <p style={{ fontSize: '12px', margin: '0', color: '#5F5E5A', fontStyle: 'italic', fontWeight: '500' }}>
                            Pass ONE Honours Project variant (8 Units):
                        </p>
                        <PillarDropdown
                            pillarModule={nodeData.optionB}
                            selectedMods={selectedMods}
                            moduleTreeState={moduleTreeState}
                            onToggleModule={onToggleModule}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
