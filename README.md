# 📊 Attendance Calculator

A simple and user-friendly **Attendance Management System** that helps students track their attendance subject-wise and determine whether they are meeting the required **75% attendance criteria**.

The application allows students to record their daily attendance and automatically calculates their attendance percentage, missed classes, and the number of classes they need to attend to reach the required percentage.

---

## 🎯 Problem Statement

Many colleges require students to maintain a minimum attendance percentage, commonly **75%**, to be eligible for examinations.

Manually calculating attendance becomes difficult when:

* Different subjects have different numbers of classes.
* Classes are conducted on different days.
* Students need to know how many classes they can still miss.
* Students below 75% need to know how many consecutive classes they must attend to recover.

This project provides a simple solution by maintaining attendance **subject-wise and day-wise**.

---

## ✨ Features

### 📚 Subject Management

* Add multiple subjects.
* Track attendance separately for every subject.
* View attendance statistics subject-wise.

### 🗓️ Daily Attendance Tracking

* Record whether the student was **Present** or **Absent** for each class.
* Attendance is calculated dynamically based on the recorded classes.

### 📈 Attendance Percentage

The application calculates attendance using:

```text
Attendance % = (Classes Attended / Total Classes Conducted) × 100
```

### 🟢 Attendance Status

The system indicates the student's attendance status:

* 🟢 **75% or above** → Attendance requirement satisfied
* 🔴 **Below 75%** → Attendance requirement not satisfied

### 🧮 Smart Attendance Calculation

The application can determine:

* How many classes the student can still miss while maintaining 75%.
* How many classes the student needs to attend continuously to reach 75%.
* Current attended classes.
* Total conducted classes.
* Current attendance percentage.

### 🔄 Flexible Class Count

There is no assumption that every subject has a fixed number of classes.

For example:

```text
Subject A → 42 classes conducted
Subject B → 51 classes conducted
Subject C → 37 classes conducted
```

The attendance percentage is calculated using the actual classes recorded.

---

## 🛠️ Tech Stack

| Technology | Purpose                    |
| ---------- | -------------------------- |
| React      | Frontend UI                |
| Vite       | Development and build tool |
| JavaScript | Application logic          |
| HTML       | Page structure             |
| CSS        | Styling                    |

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
│   └── ...
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

### 1. Clone the Repository

```bash
git clone https://github.com/sionababu13/Chaos_Engg.git
```

### 2. Navigate to the Project

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

The application will be available on the local development server provided by Vite.

---

## 📊 Attendance Logic

### Current Attendance

Suppose a student has:

```text
Classes Conducted = 40
Classes Attended = 32
```

Then:

```text
Attendance = (32 / 40) × 100
           = 80%
```

Since the attendance is above 75%, the student satisfies the minimum attendance requirement.

---

### ❌ Classes That Can Still Be Missed

If:

```text
Attended = A
Total Classes = T
```

The system determines the maximum number of additional absences while keeping attendance at or above 75%.

The calculation is based on:

```text
A / (T + x) ≥ 0.75
```

where `x` is the number of additional classes missed.

---

### 📈 Classes Required to Reach 75%

If the student's current attendance is below 75%, the system calculates the number of consecutive classes that must be attended.

If:

```text
Attended = A
Total = T
Required Attendance = 75%
```

we find `x` such that:

```text
(A + x) / (T + x) ≥ 0.75
```

This allows students to understand exactly how many upcoming classes they need to attend.

---

## 💡 Example

Suppose:

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

The system can then calculate how many upcoming classes must be attended continuously to bring the attendance back to 75%.

---

## 🔮 Future Improvements

Possible future enhancements include:

* 📅 Calendar-based attendance tracking
* 📊 Attendance graphs and visualizations
* 🔔 Low-attendance notifications
* 💾 Database integration
* 👤 Student accounts and authentication
* 📱 Improved mobile responsiveness
* 📤 Attendance report export
* 📈 Semester-wise attendance analytics
* 🌐 Cloud-based data storage

---

## 👩‍💻 Project

**Chaos Engineering Project**

Built using **React + Vite** as a student-focused attendance management solution.

---

## 📄 License

This project is developed for educational and project purposes.
