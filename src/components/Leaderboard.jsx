import React, { useState, useEffect } from 'react';
import { useScoring } from '../hooks/useScoring';
import { contestants } from '../data/contestants';

export default function Leaderboard({ onLogout }) {
    const { allScores, getStatuses, resetSystem } = useScoring();
    const statuses = getStatuses();

    const calculateTotalScore = (contestantId) => {
        let total = 0;
        Object.values(allScores).forEach(judgeScores => {
            if (judgeScores[contestantId]) {
                total += judgeScores[contestantId].total;
            }
        });
        return total;
    };

    const sortedContestants = [...contestants].sort((a, b) => {
        return calculateTotalScore(b.id) - calculateTotalScore(a.id);
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            if (window.confirm('ARE YOU SURE? This will delete ALL scores and reset the system.')) {
                                resetSystem();
                            }
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(248, 113, 113, 0.1)',
                            border: '1px solid var(--accent-danger)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--accent-danger)',
                            fontWeight: 'bold'
                        }}
                    >
                        ⚠ Reset System
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Live Status Section */}
                <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Live Judge Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Laayba', 'Mariam', 'Khaleel'].map(judge => {
                            const status = statuses[judge];
                            const isOnline = status && (Date.now() - status.timestamp < 30000); // 30s timeout

                            return (
                                <div key={judge} style={{
                                    padding: '1rem',
                                    background: 'var(--bg-card)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    borderLeft: `4px solid ${isOnline ? 'var(--accent-success)' : 'var(--text-secondary)'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold' }}>{judge}</span>
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

                {/* Leaderboard Section */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Contestant Leaderboard</h2>
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
                                            <div style={{ fontWeight: 'bold', color: 'white' }}>#{contestant.id} - {contestant.name}</div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {calculateTotalScore(contestant.id)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
