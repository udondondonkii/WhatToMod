import React from 'react';
import ModuleButton from './ModTree_ModButton';
import PillarDropdown from './ModTree_PillarMod';
import Level4000Pathway from './ModTree_DSA4K';

export default function ModuleTree({ modulesByLvl, selectedMods, selectedMajor, moduleTreeState, onToggleModule }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'stretch' }}>
            {modulesByLvl.map((layer, layerIndex) => {
                const renderedGroups = new Set()

                // Determine if this layer is "complete":
                // - For groups (orGroupId): at least one module in the group must be selected
                // - For pillars: at least one of the pillar options must be selected
                // - For single-module pillars: the module id must be selected
                // - For Level4000Pathway: either both basket1 and basket2 have selections, or optionB has a selection
                // - For regular modules: the module id must be selected
                const groupIds = [...new Set(layer.map(m => m.orGroupId).filter(Boolean))]
                const requirements = []

                // Groups: require one selected per group
                groupIds.forEach((gid) => {
                    const groupModules = layer.filter(m => m.orGroupId === gid)
                    const anySelected = groupModules.some(gm => selectedMods.includes(gm.id))
                    requirements.push(anySelected)
                })

                // Non-group modules: evaluate individually
                layer.filter(m => !m.orGroupId).forEach((modInTree) => {
                    if (modInTree.isPillar) {
                        const any = modInTree.options?.some(o => selectedMods.includes(o.id))
                        requirements.push(Boolean(any))
                    } else if (modInTree.isSingleModulePillar) {
                        requirements.push(selectedMods.includes(modInTree.id))
                    } else if (modInTree.isLevel4000Pathway) {
                        const basket1 = modInTree.optionA?.basket1?.options || []
                        const basket2 = modInTree.optionA?.basket2?.options || []
                        const optionB = modInTree.optionB?.options || []

                        const b1 = basket1.some(o => selectedMods.includes(o.id))
                        const b2 = basket2.some(o => selectedMods.includes(o.id))
                        const bB = optionB.some(o => selectedMods.includes(o.id))

                        const pathwayComplete = (b1 && b2) || bB
                        requirements.push(pathwayComplete)
                    } else {
                        requirements.push(selectedMods.includes(modInTree.id))
                    }
                })

                const layerComplete = requirements.length > 0 && requirements.every(Boolean)

                return (
                    <div key={layerIndex} style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', flex: 1,
                        backgroundColor: layerComplete ? '#E1F5EE' : 'transparent', padding: '12px', borderRadius: '10px', transition: 'background-color 0.15s ease' }}>
                        <div style={{ color: '#1a1a18', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>Level {(layerIndex + 1)}000 Modules</div> 

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
                            {layer.map((modInTree) => {
                                const groupId = modInTree.orGroupId

                                // Resolve if the module is compulsory for the active major dynamically
                                const isCompulsory = modInTree.compulsoryFor?.includes(selectedMajor)

                                if (modInTree.isPillar) {
                                    return (
                                        <div key={modInTree.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
                                            <PillarDropdown 
                                                pillarModule={modInTree}
                                                selectedMods={selectedMods}
                                                selectedMajor={selectedMajor}
                                                moduleTreeState={moduleTreeState}
                                                onToggleModule={onToggleModule}
                                            />
                                        </div>
                                    );
                                }

                                if (modInTree.isSingleModulePillar) {
                                    const isSelected = selectedMods.includes(modInTree.id);
                                    return (
                                        <div key={modInTree.id} style={{
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            backgroundColor: '#ffffff',
                                            textAlign: 'center',
                                            width: '180px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                        }}>
                                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#185FA5', marginBottom: '8px', textTransform: 'uppercase' }}>
                                                {modInTree.pillarLabel} Pillar
                                            </div>
                                            <ModuleButton 
                                                moduleCode={modInTree.id} 
                                                isSelected={isSelected} 
                                                isCompulsory={modInTree.compulsoryFor?.includes(selectedMajor)}
                                                moduleTreeState={moduleTreeState}
                                                onToggle={() => onToggleModule(modInTree.id)} 
                                            />
                                        </div>
                                    );
                                }

                                if (modInTree.isLevel4000Pathway) {
                                    return (
                                        <div key={modInTree.id} style={{ gridColumn: '1 / -1', margin: '15px 0', width: '100%' }}>
                                            <Level4000Pathway 
                                                nodeData={modInTree}
                                                selectedMods={selectedMods}
                                                onToggleModule={onToggleModule}
                                            />
                                        </div>
                                    );
                                }

                                if (groupId) {
                                    if (renderedGroups.has(groupId)) return null
                                    renderedGroups.add(groupId)

                                    const groupModules = layer.filter(m => m.orGroupId === groupId)

                                    return (
                                        <div key={groupId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingLeft: '65px', minHeight: '110px' }}>
                                            <div style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#5F5E5A', marginRight: '6px' }}>One of</span>
                                                <div style={{ width: '12px', height: '75px', border: '2px solid rgba(0,0,0,0.1)', borderRight: 'none', borderRadius: '6px 0 0 6px' }} />
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                                                {groupModules.map((groupMod) => {
                                                    const isSelected = selectedMods.includes(groupMod.id)
                                                    const isGroupModCompulsory = groupMod.compulsoryFor?.includes(selectedMajor)
                                                    return (
                                                        <ModuleButton 
                                                            key={groupMod.id}
                                                            moduleCode={groupMod.id} 
                                                            isSelected={isSelected} 
                                                            isCompulsory={isGroupModCompulsory}
                                                            moduleTreeState={moduleTreeState}
                                                            onToggle={() => onToggleModule(groupMod.id)} 
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                }

                                const isSelected = selectedMods.includes(modInTree.id)
                                return (
                                    <div key={modInTree.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40px' }}>
                                        <ModuleButton 
                                            moduleCode={modInTree.id} 
                                            isSelected={isSelected} 
                                            isCompulsory={isCompulsory}
                                            moduleTreeState={moduleTreeState}
                                            onToggle={() => onToggleModule(modInTree.id)} 
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}