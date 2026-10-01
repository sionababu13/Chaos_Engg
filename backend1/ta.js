const {
    calculatePercentage,
    getStatus,
    calculateCanMiss,
    calculateClassesRequired,
    checkRecoveryFeasibility
} = require("./utils/attendanceCalculator");


console.log("Percentage:", calculatePercentage(9, 10));

console.log("Status:", getStatus(90));

console.log(
    "Can miss:",
    calculateCanMiss(9, 10, 5)
);

console.log(
    "Classes required:",
    calculateClassesRequired(6, 10)
);

console.log(
    "Recovery possible:",
    checkRecoveryFeasibility(6, 10)
);

console.log(
    "Recovery possible:",
    checkRecoveryFeasibility(10, 1)
);