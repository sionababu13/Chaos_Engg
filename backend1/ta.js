const {
    calculatePercentage,
    getStatus,
    calculateCanMiss,
    calculateClassesRequired
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