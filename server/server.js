const express = require("express");
const cors = require("cors");
require("dotenv").config();

const subjectRoutes = require("./routes/subjects");
const lectureRoutes = require("./routes/lectures");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Attendance Tracker API is running"
    });
});

app.use("/api/subjects", subjectRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});