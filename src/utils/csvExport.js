export const downloadCSV = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8,"
        + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const formatLeaderboardData = (contestants, judges, allScores, maxScore, curveValue = 0, roundingMode = 'none') => {
    // Header row
    const header = [
        "Rank",
        "Contestant",
        "Section",
        "Group",
        "Website",
        ...judges.map(j => j.replace('_iste140', '')),
        `Raw Total (/${maxScore})`,
        `Curve`,
        `Final Total`,
        "Status"
    ];

    // Data rows
    const rows = contestants.map((contestant, index) => {
        const total = judges.reduce((sum, judge) => {
            const score = allScores[judge]?.[contestant.id];
            return sum + (score?.total || 0);
        }, 0);

        let curvedTotal = parseFloat(total) + parseFloat(curveValue || 0);

        if (roundingMode === 'floor') {
            curvedTotal = Math.floor(curvedTotal);
        } else if (roundingMode === 'ceil') {
            curvedTotal = Math.ceil(curvedTotal);
        } else {
            curvedTotal = curvedTotal.toFixed(2);
        }

        const isComplete = judges.every(judge => allScores[judge]?.[contestant.id]);

        const row = [
            index + 1,
            `"${contestant.name || contestant.members || ''}"`, // Quote to handle commas in names
            contestant.section || '-',
            contestant.team || '-',
            contestant.link || '-',
            ...judges.map(judge => {
                const score = allScores[judge]?.[contestant.id];
                return score ? score.total : '-';
            }),
            total,
            curveValue || 0,
            curvedTotal,
            isComplete ? "Complete" : "Pending"
        ];
        return row;
    });

    return [header, ...rows];
};
