import React, { useState } from 'react';
import PillarDropdown from './ModTree_PillarMod';

export default function Level4000Pathway({ nodeData, selectedMods, onToggleModule }) {
    const [activeTrack, setActiveTrack] = useState('A'); // Tracks track 'A' or 'B'

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

            {/* Path Selection Interface */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px', gap: '10px' }}>
                <label style={{ 
                    flex: 1, padding: '10px', border: `2px solid ${activeTrack === 'A' ? '#185FA5' : 'rgba(0,0,0,0.1)'}`, borderRadius: '10px', 
                    cursor: 'pointer', textAlign: 'center', backgroundColor: activeTrack === 'A' ? '#E6F1FB' : '#F7F6F2',
                    fontWeight: activeTrack === 'A' ? '600' : '500', color: activeTrack === 'A' ? '#185FA5' : '#5F5E5A',
                    transition: 'all 0.15s ease-in-out'
                }}>
                    <input 
                        type="radio" name="pathway4k" value="A" 
                        checked={activeTrack === 'A'} onChange={() => setActiveTrack('A')}
                        style={{ marginRight: '6px' }}
                    />
                    Option A (Coursework)
                </label>
                
                <label style={{ 
                    flex: 1, padding: '10px', border: `2px solid ${activeTrack === 'B' ? '#185FA5' : 'rgba(0,0,0,0.1)'}`, borderRadius: '10px', 
                    cursor: 'pointer', textAlign: 'center', backgroundColor: activeTrack === 'B' ? '#E6F1FB' : '#F7F6F2',
                    fontWeight: activeTrack === 'B' ? '600' : '500', color: activeTrack === 'B' ? '#185FA5' : '#5F5E5A',
                    transition: 'all 0.15s ease-in-out'
                }}>
                    <input 
                        type="radio" name="pathway4k" value="B" 
                        checked={activeTrack === 'B'} onChange={() => setActiveTrack('B')}
                        style={{ marginRight: '6px' }}
                    />
                    Option B (Honours Project)
                </label>
            </div>

            {/* Conditional Pathway Render Zones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                {activeTrack === 'A' ? (
                    <>
                        <p style={{ fontSize: '12px', margin: '0', color: '#666', fontStyle: 'italic' }}>
                            Pass TWO courses (one from each basket below):
                        </p>
                        <PillarDropdown 
                            pillarModule={nodeData.optionA.basket1} 
                            selectedMods={selectedMods} 
                            onToggleModule={onToggleModule} 
                        />
                        <PillarDropdown 
                            pillarModule={nodeData.optionA.basket2} 
                            selectedMods={selectedMods} 
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
                            onToggleModule={onToggleModule} 
                        />
                    </>
                )}
            </div>
        </div>
    );
}