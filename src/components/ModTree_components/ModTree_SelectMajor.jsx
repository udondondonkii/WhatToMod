import react from 'react'

export default function SelectMajor({ selectedMajor, onMajorChange }) {
    return (
        <div style={{
            padding: '20px',
            fontFamily: 'sans-serif',
            marginBottom: '24px',
            color: '#1a1a18',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            width: '100%'
        }}>
            <h1 style={{ color: '#F76F44', fontWeight: '700', fontSize: '24px', margin: '0 0 12px 0' }}>What<span style={{ color: '#2564F8' }}>To</span>Mod</h1>
            <label style={{ display: 'block', marginBottom: '10px', color: '#4B5563', fontWeight: '600', fontSize: '14px' }}>Choose your Major</label>
            <select value={selectedMajor} onChange={(e) => onMajorChange(e.target.value)} style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#111827',
                fontFamily: 'inherit',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)'
            }}>
                <option value="Empty-Major">-</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Business Artificial Intelligence Systems">Business Artificial Intelligence Systems</option>
                <option value="BZA-Major">Business Analytics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="DSA-Major">Data Science & Analytics</option>
            </select>
        </div>
    )
}
