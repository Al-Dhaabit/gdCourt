import React, { useState, useEffect } from 'react';
import { contestants } from '../data/contestants';
import { iste140Contestants } from '../data/iste140Contestants';
import { getContestantsForJudge } from '../data/judgeAssignments';
import { useScoring } from '../hooks/useScoring';

const RUBRIC = [
    { id: 'visual', label: 'Visual Appeal', max: 2, desc: 'Design quality, layout, and aesthetic consistency.' },
    { id: 'creativity', label: 'Creativity & Originality', max: 3, desc: 'Innovation, uniqueness, and concept strength.' },
    { id: 'ux', label: 'User Experience (UX)', max: 3, desc: 'Navigation, usability, accessibility, responsiveness.' },
    { id: 'polish', label: 'Completeness & Polish', max: 2, desc: 'Functionality, attention to detail, finished feel.' }
];

const RUBRIC_ROUND2 = [
    { id: 'visual', label: 'Visual Appeal', max: 5, desc: 'Design quality, layout, and aesthetic consistency.' },
    { id: 'creativity', label: 'Creativity & Originality', max: 5, desc: 'Innovation, uniqueness, and concept strength.' },
    { id: 'ux', label: 'User Experience (UX) Quality', max: 5, desc: 'Navigation, usability, accessibility, responsiveness.' },
    { id: 'polish', label: 'Completeness & Polish', max: 5, desc: 'Functionality, attention to detail, finished feel.' }
];

const RUBRIC_ISTE140 = [
    { id: 'visual', label: 'Visual Appeal', max: 4, desc: 'Design quality, layout, and aesthetic consistency.' },
    { id: 'creativity', label: 'Creativity & Originality', max: 4, desc: 'Innovation, uniqueness, and concept strength.' },
    { id: 'ux', label: 'User Experience (UX) Quality', max: 4, desc: 'Navigation, usability, accessibility, responsiveness (compatibility).' },
    { id: 'polish', label: 'Completeness & Polish', max: 3, desc: 'Functionality, attention to detail, finished feel.' }
];

export default function ScoringView({ judgeId, category = 'individual', contestantId, onBack }) {
    const { getScore, saveScore, updateStatus } = useScoring();
    const [scores, setScores] = useState({ visual: '', creativity: '', ux: '', polish: '' });
    const [currentId, setCurrentId] = useState(contestantId);
    const [showThankYouModal, setShowThankYouModal] = useState(false);

    // Select rubric based on category and judge
    let rubric;
    if (category === 'iste140') {
        rubric = RUBRIC_ISTE140;
    } else if (judgeId === 'MrRashed') {
        rubric = RUBRIC_ROUND2;
    } else {
        rubric = RUBRIC;
    }
    const maxScore = rubric.reduce((sum, item) => sum + item.max, 0);

    // Load contestants based on category
    const allContestants = category === 'iste140' ? iste140Contestants : contestants;
    const assignedContestants = getContestantsForJudge(judgeId, allContestants);
    const currentContestant = allContestants.find(c => c.id === currentId);

    // Hide names for ISTE140 category or if judge is not MrRashed in individual category
    const hideNames = category === 'iste140' || (category === 'individual' && judgeId !== 'MrRashed');

    useEffect(() => {
        const contestantName = hideNames
            ? (category === 'iste140'
                ? `Section ${currentContestant?.section} - Group ${currentContestant?.team}`
                : `Contestant ${currentContestant?.id}`)
            : currentContestant?.name;
        updateStatus(judgeId, `Scoring ${contestantName} (${category === 'iste140' ? 'ISTE140' : 'Individual'})`);
    }, [judgeId, currentId, category, currentContestant]);

    const existingScore = getScore(judgeId, currentId);

    useEffect(() => {
        if (existingScore) {
            setScores(existingScore.details);
        } else {
            setScores({ visual: '', creativity: '', ux: '', polish: '' });
        }
    }, [currentId, existingScore]);

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

        // Show thank you message for MrRashed when he finishes the last contestant
        const currentIndex = assignedContestants.findIndex(c => c.id === currentId);
        if (judgeId === 'MrRashed' && currentIndex === assignedContestants.length - 1) {
            setShowThankYouModal(true);
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

    if (!currentContestant) return <div>Contestant not found</div>;

    const displayName = hideNames
        ? `Contestant ${currentContestant.id}`
        : currentContestant.name;

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
            </div >

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'white' }}>{displayName}</h2>
                <a
                    href={currentContestant.link}
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
                {rubric.map(item => (
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
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>/{maxScore}</span>
                </span>
            </div>

            {/* Thank You Modal */}
            {showThankYouModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div className="glass-panel" style={{
                        padding: '3rem',
                        maxWidth: '600px',
                        width: '90%',
                        textAlign: 'center',
                        transform: 'scale(1)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), float 6s ease-in-out infinite'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            color: 'var(--accent-primary)',
                            fontWeight: 'bold'
                        }}>
                            Thank You, Mr. Rashed!
                        </h2>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'white',
                            lineHeight: '1.6',
                            marginBottom: '2rem'
                        }}>
                            Thank you so much for your help! The Graphic Design Club really appreciates you taking the time to judge these projects. It means a lot to us.
                            <br /><br />
                            — Khaled, GDC President
                        </p>
                        <button
                            onClick={() => setShowThankYouModal(false)}
                            style={{
                                padding: '0.75rem 2rem',
                                background: 'var(--accent-primary)',
                                color: '#000',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
}
