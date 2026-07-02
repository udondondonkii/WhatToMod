import React, { useState } from 'react';
import PillarDropdown from './ModTree_PillarMod';

function getPathwayDefinitions(nodeData) {
    const totalPaths = Math.max(1, Number(nodeData?.number_of_paths ?? 2));

    return Array.from({ length: totalPaths }, (_, index) => {
        const fallbackLabel = index === 0
            ? 'Option A (Coursework)'
            : index === 1
                ? 'Option B (Honours Project)'
                : `Pathway ${index + 1}`;

        return {
            value: String.fromCharCode(65 + index),
            label: nodeData?.pathwayLabels?.[index] || fallbackLabel,
        };
    });
}

function getBasketModules(pathwayConfig, basketCount) {
    if (!pathwayConfig) return [];

    if (Array.isArray(pathwayConfig.baskets)) {
        return pathwayConfig.baskets.slice(0, basketCount);
    }

    if (Array.isArray(pathwayConfig.options) && pathwayConfig.options.length > 0) {
        return [pathwayConfig];
    }

    const basketEntries = Object.entries(pathwayConfig)
        .filter(([key, value]) => key.startsWith('basket') && value && typeof value === 'object')
        .sort(([left], [right]) => Number(left.replace(/\D/g, '')) - Number(right.replace(/\D/g, '')));

    return basketEntries.slice(0, basketCount).map(([, basket]) => basket);
}

export default function Level4000Pathway({ nodeData, selectedMods, selectedMajor, moduleTreeState, onToggleModule }) {
    const [activeTrack, setActiveTrack] = useState('A');
    const radioGroupName = `pathway4k-${nodeData.id}`;
    const pathwayDefinitions = getPathwayDefinitions(nodeData);
    const basketCount = Math.max(1, Number(nodeData?.number_of_basket ?? 2));

    const activePathwayIndex = Math.max(0, pathwayDefinitions.findIndex(({ value }) => value === activeTrack));
    const activePathwayConfig = Array.isArray(nodeData?.pathways)
        ? nodeData.pathways[activePathwayIndex]
        : activePathwayIndex === 0
            ? nodeData?.optionA
            : activePathwayIndex === 1
                ? nodeData?.optionB
                : null;

    const basketModules = getBasketModules(activePathwayConfig, basketCount);
    const helperText = basketModules.length > 1
        ? `Choose one module from each basket below (${basketModules.length} baskets total):`
        : 'Choose one module from the basket below:';

    return (
        <div style={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '14px',
            padding: '12px',
            backgroundColor: '#ffffff',
            maxWidth: '360px',
            margin: '0 auto',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#185FA5', textAlign: 'center', fontWeight: '600' }}>
                {nodeData.label}
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '12px', gap: '8px' }}>
                {pathwayDefinitions.map(({ value, label }) => {
                    const isActive = activeTrack === value;
                    return (
                        <label key={value} style={{
                            flex: 1, padding: '8px', fontSize: '12px',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {basketModules.length > 0 ? (
                    <>
                        <p style={{ fontSize: '12px', margin: '0', color: '#666', fontStyle: 'italic' }}>
                            {helperText}
                        </p>
                        {basketModules.map((basketModule, index) => (
                            <PillarDropdown
                                key={basketModule?.id || `${activePathwayIndex}-${index}`}
                                pillarModule={basketModule}
                                selectedMods={selectedMods}
                                selectedMajor={selectedMajor}
                                moduleTreeState={moduleTreeState}
                                onToggleModule={onToggleModule}
                            />
                        ))}
                    </>
                ) : (
                    <p style={{ fontSize: '12px', margin: '0', color: '#5F5E5A', fontStyle: 'italic', fontWeight: '500' }}>
                        No basket configuration is available for this pathway.
                    </p>
                )}
            </div>
        </div>
    );
}
