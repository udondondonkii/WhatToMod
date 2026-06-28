import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SelectMajor from './ModTree_components/ModTree_SelectMajor';
import ModuleTree from './ModTree_components/ModTree_ModTree';
import SelectedBasket from './ModTree_components/ModTree_SelectionBasket';

// Converts a raw Supabase module row back into the shape the rest of the app expects
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

// Build the flat moduleDatabase dictionary from the list of modules
function buildDatabase(modules) {
    const db = {};
    modules.forEach(mod => {
        if (!db[mod.id]) db[mod.id] = mod;

        if (mod.isPillar && mod.options) {
            mod.options.forEach(opt => {
                if (!db[opt.id]) db[opt.id] = opt;
            });
        }

        if (mod.isLevel4000Pathway) {
            mod.optionA?.basket1?.options?.forEach(opt => { if (!db[opt.id]) db[opt.id] = opt; });
            mod.optionA?.basket2?.options?.forEach(opt => { if (!db[opt.id]) db[opt.id] = opt; });
            mod.optionB?.options?.forEach(opt => { if (!db[opt.id]) db[opt.id] = opt; });
        }
    });
    return db;
}

export default function ModuleTreePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedMajor, setSelectedMajor] = useState(
        location.state?.selectedMajor ?? 'Empty-Major'
    );
    const [selectedMods, setSelectedMods] = useState(
        location.state?.selectedMods ?? []
    );

    const [allModules, setAllModules] = useState([]);    // full list from Supabase
    const [moduleDatabase, setModuleDatabase] = useState({}); // flat id→module dict
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all modules from Supabase once on mount
    useEffect(() => {
        async function fetchModules() {
            setLoading(true);
            const { data, error } = await supabase
                .from('modules')
                .select('*');

            if (error) {
                console.error('Error fetching modules:', error);
                setError('Failed to load modules. Please refresh.');
            } else {
                const modules = data.map(rowToModule);
                setAllModules(modules);
                setModuleDatabase(buildDatabase(modules));
            }
            setLoading(false);
        }

        fetchModules();
    }, []);

    // Restore scroll / state when navigating back
    useEffect(() => {
        const savedState = location.state?.moduleTreeState;
        if (savedState) {
            setSelectedMajor(savedState.selectedMajor ?? 'Empty-Major');
            setSelectedMods(Array.isArray(savedState.selectedMods) ? savedState.selectedMods : []);
            if (typeof savedState.scrollPosition === 'number') {
                window.requestAnimationFrame(() =>
                    window.scrollTo({ top: savedState.scrollPosition })
                );
            }
        }
    }, [location.state]);

    const handleToggleModule = (modId) => {
        setSelectedMods(current =>
            current.includes(modId)
                ? current.filter(id => id !== modId)
                : [...current, modId]
        );
    };

    const handleClearSelectedMods = () => setSelectedMods([]);

    const filteredModules = allModules.filter(
        mod => mod.majors && mod.majors.includes(selectedMajor)
    );

    const modulesByLvl = [1000, 2000, 3000, 4000].map(lvl =>
        filteredModules.filter(mod => mod.level === lvl)
    );

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                Loading modules…
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#c0392b' }}>
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F6F2]">
                    <div style={{ marginBottom: '16px' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#1f2937'
                    }}
                >
                    Back
                </button>
            </div>
            <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#F7F6F2', position: 'relative' }}>
                <SelectMajor selectedMajor={selectedMajor} onMajorChange={setSelectedMajor} />

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                    <div style={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 360px)' }}>
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
                </div>

                <div style={{ position: 'fixed', top: '110px', right: '20px', width: '320px', zIndex: 50 }}>
                    <SelectedBasket
                        selectedMods={selectedMods}
                        selectedMajor={selectedMajor}
                        moduleDatabase={moduleDatabase}
                        moduleTreeState={{ selectedMajor, selectedMods }}
                        onToggleModule={handleToggleModule}
                        onClearAll={handleClearSelectedMods}
                    />
                </div>
            </div>
        </div>
    );
}
