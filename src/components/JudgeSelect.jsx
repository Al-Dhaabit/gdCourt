import React from 'react';

const JUDGES = {
    'Laayba': 'justice',
    'Mariam': 'rabbits',
    'Khaleel': 'goat',
    'Khaled': 'lebanon'
};

export default function JudgeSelect({ onSelect }) {
    const [selectedJudge, setSelectedJudge] = React.useState(null);
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (JUDGES[selectedJudge] === password) {
            onSelect(selectedJudge);
        } else {
            setError('Incorrect password');
            setPassword('');
        }
    };

    const handleBack = () => {
        setSelectedJudge(null);
        setPassword('');
        setError('');
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, var(--bg-secondary), var(--bg-primary))'
        }}>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', width: '90%' }}>
                {!selectedJudge ? (
                    <>
                        <h1 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Welcome, Judge</h1>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Please select your profile to begin scoring.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.keys(JUDGES).map(judge => (
                                <button
                                    key={judge}
                                    onClick={() => setSelectedJudge(judge)}
                                    style={{
                                        padding: '1rem',
                                        background: 'transparent',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1.1rem',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 207, 122, 0.1)';
                                        e.target.style.borderColor = 'var(--accent-primary)';
                                        e.target.style.color = 'var(--accent-primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.borderColor = 'var(--border-color)';
                                        e.target.style.color = 'var(--text-primary)';
                                    }}
                                >
                                    {judge}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hello, {selectedJudge}</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your password to continue</p>
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: error ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                            />
                            {error && <p style={{ color: 'var(--accent-danger)', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={handleBack}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-secondary)',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    background: 'var(--accent-primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
