# AttendEase – Smart Student Attendance Management System

AttendEase is a student-focused attendance management system designed to help students track their subject-wise attendance, monitor attendance percentages, and plan their classes effectively to maintain the minimum required attendance.

The application provides a centralized dashboard where students can manage subjects, record daily attendance, review attendance history, and receive recommendations to maintain or improve their attendance.

## Features

### 1. Attendance Dashboard

* View overall attendance percentage across all subjects.
* Monitor total classes conducted, attended, and remaining.
* Get a quick overview of attendance status.
* Identify subjects that require attention.

### 2. Subject Management

* Add and manage subjects.
* Set the number of lectures allotted to each subject.
* Track conducted, attended, and remaining lectures.
* Maintain a semester limit of 60 lectures.
* Prevent duplicate subject entries.

### 3. Daily Attendance Tracking

* Mark attendance as Present or Absent.
* Record attendance for individual subjects by date.
* Prevent duplicate attendance records for the same subject and date.
* Update attendance records when necessary.
* Delete incorrect records while automatically updating subject statistics.

### 4. Attendance History

* View previously recorded attendance.
* Track attendance by subject and date.
* Edit attendance status and dates.
* Delete attendance entries.

### 5. Smart Attendance Recommendations

* Calculate the maximum number of future classes a student can miss while maintaining 75% attendance.
* Calculate how many consecutive classes are needed to recover from low attendance.
* Determine whether recovery is possible within the remaining allotted lectures.
* Display attendance status and recommendations for each subject.

### 6. User Authentication

* Login and registration interface.
* Password confirmation during registration.
* Backend authentication and persistent user accounts are planned for integration.

## Attendance Calculation

AttendEase calculates attendance using the following formulas:

**Subject Attendance Percentage**

$$
\text{Attendance} = \frac{\text{Classes Attended}}{\text{Classes Conducted}} \times 100
$$

**Overall Attendance Percentage**

$$
\text{Overall Attendance} = \frac{\text{Total Classes Attended}}{\text{Total Classes Conducted}} \times 100
$$

The overall attendance is calculated using the total attended and conducted lectures across all subjects, rather than taking the average of individual subject percentages.

**Minimum Required Attendance:** 75%

## Technology Stack

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| React.js   | Frontend development              |
| Vite       | Development server and build tool |
| JavaScript | Application logic                 |
| HTML5      | Page structure                    |
| CSS3       | Styling and responsive design     |
| Node.js    | Planned backend runtime           |
| Express.js | Planned REST API                  |
| PostgreSQL | Planned database                  |

## Project Structure

```text
AttendEase/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── assets/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

*The project structure may evolve as backend integration and additional features are implemented.*

## Getting Started

Follow these steps to run AttendEase locally.

### Prerequisites

Make sure the following tools are installed on your system:

* [Node.js](https://nodejs.org/)
* [Git](https://git-scm.com/)
* [Visual Studio Code](https://code.visualstudio.com/)

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

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## Current Development Status

| Component                         | Status      |
| --------------------------------- | ----------- |
| React frontend                    | Implemented |
| Login and registration UI         | Implemented |
| Subject management                | Implemented |
| Attendance recording              | Implemented |
| Attendance history                | Implemented |
| Edit and delete attendance        | Implemented |
| Attendance percentage calculation | Implemented |
| Smart attendance recommendations  | Implemented |
| Backend API integration           | In progress |
| PostgreSQL database integration   | Planned     |
| Persistent user authentication    | Planned     |
| Persistent attendance records     | Planned     |

**Note:** The current frontend uses React state for attendance data. Data persistence across page refreshes and user sessions will be available after backend and database integration.

## Future Enhancements

* Integrate a secure authentication system.
* Store user accounts, subjects, and attendance records in PostgreSQL.
* Synchronize attendance data across sessions and devices.
* Implement secure, user-specific API access.
* Add detailed attendance analytics and visual reports.
* Improve the application with additional student-focused features.

## Contribution

Contributions, suggestions, and feedback are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Submit a pull request.

## Team

**Project:** AttendEase – Smart Student Attendance Management System

**Repository:** [Chaos_Engg](https://github.com/sionababu13/Chaos_Engg)

---

*AttendEase – Track your attendance. Stay informed. Stay above 75%.*
