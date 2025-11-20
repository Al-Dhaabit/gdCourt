// Judge-specific contestant assignments
export const judgeAssignments = {
    'Rashed': [5, 25, 10, 22, 17, 2, 21, 6, 4, 11]
};

// Function to get contestants for a specific judge
export function getContestantsForJudge(judgeId, allContestants) {
    const assignedIds = judgeAssignments[judgeId];

    // If judge has specific assignments, filter contestants
    if (assignedIds) {
        return allContestants.filter(c => assignedIds.includes(c.id));
    }

    // Otherwise, return all contestants (for other judges)
    return allContestants;
}
