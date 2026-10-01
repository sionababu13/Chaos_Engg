# 📊 Upasthiti – Smart Student Attendance Management System

**Upasthiti** is a student-focused attendance management system designed to help students monitor their attendance subject-wise, maintain the required **75% attendance criteria**, and make informed decisions about their upcoming classes.

The application provides a simple and intuitive dashboard where students can manage subjects, record daily attendance, review their attendance history, and receive personalized recommendations to maintain or recover their attendance.

---

## 🎯 Problem Statement

Many colleges require students to maintain a minimum attendance percentage, commonly 75%, to be eligible for examinations.

Manually tracking attendance becomes challenging when:

* Different subjects have different numbers of conducted classes.
* Attendance needs to be recorded for individual subjects and dates.
* Students need to know how many more classes they can miss.
* Students below the required percentage need to calculate how many consecutive classes they must attend to recover.
* Students need to monitor their overall attendance throughout the semester.

**Upasthiti addresses these challenges through automated attendance calculations, subject-wise tracking, and smart recommendations.**

---

## ✨ Features

### 📚 Subject Management

* Add multiple subjects for a semester.
* Allocate lectures to individual subjects.
* Track attendance separately for every subject.
* View attended, absent, conducted, and remaining lectures.
* Prevent duplicate subject entries.
* Enforce a semester lecture allocation limit of 60 lectures.

### 🗓️ Daily Attendance Tracking

* Record attendance as Present or Absent.
* Select the subject and lecture date.
* Record attendance for different subjects on the same date.
* Prevent duplicate attendance records for the same subject and date.
* Support historical attendance entries.

### 📈 Attendance Dashboard

* View overall attendance percentage.
* Monitor total classes attended and conducted.
* Track the number of subjects added.
* View remaining semester lecture capacity.
* Monitor subject-wise attendance progress through visual indicators.

### 📋 Attendance History

* View all recorded attendance entries.
* Review subject names, dates, and attendance statuses.
* Edit existing attendance records.
* Delete incorrect records.
* Automatically recalculate attendance statistics after modifications.

### 🧮 Smart Attendance Recommendations

The system provides dynamic recommendations based on recorded attendance:

* Calculate the maximum number of additional classes a student can miss while maintaining 75% attendance.
* Determine how many consecutive classes a student must attend to reach the required percentage.
* Identify whether recovery is possible within the remaining allotted lectures.
* Display personalized recommendations for each subject.

### 🟢 Attendance Status

* **75% or above:** Attendance requirement satisfied.
* **Below 75%:** Attendance requirement not satisfied.
* Visual indicators help students quickly identify their attendance status.

### 👤 Authentication Interface

* Login and registration screens.
* Password confirmation during registration.
* Student dashboard with personalized welcome information.

> **Note:** Authentication is currently a frontend prototype. Verified login, persistent accounts, and database-backed sessions will be implemented during backend integration.

---

## 🛠️ Tech Stack

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| React      | Frontend development and UI components |
| Vite       | Development server and build tool      |
| JavaScript | Application logic and calculations     |
| HTML5      | Page structure                         |
| CSS3       | Styling and responsive design          |
| Node.js    | Planned backend runtime                |
| Express.js | Planned REST API                       |
| PostgreSQL | Planned persistent database            |

---

## 📂 Project Structure

```text
Chaos_Engg/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (LTS version recommended)
* npm
* Git
* Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/sionababu13/Chaos_Engg.git
```

### 2. Navigate to the Project Directory

```bash
cd Chaos_Engg
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Visit the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

---

## 📊 Attendance Calculation Logic

### 1. Current Attendance Percentage

The attendance percentage is calculated using:

```text
Attendance % = (Classes Attended / Total Classes Conducted) × 100
```

**Example:**

```text
Classes Conducted = 40
Classes Attended = 32

Attendance = (32 / 40) × 100
           = 80%
```

The student satisfies the 75% attendance requirement.

### 2. Maximum Additional Classes That Can Be Missed

The system calculates the maximum number of additional absences while maintaining the required attendance percentage.

If:

* A = Classes attended
* T = Total classes conducted
* x = Additional classes missed

Then:

```text
A / (T + x) ≥ 0.75
```

The system determines the maximum valid integer value of `x`, subject to the remaining allotted lectures.

### 3. Classes Required to Reach 75%

When attendance is below 75%, the system calculates the number of consecutive classes that must be attended.

If:

* A = Classes attended
* T = Total classes conducted
* x = Consecutive classes attended

Then:

```text
(A + x) / (T + x) ≥ 0.75
```

Solving this inequality gives the number of classes required to recover attendance.

The system also checks whether the required classes fit within the remaining allotted lectures.

### 4. Overall Attendance

Overall attendance is calculated using the combined number of attended and conducted classes across all subjects:

```text
Overall Attendance =
(Total Classes Attended / Total Classes Conducted) × 100
```

This avoids incorrectly averaging subject-wise percentages.

---

## 💡 Example

Consider the following attendance record:

```text
Subject: Database Management Systems

Classes Conducted: 40
Classes Attended: 28
Classes Absent: 12
```

Attendance:

```text
28 / 40 × 100 = 70%
```

The student is below the required 75%.

To recover:

```text
(28 + x) / (40 + x) ≥ 0.75

28 + x ≥ 30 + 0.75x

0.25x ≥ 2

x ≥ 8
```

Therefore, the student must attend the next **8 consecutive classes** to reach 75% attendance.

---

## 🔮 Future Enhancements

* Backend integration using Node.js and Express.js.
* PostgreSQL database for permanent data storage.
* Secure student authentication and authorization.
* Persistent attendance records across login sessions.
* Calendar-based attendance tracking.
* Attendance graphs and visual analytics.
* Low-attendance notifications.
* Attendance report export (PDF/CSV).
* Semester-wise attendance analytics.
* Improved mobile responsiveness.
* Cloud deployment.

---

## 👩‍💻 Project Information

**Project Name:** Upasthiti – Smart Student Attendance Management System

**Repository:** [Chaos_Engg](https://github.com/sionababu13/Chaos_Engg)

**Project Type:** Student Academic Project

**Current Development Stage:** Frontend implementation with backend integration in progress.

---

## 📄 License

This project is developed for educational and academic purposes.
