import React from 'react';
import { contestants } from '../data/contestants';
import { useScoring } from '../hooks/useScoring';

export default function Dashboard({ judgeId, onSelectContestant }) {
    const { getScore, getJudgeProgress, updateStatus } = useScoring();
    const progress = getJudgeProgress(judgeId, contestants.length);

    React.useEffect(() => {
        updateStatus(judgeId, 'Viewing Dashboard');
    }, [judgeId]);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Scoring Dashboard</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progress.percentage}%`,
                            height: '100%',
                            background: 'var(--accent-primary)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {progress.scored} / {progress.total} Completed
                    </span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
            }}>
                {contestants.map(contestant => {
                    const score = getScore(judgeId, contestant.id);
                    const isComplete = !!score;

                    return (
                        <button
                            key={contestant.id}
                            onClick={() => onSelectContestant(contestant.id)}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                position: 'relative',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                border: isComplete ? '1px solid var(--accent-success)' : '1px solid var(--border-color)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    #{contestant.id}
                                </span>
                                {isComplete && (
                                    <span style={{
                                        color: 'var(--accent-success)',
                                        fontSize: '1.2rem'
                                    }}>
                                        ✓
                                    </span>
                                )}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>Contestant {contestant.id}</h3>
                            {isComplete ? (
                                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Score: </span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{score.total}</span>
                                </div>
                            ) : (
                                <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Pending</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
