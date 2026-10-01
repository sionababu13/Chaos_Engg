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


function calculateClassesRequired(attended, conducted) {
    if (conducted === 0) {
        return 0;
    }

    if ((attended / conducted) >= 0.75) {
        return 0;
    }

    let required = 0;

    while (
        (attended + required) /
        (conducted + required) < 0.75
    ) {
        required++;
    }

    return required;
}


function checkRecoveryFeasibility(required, remaining) {
    return required <= remaining;
}


module.exports = {
    calculatePercentage,
    getStatus,
    calculateCanMiss,
    calculateClassesRequired,
    checkRecoveryFeasibility
};