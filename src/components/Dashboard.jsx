import React from 'react';
import { contestants } from '../data/contestants';
import { iste140Contestants } from '../data/iste140Contestants';
import { getContestantsForJudge } from '../data/judgeAssignments';
import { useScoring } from '../hooks/useScoring';

export default function Dashboard({ judgeId, category = 'individual', onSelectContestant }) {
    const { getScore, getJudgeProgress, updateStatus } = useScoring();

    // Load contestants based on category
    const allContestants = category === 'iste140' ? iste140Contestants : contestants;
    const assignedContestants = getContestantsForJudge(judgeId, allContestants);

    const progress = getJudgeProgress(judgeId, assignedContestants.map(c => c.id));

    // Hide names for ISTE140 category or if judge is not MrRashed in individual category
    const hideNames = category === 'iste140' || (category === 'individual' && judgeId !== 'MrRashed');

    React.useEffect(() => {
        updateStatus(judgeId, `Viewing Dashboard (${category === 'iste140' ? 'ISTE140' : 'Individual'})`);
    }, [judgeId, category]);

    // Safety check
    if (!assignedContestants || assignedContestants.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                <h2>No contestants assigned</h2>
                <p>Judge ID: {judgeId}</p>
                <p>Category: {category}</p>
                <p>Please contact the administrator.</p>
            </div>
        );
    }

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
                {assignedContestants.map(contestant => {
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
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                {isComplete && (
                                    <span style={{
                                        color: 'var(--accent-success)',
                                        fontSize: '1.2rem'
                                    }}>
                                        ✓
                                    </span>
                                )}
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'white' }}>
                                {hideNames
                                    ? `Contestant ${contestant.id}`
                                    : contestant.name
                                }
                            </h3>
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
        </div >
    );
}
