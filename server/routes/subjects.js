const express = require("express");
const pool = require("../db");

const router = express.Router();

const SEMESTER_ID = 1;
const SEMESTER_LIMIT = 60;

// GET all subjects
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                s.id,
                s.name,
                s.allotted_lectures AS "allottedLectures",
                COUNT(l.id) AS "conductedLectures",
                COUNT(CASE WHEN l.status = 'PRESENT' THEN 1 END) AS "attendedLectures"
            FROM subjects s
            LEFT JOIN lectures l ON l.subject_id = s.id
            WHERE s.semester_id = $1
            GROUP BY s.id
            ORDER BY s.id
            `,
            [SEMESTER_ID]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({
            error: "Failed to fetch subjects"
        });
    }
});


// ADD subject
router.post("/", async (req, res) => {
    try {
        const { name, allottedLectures } = req.body;

        if (!name || allottedLectures === undefined) {
            return res.status(400).json({
                error: "Subject name and allotted lectures are required"
            });
        }

        const lectures = Number(allottedLectures);

        if (!Number.isInteger(lectures) || lectures <= 0) {
            return res.status(400).json({
                error: "Allotted lectures must be a positive integer"
            });
        }

        // Check current allocation
        const allocationResult = await pool.query(
            `
            SELECT COALESCE(SUM(allotted_lectures), 0) AS total
            FROM subjects
            WHERE semester_id = $1
            `,
            [SEMESTER_ID]
        );

        const currentAllocation =
            Number(allocationResult.rows[0].total);

        const newTotal = currentAllocation + lectures;

        if (newTotal > SEMESTER_LIMIT) {
            const excess = newTotal - SEMESTER_LIMIT;

            return res.status(400).json({
                error: "Lecture allocation mismatch",
                message: `You have allocated ${newTotal} lectures, but the semester limit is ${SEMESTER_LIMIT}. Reduce the allocation by ${excess} lectures.`,
                allocated: currentAllocation,
                requested: lectures,
                total: newTotal,
                limit: SEMESTER_LIMIT,
                excess: excess
            });
        }

        // Check duplicate subject
        const duplicate = await pool.query(
            `
            SELECT id
            FROM subjects
            WHERE semester_id = $1
            AND LOWER(name) = LOWER($2)
            `,
            [SEMESTER_ID, name.trim()]
        );

        if (duplicate.rows.length > 0) {
            return res.status(409).json({
                error: "Subject already exists"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO subjects
            (semester_id, name, allotted_lectures)
            VALUES ($1, $2, $3)
            RETURNING
                id,
                name,
                allotted_lectures AS "allottedLectures"
            `,
            [
                SEMESTER_ID,
                name.trim(),
                lectures
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error adding subject:", error);

        res.status(500).json({
            error: "Failed to add subject"
        });
    }
});


// UPDATE subject
router.put("/:id", async (req, res) => {
    try {
        const subjectId = Number(req.params.id);
        const { name, allottedLectures } = req.body;

        if (!Number.isInteger(subjectId)) {
            return res.status(400).json({
                error: "Invalid subject ID"
            });
        }

        const lectures = Number(allottedLectures);

        if (!name || !Number.isInteger(lectures) || lectures <= 0) {
            return res.status(400).json({
                error: "Valid subject name and allotted lectures are required"
            });
        }

        // Current subject allocation
        const currentSubject = await pool.query(
            `
            SELECT allotted_lectures
            FROM subjects
            WHERE id = $1
            AND semester_id = $2
            `,
            [subjectId, SEMESTER_ID]
        );

        if (currentSubject.rows.length === 0) {
            return res.status(404).json({
                error: "Subject not found"
            });
        }

        const oldAllocation =
            Number(currentSubject.rows[0].allotted_lectures);

        const totalResult = await pool.query(
            `
            SELECT COALESCE(SUM(allotted_lectures), 0) AS total
            FROM subjects
            WHERE semester_id = $1
            `,
            [SEMESTER_ID]
        );

        const currentTotal =
            Number(totalResult.rows[0].total);

        const newTotal =
            currentTotal - oldAllocation + lectures;

        if (newTotal > SEMESTER_LIMIT) {
            const excess = newTotal - SEMESTER_LIMIT;

            return res.status(400).json({
                error: "Lecture allocation mismatch",
                message: `Total allocation would become ${newTotal}, exceeding the semester limit of ${SEMESTER_LIMIT}.`,
                total: newTotal,
                limit: SEMESTER_LIMIT,
                excess: excess
            });
        }

        const result = await pool.query(
            `
            UPDATE subjects
            SET
                name = $1,
                allotted_lectures = $2
            WHERE id = $3
            AND semester_id = $4
            RETURNING
                id,
                name,
                allotted_lectures AS "allottedLectures"
            `,
            [
                name.trim(),
                lectures,
                subjectId,
                SEMESTER_ID
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Error updating subject:", error);

        res.status(500).json({
            error: "Failed to update subject"
        });
    }
});


// DELETE subject
router.delete("/:id", async (req, res) => {
    try {
        const subjectId = Number(req.params.id);

        if (!Number.isInteger(subjectId)) {
            return res.status(400).json({
                error: "Invalid subject ID"
            });
        }

        const result = await pool.query(
            `
            DELETE FROM subjects
            WHERE id = $1
            AND semester_id = $2
            RETURNING id, name
            `,
            [subjectId, SEMESTER_ID]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Subject not found"
            });
        }

        res.json({
            message: "Subject deleted successfully",
            subject: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting subject:", error);

        res.status(500).json({
            error: "Failed to delete subject"
        });
    }
});


module.exports = router;