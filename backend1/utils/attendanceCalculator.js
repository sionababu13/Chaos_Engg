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


module.exports = {
    calculatePercentage,
    getStatus
};