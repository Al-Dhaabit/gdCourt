import React, { useState, useEffect } from 'react';
import { useScoring } from '../hooks/useScoring';
import { contestants } from '../data/contestants';
import { judgeAssignments } from '../data/judgeAssignments';

export default function Leaderboard({ onLogout }) {
    const { allScores, getStatuses, resetSystem, resetRound1, resetRound2 } = useScoring();
    const statuses = getStatuses();

    const calculateTotalScore = (contestantId, judges) => {
        let total = 0;
        judges.forEach(judge => {
            if (allScores[judge]?.[contestantId]) {
                total += allScores[judge][contestantId].total;
            }
        });
        return total;
    };

    const round1Judges = ['Laayba', 'Mariam', 'Khaleel'];
    const round2Judges = ['Rashed'];
    const judgeDisplayNames = { 'Rashed': 'Mr. Rashed' };
    const round2Contestants = contestants.filter(c => judgeAssignments['Rashed'].includes(c.id));

    const sortedRound1 = [...contestants].sort((a, b) => {
        return calculateTotalScore(b.id, round1Judges) - calculateTotalScore(a.id, round1Judges);
    });

    const sortedRound2 = [...round2Contestants].sort((a, b) => {
        return calculateTotalScore(b.id, round2Judges) - calculateTotalScore(a.id, round2Judges);
    });

    const renderJudgeStatus = (judges, title) => (
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>{title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {judges.map(judge => {
                    const status = statuses[judge];
                    const isOnline = status && (Date.now() - status.timestamp < 30000);
                    const displayName = judgeDisplayNames[judge] || judge;

                    return (
                        <div key={judge} style={{
                            padding: '1rem',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            borderLeft: `4px solid ${isOnline ? 'var(--accent-success)' : 'var(--text-secondary)'}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold' }}>{displayName}</span>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    background: isOnline ? 'rgba(74, 222, 128, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                                    color: isOnline ? 'var(--accent-success)' : 'var(--text-secondary)'
                                }}>
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                {isOnline ? status.status : 'Last seen: ' + (status ? new Date(status.timestamp).toLocaleTimeString() : 'Never')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderLeaderboard = (sortedContestants, judges, title) => (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{title}</h2>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Rank</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Contestant</th>
                            <th style={{ textAlign: 'right', padding: '1rem', color: 'var(--text-secondary)' }}>Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedContestants.map((contestant, index) => (
                            <tr key={contestant.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: index < 3 ? 'var(--accent-primary)' : 'inherit' }}>
                                    #{index + 1}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold', color: 'white' }}>
                                        #{contestant.id} - <a
                                            href={contestant.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: 'white',
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.textDecoration = 'none';
                                            }}
                                        >
                                            {contestant.name}
                                        </a>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {calculateTotalScore(contestant.id, judges)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            if (window.confirm('ARE YOU SURE? This will delete ALL Round 1 scores.')) {
                                resetRound1();
                            }
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(248, 113, 113, 0.1)',
                            border: '1px solid var(--accent-danger)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-danger)',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}
                    >
                        ⚠ Reset Round 1
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('ARE YOU SURE? This will delete ALL Round 2 scores.')) {
                                resetRound2();
                            }
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(248, 113, 113, 0.1)',
                            border: '1px solid var(--accent-danger)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-danger)',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}
                    >
                        ⚠ Reset Round 2
                    </button>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Round 1 Section */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>🏆 Round 1</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {renderJudgeStatus(round1Judges, 'Round 1 Judges')}
                    {renderLeaderboard(sortedRound1, round1Judges, 'Round 1 Leaderboard')}
                </div>
            </div>

            {/* Round 2 Section */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginBottom: '1rem' }}>🏆 Round 2</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {renderJudgeStatus(round2Judges, 'Round 2 Judges')}
                    {renderLeaderboard(sortedRound2, round2Judges, 'Round 2 Leaderboard')}
                </div>
            </div>
        </div>
    );
}
