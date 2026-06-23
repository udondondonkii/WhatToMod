import react from 'react'

export default function SelectMajor({ selectedMajor, onMajorChange }) {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', marginBottom: '20px', color: '#1a1a18' }}>
            <h1 style={{ color: '#F76F44', fontWeight: '700', fontSize: '24px', margin: '0 0 12px 0' }}>What<span style={{ color: '#2564F8' }}>To</span>Mod</h1>
            <label style={{ display: 'block', marginBottom: '8px', color: '#5F5E5A', fontWeight: '500', fontSize: '14px' }}>Choose your Major</label>
            <select value={selectedMajor} onChange={(e) => onMajorChange(e.target.value)} style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff',
                color: '#1a1a18',
                fontFamily: 'inherit',
                fontSize: '14px',
                cursor: 'pointer'
            }}>
                <option value="Empty-Major">-</option>
                <option value="DSA-Major">Data Science & Analytics</option>
                <option value="BZA-Major">Business Analytics</option>
            </select>
        </div>
    )
}
