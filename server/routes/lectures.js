const express = require("express");
const pool = require("../db");

const router = express.Router();

const SEMESTER_ID = 1;
const SEMESTER_LIMIT = 60;


// GET attendance history
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                l.id,
                l.lecture_number AS "lectureNumber",
                l.lecture_date AS "date",
                l.status,
                s.id AS "subjectId",
                s.name AS "subjectName"
            FROM lectures l
            JOIN subjects s
                ON s.id = l.subject_id
            WHERE s.semester_id = $1
            ORDER BY l.lecture_date DESC, l.lecture_number DESC
            `,
            [SEMESTER_ID]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching lectures:", error);

        res.status(500).json({
            error: "Failed to fetch attendance history"
        });
    }
});


// ADD lecture
router.post("/", async (req, res) => {
    try {
        const {
            subjectId,
            date,
            status
        } = req.body;

        if (!subjectId || !date || !status) {
            return res.status(400).json({
                error: "Subject, date and attendance status are required"
            });
        }

        if (!["PRESENT", "ABSENT"].includes(status)) {
            return res.status(400).json({
                error: "Status must be PRESENT or ABSENT"
            });
        }

        // Check subject
        const subjectResult = await pool.query(
            `
            SELECT
                id,
                name,
                allotted_lectures
            FROM subjects
            WHERE id = $1
            AND semester_id = $2
            `,
            [subjectId, SEMESTER_ID]
        );

        if (subjectResult.rows.length === 0) {
            return res.status(404).json({
                error: "Subject not found"
            });
        }

        const subject = subjectResult.rows[0];

        // Count semester lectures
        const semesterCountResult = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM lectures l
            JOIN subjects s
                ON s.id = l.subject_id
            WHERE s.semester_id = $1
            `,
            [SEMESTER_ID]
        );

        const semesterConducted =
            Number(semesterCountResult.rows[0].total);

        if (semesterConducted >= SEMESTER_LIMIT) {
            return res.status(400).json({
                error: "Semester lecture limit reached",
                message: `All ${SEMESTER_LIMIT} semester lectures have already been conducted.`
            });
        }

        // Count subject lectures
        const subjectCountResult = await pool.query(
            `
            SELECT COUNT(*) AS total
            FROM lectures
            WHERE subject_id = $1
            `,
            [subjectId]
        );

        const subjectConducted =
            Number(subjectCountResult.rows[0].total);

        if (subjectConducted >= subject.allotted_lectures) {
            return res.status(400).json({
                error: "Subject lecture limit reached",
                message: `${subject.name} has already reached its allotted ${subject.allotted_lectures} lectures.`
            });
        }

        // Generate global lecture number
        const lectureNumber = semesterConducted + 1;

        const result = await pool.query(
            `
            INSERT INTO lectures
            (
                subject_id,
                lecture_number,
                lecture_date,
                status
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                subject_id AS "subjectId",
                lecture_number AS "lectureNumber",
                lecture_date AS "date",
                status
            `,
            [
                subjectId,
                lectureNumber,
                date,
                status
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error adding lecture:", error);

        res.status(500).json({
            error: "Failed to record attendance"
        });
    }
});

// UPDATE lecture
router.put("/:id", async (req, res) => {
    try {
        const lectureId = Number(req.params.id);
        const { subjectId, date, status } = req.body;

        if (!Number.isInteger(lectureId)) {
            return res.status(400).json({
                error: "Invalid lecture ID"
            });
        }

        if (!subjectId || !date || !status) {
            return res.status(400).json({
                error: "Subject, date and attendance status are required"
            });
        }

        if (!["PRESENT", "ABSENT"].includes(status)) {
            return res.status(400).json({
                error: "Status must be PRESENT or ABSENT"
            });
        }

        // Check subject
        const subjectResult = await pool.query(
            `
            SELECT id, name
            FROM subjects
            WHERE id = $1
            AND semester_id = $2
            `,
            [subjectId, SEMESTER_ID]
        );

        if (subjectResult.rows.length === 0) {
            return res.status(404).json({
                error: "Subject not found"
            });
        }

        // Check lecture exists
        const lectureResult = await pool.query(
            `
            SELECT id
            FROM lectures
            WHERE id = $1
            `,
            [lectureId]
        );

        if (lectureResult.rows.length === 0) {
            return res.status(404).json({
                error: "Lecture not found"
            });
        }

        // Update attendance record
        const result = await pool.query(
            `
            UPDATE lectures
            SET
                subject_id = $1,
                lecture_date = $2,
                status = $3
            WHERE id = $4
            RETURNING
                id,
                subject_id AS "subjectId",
                lecture_number AS "lectureNumber",
                lecture_date AS "date",
                status
            `,
            [
                subjectId,
                date,
                status,
                lectureId
            ]
        );

        res.json({
            message: "Attendance record updated successfully",
            lecture: result.rows[0]
        });

    } catch (error) {
        console.error("Error updating lecture:", error);

        res.status(500).json({
            error: "Failed to update attendance record"
        });
    }
});
// DELETE lecture
router.delete("/:id", async (req, res) => {
    try {
        const lectureId = Number(req.params.id);

        if (!Number.isInteger(lectureId)) {
            return res.status(400).json({
                error: "Invalid lecture ID"
            });
        }

        const result = await pool.query(
            `
            DELETE FROM lectures
            WHERE id = $1
            RETURNING id
            `,
            [lectureId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Lecture not found"
            });
        }

        res.json({
            message: "Attendance record deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting lecture:", error);

        res.status(500).json({
            error: "Failed to delete attendance record"
        });
    }
});


module.exports = router;