import { useState, useEffect } from 'react'
import JudgeSelect from './components/JudgeSelect'
import Dashboard from './components/Dashboard'
import ScoringView from './components/ScoringView'
import { useScoring } from './hooks/useScoring'

import Leaderboard from './components/Leaderboard'

function App() {
    const [currentJudge, setCurrentJudge] = useState(null)
    const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'scoring'
    const [selectedContestantId, setSelectedContestantId] = useState(null)

    // Load judge from session storage if available (optional, but good for refresh)
    useEffect(() => {
        const savedJudge = sessionStorage.getItem('currentJudge')
        if (savedJudge) {
            setCurrentJudge(savedJudge)
        }
    }, [])

    const handleJudgeSelect = (judgeId) => {
        setCurrentJudge(judgeId)
        sessionStorage.setItem('currentJudge', judgeId)
    }

    const handleContestantSelect = (contestantId) => {
        setSelectedContestantId(contestantId)
        setCurrentView('scoring')
    }

    const handleBackToDashboard = () => {
        setCurrentView('dashboard')
        setSelectedContestantId(null)
    }

    const handleLogout = () => {
        setCurrentJudge(null)
        sessionStorage.removeItem('currentJudge')
    }

    if (!currentJudge) {
        return <JudgeSelect onSelect={handleJudgeSelect} />
    }

    if (currentJudge === 'Khaled') {
        return <Leaderboard onLogout={handleLogout} />
    }

    return (
        <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>gdCourt</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className="glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Logged in as: <strong style={{ color: 'var(--accent-secondary)' }}>{currentJudge}</strong>
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{ background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.875rem' }}
                    >
                        Switch Judge
                    </button>
                </div>
            </header>

            <main>
                {currentView === 'dashboard' ? (
                    <Dashboard
                        judgeId={currentJudge}
                        onSelectContestant={handleContestantSelect}
                    />
                ) : (
                    <ScoringView
                        judgeId={currentJudge}
                        contestantId={selectedContestantId}
                        onBack={handleBackToDashboard}
                    />
                )}
            </main>
        </div>
    )
}

export default App
