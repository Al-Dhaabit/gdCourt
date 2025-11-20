import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, remove } from 'firebase/database';

export function useScoring() {
    const [allScores, setAllScores] = useState({});
    const [statuses, setStatuses] = useState({});

    useEffect(() => {
        // Subscribe to scores
        const scoresRef = ref(db, 'scores');
        const unsubscribeScores = onValue(scoresRef, (snapshot) => {
            const data = snapshot.val();
            setAllScores(data || {});
        });

        // Subscribe to statuses
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

    const getJudgeProgress = (judgeId, totalContestants) => {
        const judgeScores = allScores[judgeId] || {};
        const scoredCount = Object.keys(judgeScores).length;
        return {
            scored: scoredCount,
            total: totalContestants,
            percentage: Math.round((scoredCount / totalContestants) * 100)
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

    const resetSystem = () => {
        remove(ref(db, 'scores'));
        remove(ref(db, 'status'));
        window.location.reload();
    };

    const resetRound1 = () => {
        const round1Judges = ['Laayba', 'Mariam', 'Khaleel'];
        round1Judges.forEach(judge => {
            remove(ref(db, `scores/${judge}`));
            remove(ref(db, `status/${judge}`));
        });
        window.location.reload();
    };

    const resetRound2 = () => {
        remove(ref(db, 'scores/Rashed'));
        remove(ref(db, 'status/Rashed'));
        window.location.reload();
    };

    return { saveScore, getScore, getJudgeProgress, allScores, updateStatus, getStatuses, resetSystem, resetRound1, resetRound2 };
}
