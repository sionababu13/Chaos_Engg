function calculatePercentage(attended, conducted) {
    if (conducted === 0) {
        return 0;
    }

    return (attended / conducted) * 100;
}


function getStatus(percentage) {
    if (percentage >= 75) {
        return "GREEN";
    }

    return "RED";
}


function calculateCanMiss(attended, conducted, remaining) {
    if (conducted === 0) {
        return 0;
    }

    let canMiss = Math.floor(
        (attended / 0.75) - conducted
    );

    if (canMiss < 0) {
        canMiss = 0;
    }

    return Math.min(canMiss, remaining);
}


module.exports = {
    calculatePercentage,
    getStatus,
    calculateCanMiss
};