const {
    calculateAttendance
} = require("./utils/attendanceCalculator");


console.log("TEST 1: Normal GREEN case");
console.log(
    calculateAttendance(9, 10, 15)
);


console.log("\nTEST 2: Normal RED case - recovery possible");
console.log(
    calculateAttendance(6, 10, 20)
);


console.log("\nTEST 3: RED case - recovery impossible");
console.log(
    calculateAttendance(5, 10, 11)
);


console.log("\nTEST 4: Exactly 75%");
console.log(
    calculateAttendance(9, 12, 15)
);


console.log("\nTEST 5: 100% attendance");
console.log(
    calculateAttendance(10, 10, 15)
);


console.log("\nTEST 6: No classes conducted");
console.log(
    calculateAttendance(0, 0, 15)
);