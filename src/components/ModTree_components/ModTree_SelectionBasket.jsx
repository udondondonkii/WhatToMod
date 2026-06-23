import React from 'react';
import ModuleButton from './ModTree_ModButton';

export default function SelectedBasket({ selectedMods, selectedMajor, moduleDatabase, moduleTreeState, onToggleModule }) {
    return (
        <div style={{ marginTop: '20px', padding: '16px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#F7F6F2', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, color: '#1a1a18', fontWeight: '600' }}>Selected Modules (Total MCs : {selectedMods.length*4})</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1D9E75', fontWeight: '500' }}>
                        <span style={{ width: '14px', height: '14px', backgroundColor: '#E1F5EE', display: 'inline-block', borderRadius: '4px', border: '1px solid #1D9E75' }} />
                        <span>Compulsory</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#D85A30', fontWeight: '500' }}>
                        <span style={{ width: '14px', height: '14px', backgroundColor: '#FAECE7', display: 'inline-block', borderRadius: '4px', border: '1px solid #D85A30' }} />
                        <span>Optional</span>
                    </div>
                </div>
            </div>
            {selectedMods.length === 0 ? (
                <p style={{ color: '#888780', fontStyle: 'italic' }}>No modules selected yet.</p>
            ) : (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedMods.map(id => {
                        const targetMod = moduleDatabase[id];
                        const isCompulsoryInBasket = targetMod?.compulsoryFor?.includes(selectedMajor);

                        return (
                            <div key={id}>
                                <ModuleButton 
                                    moduleCode={id} 
                                    isSelected={true} 
                                    isCompulsory={isCompulsoryInBasket}
                                    moduleTreeState={moduleTreeState}
                                    onToggle={() => onToggleModule(id)} 
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}