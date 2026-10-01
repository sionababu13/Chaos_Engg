const express = require("express");
const pool = require("../db");
const { calculateRecommendation } = require("../services/Attendanceservice");

const router = express.Router();

const SEMESTER_ID = 1;


// GET dashboard
router.get("/", async (req, res) => {
    try {

        // ==========================================
        // 1. GET SEMESTER SETTINGS
        // ==========================================

        const semesterResult = await pool.query(
            `
            SELECT
                total_lectures,
                required_attendance
            FROM semesters
            WHERE id = $1
            `,
            [SEMESTER_ID]
        );

        if (semesterResult.rows.length === 0) {
            return res.status(404).json({
                error: "Semester not found"
            });
        }

        const semester = semesterResult.rows[0];

        const totalLectures =
            Number(semester.total_lectures);

        const requiredAttendance =
            Number(semester.required_attendance);


        // ==========================================
        // 2. CALCULATE OVERALL ATTENDANCE
        // ==========================================

        const overallResult = await pool.query(
            `
            SELECT
                COUNT(*) AS conducted,
                COUNT(
                    CASE
                        WHEN status = 'PRESENT'
                        THEN 1
                    END
                ) AS attended
            FROM lectures l
            JOIN subjects s
                ON s.id = l.subject_id
            WHERE s.semester_id = $1
            `,
            [SEMESTER_ID]
        );

        const conducted =
            Number(overallResult.rows[0].conducted);

        const attended =
            Number(overallResult.rows[0].attended);

        const remaining =
            totalLectures - conducted;

        const percentage =
            conducted > 0
                ? Number(
                    ((attended / conducted) * 100).toFixed(2)
                )
                : 0;

        const status =
            conducted === 0
                ? "NO_DATA"
                : percentage >= requiredAttendance
                    ? "SAFE"
                    : "BELOW";


        // ==========================================
        // 3. OVERALL ATTENDANCE RECOMMENDATION
        // ==========================================

        const overallRecommendation =
            calculateRecommendation(
                attended,
                conducted,
                remaining,
                requiredAttendance
            );


        // ==========================================
        // 4. GET SUBJECT-WISE ATTENDANCE
        // ==========================================

        const subjectResult = await pool.query(
            `
            SELECT
                s.id,
                s.name,
                s.allotted_lectures,

                COUNT(l.id) AS conducted,

                COUNT(
                    CASE
                        WHEN l.status = 'PRESENT'
                        THEN 1
                    END
                ) AS attended

            FROM subjects s

            LEFT JOIN lectures l
                ON l.subject_id = s.id

            WHERE s.semester_id = $1

            GROUP BY
                s.id,
                s.name,
                s.allotted_lectures

            ORDER BY s.id
            `,
            [SEMESTER_ID]
        );


        // ==========================================
        // 5. CALCULATE EACH SUBJECT
        // ==========================================

        const subjects = subjectResult.rows.map(subject => {

            const allotted =
                Number(subject.allotted_lectures);

            const subjectConducted =
                Number(subject.conducted);

            const subjectAttended =
                Number(subject.attended);

            const subjectRemaining =
                allotted - subjectConducted;


            // Subject attendance percentage
            const subjectPercentage =
                subjectConducted > 0
                    ? Number(
                        (
                            (subjectAttended / subjectConducted) * 100
                        ).toFixed(2)
                    )
                    : 0;


            // Subject status
            const subjectStatus =
                subjectConducted === 0
                    ? "NO_DATA"
                    : subjectPercentage >= requiredAttendance
                        ? "SAFE"
                        : "BELOW";


            // Subject recommendation
            const recommendation =
                calculateRecommendation(
                    subjectAttended,
                    subjectConducted,
                    subjectRemaining,
                    requiredAttendance
                );


            return {
                id: Number(subject.id),

                name: subject.name,

                allotted,

                conducted: subjectConducted,

                attended: subjectAttended,

                remaining: subjectRemaining,

                percentage: subjectPercentage,

                status: subjectStatus,

                recommendation
            };
        });


        // ==========================================
        // 6. SEND DASHBOARD RESPONSE
        // ==========================================

        res.json({

            semester: {
                totalLectures,

                conductedLectures: conducted,

                remainingLectures: remaining,

                requiredAttendance
            },


            overall: {
                attended,

                conducted,

                percentage,

                status,

                recommendation: overallRecommendation
            },


            subjects
        });


    } catch (error) {

        console.error(
            "Error generating dashboard:",
            error
        );

        res.status(500).json({
            error: "Failed to generate dashboard"
        });
    }
});


module.exports = router;