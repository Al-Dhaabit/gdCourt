import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, remove } from 'firebase/database';

export function useScoring() {
    const [allScores, setAllScores] = useState({});
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        // Subscribe to all scores
        const scoresRef = ref(db, 'scores');
        const unsubscribeScores = onValue(scoresRef, (snapshot) => {
            const data = snapshot.val();
            setAllScores(data || {});
        });

        // Subscribe to all statuses
        const statusRef = ref(db, 'status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            setStatuses(data || {});
        });

        return () => {
            unsubscribeScores();
            unsubscribeStatus();
        };
    }, []);

    const saveScore = (judgeId, contestantId, scoreData) => {
        const scoreRef = ref(db, `scores/${judgeId}/${contestantId}`);
        set(scoreRef, scoreData);
    };

    const getScore = (judgeId, contestantId) => {
        return allScores[judgeId]?.[contestantId] || null;
    };

    const getJudgeProgress = (judgeId, assignedContestantIds) => {
        const judgeScores = allScores[judgeId] || {};
        // Filter scores to only include those in the assigned list
        // Convert assigned IDs to strings for comparison with Firebase keys (which are always strings)
        const assignedIdsStr = assignedContestantIds.map(String);
        const scoredCount = Object.keys(judgeScores).filter(id => assignedIdsStr.includes(String(id))).length;

        const total = assignedContestantIds.length;
        return {
            scored: scoredCount,
            total: total,
            percentage: total === 0 ? 0 : Math.round((scoredCount / total) * 100)
        };
    };

    const updateStatus = (judgeId, status) => {
        const statusRef = ref(db, `status/${judgeId}`);
        update(statusRef, {
            status,
            timestamp: Date.now()
        });
    };

    const getStatuses = () => {
        return statuses;
    };

    const resetRound1 = () => {
        // Reset Round 1 judges (Laayba, Mariam, Khaleel)
        remove(ref(db, 'scores/Laayba'));
        remove(ref(db, 'scores/Mariam'));
        remove(ref(db, 'scores/Khaleel'));
        remove(ref(db, 'status/Laayba'));
        remove(ref(db, 'status/Mariam'));
        remove(ref(db, 'status/Khaleel'));
        window.location.reload();
    };

    const resetRound2 = () => {
        // Reset Round 2 judge (MrRashed)
        remove(ref(db, 'scores/MrRashed'));
        remove(ref(db, 'status/MrRashed'));
        window.location.reload();
    };

    const resetISTE140 = () => {
        // Reset ISTE140 judges
        remove(ref(db, 'scores/Laayba_iste140'));
        remove(ref(db, 'scores/Khaled'));
        remove(ref(db, 'status/Laayba_iste140'));
        remove(ref(db, 'status/Khaled'));
        window.location.reload();
    };

    return { saveScore, getScore, getJudgeProgress, allScores, updateStatus, getStatuses, resetRound1, resetRound2, resetISTE140 };
}
