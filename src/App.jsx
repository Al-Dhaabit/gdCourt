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
    const [currentCategory, setCurrentCategory] = useState('individual') // 'individual' or 'iste140'

    // Determine which category a judge should see
    const getJudgeCategory = (judgeId) => {
        if (judgeId === 'Khaled') return 'iste140'; // Khaled only sees ISTE140
        return 'individual'; // Default to individual
    };

    // Get the effective judge ID for Firebase (with suffix for ISTE140)
    const getEffectiveJudgeId = (judgeId, category) => {
        if (category === 'iste140' && judgeId !== 'Khaled') {
            return `${judgeId}_iste140`;
        }
        return judgeId;
    };

    // Load judge from session storage
    useEffect(() => {
        const savedJudge = sessionStorage.getItem('currentJudge')
        const savedCategory = sessionStorage.getItem('currentCategory')
        if (savedJudge) {
            setCurrentJudge(savedJudge)
            setCurrentCategory(savedCategory || getJudgeCategory(savedJudge))
        }
    }, [])

    const handleJudgeSelect = (judgeId) => {
        setCurrentJudge(judgeId)
        const category = getJudgeCategory(judgeId)
        setCurrentCategory(category)
        sessionStorage.setItem('currentJudge', judgeId)
        sessionStorage.setItem('currentCategory', category)
    }

    const handleCategorySwitch = (category) => {
        setCurrentCategory(category)
        sessionStorage.setItem('currentCategory', category)
        setCurrentView('dashboard') // Reset to dashboard when switching
        setSelectedContestantId(null)
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
        setCurrentCategory('individual')
        sessionStorage.removeItem('currentJudge')
        sessionStorage.removeItem('currentCategory')
    }

    if (!currentJudge) {
        return <JudgeSelect onSelect={handleJudgeSelect} />
    }

    // Admin Khaled (different from judge Khaled)
    if (currentJudge === 'AdminKhaled') {
        return <Leaderboard onLogout={handleLogout} />
    }

    // Check if judge can switch categories (only Laayba)
    const canSwitchCategory = currentJudge === 'Laayba';
    const effectiveJudgeId = getEffectiveJudgeId(currentJudge, currentCategory);

    return (
        <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>The gdCourt</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {canSwitchCategory && (
                        <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => handleCategorySwitch('individual')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: currentCategory === 'individual' ? 'var(--accent-primary)' : 'transparent',
                                    color: currentCategory === 'individual' ? '#000' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: currentCategory === 'individual' ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Individual
                            </button>
                            <button
                                onClick={() => handleCategorySwitch('iste140')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: currentCategory === 'iste140' ? 'var(--accent-primary)' : 'transparent',
                                    color: currentCategory === 'iste140' ? '#000' : 'var(--text-secondary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: currentCategory === 'iste140' ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ISTE140
                            </button>
                        </div>
                    )}
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
                        judgeId={effectiveJudgeId}
                        category={currentCategory}
                        onSelectContestant={handleContestantSelect}
                    />
                ) : (
                    <ScoringView
                        judgeId={effectiveJudgeId}
                        category={currentCategory}
                        contestantId={selectedContestantId}
                        onBack={handleBackToDashboard}
                    />
                )}
            </main>
        </div>
    )
}

export default App
