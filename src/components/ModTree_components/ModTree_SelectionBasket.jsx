import React from 'react';
import SelectionBasketButton from './ModTree_SelectionBasketButton';

export default function SelectedBasket({ selectedMods, selectedMajor, moduleDatabase, moduleTreeState, onToggleModule, onClearAll }) {
    return (
        <div style={{ marginTop: '0px', padding: '12px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#F7F6F2', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: 0, color: '#1a1a18', fontWeight: '600', fontSize: '13px' }}>
                        Selected Modules
                    </h3>
                    <p style={{ margin: '6px 0 0', color: '#4B5563', fontSize: '10px' }}>
                        Total MCs in Basket: {selectedMods.length * 4}
                    </p>
                </div>
                <button
                    onClick={onClearAll}
                    disabled={selectedMods.length === 0}
                    style={{
                        padding: '6px 10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        backgroundColor: selectedMods.length === 0 ? '#F3F4F6' : '#1f2937',
                        color: selectedMods.length === 0 ? '#9ca3af' : '#ffffff',
                        cursor: selectedMods.length === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '10px',
                        fontWeight: '600'
                    }}
                >
                    Clear All
                </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#1D9E75', fontWeight: '500' }}>
                    <span style={{ width: '14px', height: '14px', backgroundColor: '#E1F5EE', display: 'inline-block', borderRadius: '4px', border: '1px solid #1D9E75' }} />
                    <span>Compulsory</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', color: '#D85A30', fontWeight: '500' }}>
                    <span style={{ width: '14px', height: '14px', backgroundColor: '#FAECE7', display: 'inline-block', borderRadius: '4px', border: '1px solid #D85A30' }} />
                    <span>Optional</span>
                </div>
            </div>
            {selectedMods.length === 0 ? (
                <p style={{ color: '#888780', fontStyle: 'italic', fontSize: '9px' }}>
                    No modules selected yet.
                </p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {selectedMods.map(id => {
                        const targetMod = moduleDatabase[id];
                        const isCompulsoryInBasket = targetMod?.compulsoryFor?.includes(selectedMajor);

                        return (
                            <div key={id} style={{ width: '100%' }}>
                                <SelectionBasketButton
                                    moduleCode={id}
                                    isSelected={true}
                                    isCompulsory={isCompulsoryInBasket}
                                    onToggle={() => onToggleModule(id)}
                                    moduleTreeState={moduleTreeState}
                                    fullWidth
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}