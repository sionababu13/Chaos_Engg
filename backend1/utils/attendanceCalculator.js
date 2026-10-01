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


function calculateAttendance(attended, conducted, allotted) {
    const remaining = allotted - conducted;

    const percentage = calculatePercentage(
        attended,
        conducted
    );

    const status = getStatus(percentage);

    let canMiss = 0;
    let classesRequired = 0;
    let recoveryPossible = true;
    let recommendation = "";


    if (conducted === 0) {

        recommendation =
            "No classes have been conducted yet.";

    } else if (status === "GREEN") {

        canMiss = calculateCanMiss(
            attended,
            conducted,
            remaining
        );

        recommendation =
            `You can miss ${canMiss} more class(es) and stay above 75%.`;

    } else {

        classesRequired =
            calculateClassesRequired(
                attended,
                conducted
            );

        recoveryPossible =
            checkRecoveryFeasibility(
                classesRequired,
                remaining
            );

        if (recoveryPossible) {

            recommendation =
                `Attend the next ${classesRequired} class(es) consecutively to reach 75%.`;

        } else {

            recommendation =
                `75% cannot be reached within the remaining lectures.`;
        }
    }


    return {
        attended,
        conducted,
        allotted,
        remaining,
        percentage: Number(percentage.toFixed(2)),
        status,
        canMiss,
        classesRequired,
        recoveryPossible,
        recommendation
    };
}


module.exports = {
    calculatePercentage,
    getStatus,
    calculateCanMiss,
    calculateClassesRequired,
    checkRecoveryFeasibility,
    calculateAttendance
};