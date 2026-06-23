import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { rawSupabaseData } from '../assets/MockModuleDatabase';
import SelectMajor from './ModTree_components/ModTree_SelectMajor';
import ModuleTree from './ModTree_components/ModTree_ModTree';
import SelectedBasket from './ModTree_components/ModTree_SelectionBasket';

//Converting rawSupabaseData into a dictionary 
const moduleDatabase = rawSupabaseData.reduce((acc, mod) => {
    // Add module into dictionary if not already present
    if (!acc[mod.id]) acc[mod.id] = mod;

    /// Secondary details to a module
    // If the module is a pillar, also add its options into the dictionary
    if (mod.isPillar) {
        mod.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option;
        });
    }

    // If the module is a Level 4000 pathway, also add its options into the dictionary
    if (mod.isLevel4000Pathway) {
        mod.optionA.basket1.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option;
        });
        mod.optionA.basket2.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option;
        });
        mod.optionB.options.forEach(option => {
            if (!acc[option.id]) acc[option.id] = option;
        });
    }

    return acc;
}, {});

export default function App() {
    const location = useLocation();
    const [selectedMajor, setSelectedMajor] = useState(location.state?.selectedMajor ?? 'Empty-Major');
    const [selectedMods, setSelectedMods] = useState(location.state?.selectedMods ?? []);

    const handleToggleModule = (modId) => {
        setSelectedMods((currentList) => 
            currentList.includes(modId) ? currentList.filter(id => id !== modId) : [...currentList, modId]
        );
    };

    const filteredModules = rawSupabaseData.filter(mod => 
        mod.majors && mod.majors.includes(selectedMajor)
    );

    useEffect(() => {
        const savedState = location.state?.moduleTreeState;
        if (savedState) {
            setSelectedMajor(savedState.selectedMajor ?? 'Empty-Major');
            setSelectedMods(Array.isArray(savedState.selectedMods) ? savedState.selectedMods : []);
            if (typeof savedState.scrollPosition === 'number') {
                window.requestAnimationFrame(() => window.scrollTo({ top: savedState.scrollPosition }));
            }
        }
    }, [location.state]);

    const modulesByLvl = [1000, 2000, 3000, 4000].map(lvl => 
        filteredModules.filter(mod => mod.level === lvl)
    );

    return (
        <div className="min-h-screen bg-[#F7F6F2]">
        <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#F7F6F2' }}>
            <SelectMajor selectedMajor={selectedMajor} onMajorChange={setSelectedMajor} />

            {selectedMajor !== 'Empty-Major' ? (
                <ModuleTree 
                    modulesByLvl={modulesByLvl} 
                    selectedMods={selectedMods} 
                    selectedMajor={selectedMajor}
                    moduleTreeState={{ selectedMajor, selectedMods }}
                    onToggleModule={handleToggleModule} 
                />
            ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
                    Please select a major from the dropdown above to display your graduation pathway tree.
                </div>
            )}
        </div>

        <hr />

        {/* Modular Selection Basket Component */}
        <SelectedBasket 
            selectedMods={selectedMods}
            selectedMajor={selectedMajor}
            moduleDatabase={moduleDatabase}
            moduleTreeState={{ selectedMajor, selectedMods }}
            onToggleModule={handleToggleModule}
        />
        </div>
    );
}