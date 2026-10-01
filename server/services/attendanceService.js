function calculateRecommendation(attended, conducted, remaining, required = 75) {
    attended = Number(attended);
    conducted = Number(conducted);
    remaining = Number(remaining);
    required = Number(required);

    // No lectures conducted yet
    if (conducted === 0) {
        return {
            type: "NO_DATA",
            message: "No lectures have been conducted yet.",
            canMiss: 0,
            needToAttend: 0,
            possible: true
        };
    }

    const currentPercentage = (attended / conducted) * 100;

    // ------------------------------------------------
    // CASE 1: Attendance is already >= required
    // ------------------------------------------------
    if (currentPercentage >= required) {

        let canMiss = 0;

        for (let missed = 0; missed <= remaining; missed++) {

            const futureAttendance =
                (attended / (conducted + missed)) * 100;

            if (futureAttendance >= required) {
                canMiss = missed;
            } else {
                break;
            }
        }

        return {
            type: "SAFE",
            message:
                canMiss > 0
                    ? `You can miss ${canMiss} more lecture${canMiss === 1 ? "" : "s"} and maintain ${required}% attendance.`
                    : `You should not miss any more lectures if you want to maintain ${required}% attendance.`,

            canMiss,
            needToAttend: 0,
            possible: true
        };
    }

    // ------------------------------------------------
    // CASE 2: Attendance is below required
    // ------------------------------------------------

    let needToAttend = null;

    for (let attendedFuture = 1; attendedFuture <= remaining; attendedFuture++) {

        const futureAttendance =
            ((attended + attendedFuture) /
                (conducted + attendedFuture)) * 100;

        if (futureAttendance >= required) {
            needToAttend = attendedFuture;
            break;
        }
    }

    // Cannot reach required attendance
    if (needToAttend === null) {

        const maximumPossibleAttendance =
            ((attended + remaining) /
                (conducted + remaining)) * 100;

        return {
            type: "BELOW",
            message:
                `Attendance is below ${required}%. Even if you attend all remaining lectures, you can reach only ${maximumPossibleAttendance.toFixed(2)}%.`,

            canMiss: 0,
            needToAttend: null,
            possible: false,

            maximumPossibleAttendance:
                Number(maximumPossibleAttendance.toFixed(2))
        };
    }

    return {
        type: "BELOW",
        message:
            `You need to attend the next ${needToAttend} consecutive lecture${needToAttend === 1 ? "" : "s"} to reach ${required}% attendance.`,

        canMiss: 0,
        needToAttend,
        possible: true
    };
}


module.exports = {
    calculateRecommendation
};