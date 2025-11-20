import React, { useState, useEffect } from 'react';
import { contestants } from '../data/contestants';
import { getContestantsForJudge } from '../data/judgeAssignments';
import { useScoring } from '../hooks/useScoring';

const RUBRIC = [
    { id: 'visual', label: 'Visual Appeal', max: 2, desc: 'Design quality, layout, and aesthetic consistency.' },
    { id: 'creativity', label: 'Creativity & Originality', max: 3, desc: 'Innovation, uniqueness, and concept strength.' },
    { id: 'ux', label: 'User Experience (UX)', max: 3, desc: 'Navigation, usability, accessibility, responsiveness.' },
    { id: 'polish', label: 'Completeness & Polish', max: 2, desc: 'Functionality, attention to detail, finished feel.' }
];

export default function ScoringView({ judgeId, contestantId, onBack }) {
    const { getScore, saveScore, updateStatus } = useScoring();
    const [scores, setScores] = useState({ visual: '', creativity: '', ux: '', polish: '' });
    const [currentId, setCurrentId] = useState(contestantId);

    const assignedContestants = getContestantsForJudge(judgeId, contestants);
    const contestant = contestants.find(c => c.id === currentId);
    const existingScore = getScore(judgeId, currentId);

    useEffect(() => {
        if (existingScore) {
            setScores(existingScore.details);
        } else {
            setScores({ visual: '', creativity: '', ux: '', polish: '' });
        }
        updateStatus(judgeId, `Judging ${contestant.name}`);
    }, [currentId, judgeId, existingScore, contestant]);

    const handleScoreChange = (id, value, max) => {
        if (value === '') {
            setScores(prev => ({ ...prev, [id]: '' }));
            return;
        }
        const numVal = parseFloat(value);
        if (numVal >= 0 && numVal <= max) {
            setScores(prev => ({ ...prev, [id]: numVal }));
        }
    };

    const calculateTotal = () => {
        return Object.values(scores).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    };

    const handleSave = () => {
        const total = calculateTotal();
        saveScore(judgeId, currentId, {
            total,
            details: scores,
            timestamp: new Date().toISOString()
        });

        // Show thank you message for Rashed when he finishes the last contestant
        const currentIndex = assignedContestants.findIndex(c => c.id === currentId);
        if (judgeId === 'Rashed' && currentIndex === assignedContestants.length - 1) {
            setTimeout(() => {
                alert('🎉 That\'s the end! Thank you so much for agreeing to be a judge, Mr. Rashed. Your contribution is greatly appreciated!');
            }, 300);
        }
    };

    const handleNext = () => {
        handleSave();
        const currentIndex = assignedContestants.findIndex(c => c.id === currentId);
        if (currentIndex < assignedContestants.length - 1) {
            setCurrentId(assignedContestants[currentIndex + 1].id);
        }
    };

    const handlePrev = () => {
        handleSave();
        const currentIndex = assignedContestants.findIndex(c => c.id === currentId);
        if (currentIndex > 0) {
            setCurrentId(assignedContestants[currentIndex - 1].id);
        }
    };

    if (!contestant) return <div>Contestant not found</div>;

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                    ← Back to Dashboard
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handlePrev}
                        disabled={assignedContestants.findIndex(c => c.id === currentId) === 0}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            opacity: assignedContestants.findIndex(c => c.id === currentId) === 0 ? 0.5 : 1
                        }}
                    >
                        Previous
                    </button>
                    {assignedContestants.findIndex(c => c.id === currentId) === assignedContestants.length - 1 ? (
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-success)',
                                color: '#000',
                                fontWeight: 'bold'
                            }}
                        >
                            Save Score
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-primary)',
                                color: '#000',
                                fontWeight: 'bold'
                            }}
                        >
                            Save & Next
                        </button>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>{contestant.name}</h2>
                <a
                    href={contestant.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: 'var(--accent-primary)',
                        textDecoration: 'underline',
                        fontSize: '1.1rem',
                        display: 'inline-block',
                        marginTop: '0.5rem'
                    }}
                >
                    View Project Website ↗
                </a>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {RUBRIC.map(item => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem', alignItems: 'center' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>{item.label}</label>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    min="0"
                                    max={item.max}
                                    step="0.5"
                                    value={scores[item.id]}
                                    onChange={(e) => handleScoreChange(item.id, e.target.value, item.max)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        textAlign: 'center',
                                        fontSize: '1.1rem'
                                    }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    right: '-25px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem'
                                }}>
                                    /{item.max}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Total Score:</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                    {calculateTotal()}
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>/10</span>
                </span>
            </div>
        </div>
    );
}
