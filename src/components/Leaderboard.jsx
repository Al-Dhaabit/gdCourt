import React, { useState, useEffect } from 'react';
import { contestants } from '../data/contestants';
import { iste140Contestants } from '../data/iste140Contestants';
import { judgeAssignments } from '../data/judgeAssignments';
import { useScoring } from '../hooks/useScoring';

export default function Leaderboard({ onLogout }) {
    const { allScores, getStatuses, resetRound1, resetRound2, resetISTE140 } = useScoring();
    const [activeCategory, setActiveCategory] = useState('individual');
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetType, setResetType] = useState(null);
    const statuses = getStatuses();

    const handleResetClick = (type) => {
        setResetType(type);
        setShowResetModal(true);
    };

    const confirmReset = () => {
        if (resetType === 'round1') {
            resetRound1();
        } else if (resetType === 'round2') {
            resetRound2();
        } else if (resetType === 'iste140') {
            resetISTE140();
        }
        setShowResetModal(false);
    };

    const calculateTotalScore = (contestantId, judges) => {
        return judges.reduce((sum, judge) => {
            const score = allScores[judge]?.[contestantId];
            return sum + (score?.total || 0);
        }, 0);
    };

    // Individual category
    const round1Judges = ['Laayba', 'Mariam', 'Khaleel'];
    const round2Judges = ['MrRashed'];
    const round2Contestants = contestants.filter(c => judgeAssignments['MrRashed']?.includes(c.id));

    const sortedRound1 = [...contestants].sort((a, b) => {
        return calculateTotalScore(b.id, round1Judges) - calculateTotalScore(a.id, round1Judges);
    });

    const sortedRound2 = [...round2Contestants].sort((a, b) => {
        return calculateTotalScore(b.id, round2Judges) - calculateTotalScore(a.id, round2Judges);
    });

    // ISTE140 category
    const iste140Judges = ['Laayba_iste140', 'Khaled'];
    const sortedISTE140 = [...iste140Contestants].sort((a, b) => {
        return calculateTotalScore(b.id, iste140Judges) - calculateTotalScore(a.id, iste140Judges);
    });

    const renderLeaderboard = (sortedList, judges, title, maxScore) => (
        <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{title}</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Rank</th>
                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Contestant</th>
                            {judges.map(judge => (
                                <th key={judge} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {judge.replace('_iste140', '')}
                                </th>
                            ))}
                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedList.map((contestant, index) => {
                            const total = calculateTotalScore(contestant.id, judges);
                            const isComplete = judges.every(judge => allScores[judge]?.[contestant.id]);

                            return (
                                <tr key={contestant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                        #{index + 1}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600', color: 'white' }}>
                                            {activeCategory === 'iste140'
                                                ? `Section ${contestant.section} - Group ${contestant.team}`
                                                : (contestant.name || contestant.members)
                                            }
                                        </div>
                                        {activeCategory === 'iste140' && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                {contestant.members}
                                            </div>
                                        )}
                                        <a
                                            href={contestant.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}
                                        >
                                            View Project ↗
                                        </a>
                                    </td>
                                    {judges.map(judge => {
                                        const score = allScores[judge]?.[contestant.id];
                                        return (
                                            <td key={judge} style={{ padding: '1rem', textAlign: 'center' }}>
                                                {score ? (
                                                    <span style={{ color: 'var(--accent-success)' }}>{score.total}</span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--accent-primary)' }}>
                                            {total} <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/{maxScore}</span>
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {isComplete ? (
                                            <span style={{ color: 'var(--accent-success)' }}>✓ Complete</span>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>Pending</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Admin Dashboard</h1>
                <button
                    onClick={onLogout}
                    style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                >
                    Logout
                </button>
            </header>

            {/* Category Tabs */}
            <div className="glass-panel" style={{ padding: '0.5rem', marginBottom: '2rem', display: 'inline-flex', gap: '0.5rem' }}>
                <button
                    onClick={() => setActiveCategory('individual')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: activeCategory === 'individual' ? 'var(--accent-primary)' : 'transparent',
                        color: activeCategory === 'individual' ? '#000' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: activeCategory === 'individual' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    Individual
                </button>
                <button
                    onClick={() => setActiveCategory('iste140')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: activeCategory === 'iste140' ? 'var(--accent-primary)' : 'transparent',
                        color: activeCategory === 'iste140' ? '#000' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        fontWeight: activeCategory === 'iste140' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    ISTE140
                </button>
            </div>

            {/* Judge Status - Universal for all judges */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>Judge Status</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {['Laayba', 'Mariam', 'Khaleel', 'MrRashed', 'Khaled'].map(judgeName => {
                        // For Laayba, check both her Individual and ISTE140 statuses and show the most recent
                        let status, lastSeen, isRecent;

                        if (judgeName === 'Laayba') {
                            const individualStatus = statuses['Laayba'];
                            const iste140Status = statuses['Laayba_iste140'];

                            const individualTime = individualStatus?.timestamp || 0;
                            const iste140Time = iste140Status?.timestamp || 0;

                            // Use whichever status is more recent
                            status = iste140Time > individualTime ? iste140Status : individualStatus;
                            lastSeen = status?.timestamp ? new Date(status.timestamp) : null;
                            isRecent = lastSeen && (Date.now() - lastSeen.getTime() < 60000);
                        } else {
                            status = statuses[judgeName];
                            lastSeen = status?.timestamp ? new Date(status.timestamp) : null;
                            isRecent = lastSeen && (Date.now() - lastSeen.getTime() < 60000);
                        }

                        return (
                            <div key={judgeName} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'white' }}>
                                    {judgeName}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: isRecent ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
                                    {status?.status || 'Offline'}
                                </div>
                                {lastSeen && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        {isRecent ? 'Active now' : `${Math.floor((Date.now() - lastSeen.getTime()) / 60000)}m ago`}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Leaderboards */}
            {activeCategory === 'individual' ? (
                <>
                    {renderLeaderboard(sortedRound1, round1Judges, 'Round 1 - All Contestants', 30)}

                    <div style={{ marginBottom: '2rem' }}>
                        <button
                            onClick={() => handleResetClick('round1')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--accent-danger)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Reset Round 1 (Judges)
                        </button>
                    </div>

                    {renderLeaderboard(sortedRound2, round2Judges, 'Round 2 - Top 10', 20)}

                    <button
                        onClick={() => handleResetClick('round2')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'var(--accent-danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Round 2 (Mr. Rashed)
                    </button>
                </>
            ) : (
                <>
                    {renderLeaderboard(sortedISTE140, iste140Judges, 'ISTE140 - All Teams', 30)}

                    <button
                        onClick={() => handleResetClick('iste140')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'var(--accent-danger)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Reset ISTE140 System
                    </button>
                </>
            )}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
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
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-panel" style={{
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-danger)' }}>
                            ⚠️ Confirm Reset
                        </h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Are you sure you want to reset all <strong style={{ color: 'white' }}>
                                {resetType === 'round1' ? 'Round 1' : resetType === 'round2' ? 'Round 2' : 'ISTE140'}
                            </strong> scores? This action cannot be undone!
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowResetModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--bg-secondary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--accent-danger)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
