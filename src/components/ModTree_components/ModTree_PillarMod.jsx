import React, { useState } from 'react';
import ModuleButton from './ModTree_ModButton';

export default function PillarDropdown({ pillarModule, selectedMods, moduleTreeState, onToggleModule }) {
    const [isOpen, setIsOpen] = useState(false);

    // Check if any of the sub-options inside this pillar are currently selected
    const selectedOption = pillarModule.options.find(opt => selectedMods.includes(opt.id));

    return (
        <div style={{ 
            border: `1px solid rgba(0,0,0,0.1)`, 
            borderRadius: '10px', 
            padding: '12px', 
            backgroundColor: '#ffffff',
            width: '180px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            {/* Main Pillar Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    backgroundColor: selectedOption ? '#E1F5EE' : '#F7F6F2',
                    color: selectedOption ? '#1D9E75' : '#5F5E5A',
                    fontWeight: '600',
                    border: `1px solid ${selectedOption ? '#1D9E75' : 'rgba(0,0,0,0.1)'}`,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease-in-out'
                }}
            >
                {/* Show the selected module name if one is picked, otherwise show the general pillar label */}
                <span>{selectedOption ? selectedOption.label : pillarModule.label}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {/* Expanded Content Dropdown */}
            {isOpen && (
                <div style={{ 
                    marginTop: '10px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#F7F6F2',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.06)'
                }}>
                    <p style={{ fontSize: '11px', margin: '0 0 5px 0', color: '#5F5E5A', fontWeight: '500' }}>Select 1 Option:</p>
                    {pillarModule.options.map((option) => {
                        const isSelected = selectedMods.includes(option.id);
                        return (
                            <ModuleButton 
                                key={option.id}
                                moduleCode={option.id}
                                isSelected={isSelected}
                                isCompulsory={pillarModule.compulsoryFor?.includes('DSA-Major')} // Inherits pillar status
                                onToggle={() => {
                                    onToggleModule(option.id);
                                    setIsOpen(false);
                                }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}