
import { useState } from "react";
import "./App.css";

function getAttendanceRecommendation(subject) {
  const { attended, conducted, allotted } = subject;

  const remaining = allotted - conducted;
  const percentage = conducted
    ? (attended / conducted) * 100
    : 0;

  // Maximum additional absences while maintaining 75%
  const safeAbsences = Math.max(
    0,
    Math.min(
      remaining,
      Math.floor((attended - 0.75 * conducted) / 0.75)
    )
  );

  // Number of consecutive classes required to reach 75%
  const classesNeeded =
    percentage >= 75
      ? 0
      : Math.ceil((0.75 * conducted - attended) / 0.25);

  // Check if recovery is possible within remaining lectures
  const canRecover =
    percentage >= 75 || classesNeeded <= remaining;

  return {
    percentage: Math.round(percentage),
    remaining,
    safeAbsences,
    classesNeeded,
    canRecover,
  };
}

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [subjectName, setSubjectName] = useState("");
  const [allotted, setAllotted] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceStatus, setAttendanceStatus] = useState("Present");

  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate semester statistics
  const totalAllotted = subjects.reduce(
    (sum, subject) => sum + subject.allotted,
    0
  );

  const totalConducted = subjects.reduce(
    (sum, subject) => sum + subject.conducted,
    0
  );

  const totalAttended = subjects.reduce(
    (sum, subject) => sum + subject.attended,
    0
  );

  const percentage = totalConducted
    ? Math.round((totalAttended / totalConducted) * 100)
    : 0;

  const remainingLectures = 60 - totalConducted;
  const unallocatedLectures = 60 - totalAllotted;

  // Login
  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;

    setUser({
      name: email.split("@")[0],
      email,
    });
  };

  // Registration
  const handleRegister = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setUser({ name, email });
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setSubjects([]);
    setAttendanceRecords([]);
    setActiveTab("dashboard");
  };

  // Add a new subject
  const handleAddSubject = (e) => {
    e.preventDefault();

    const count = Number(allotted);
    const name = subjectName.trim();

    if (!name || !Number.isInteger(count) || count <= 0) {
      alert("Please enter a valid subject name and lecture count.");
      return;
    }

    if (totalAllotted + count > 60) {
      alert(
        `You can allocate only ${unallocatedLectures} more lectures.`
      );
      return;
    }

    if (
      subjects.some(
        (subject) =>
          subject.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert("This subject already exists.");
      return;
    }

    const newSubject = {
      id: Date.now(),
      name,
      allotted: count,
      conducted: 0,
      attended: 0,
    };

    setSubjects((prev) => [...prev, newSubject]);

    setSubjectName("");
    setAllotted("");
    setShowAdd(false);
  };

  // Record attendance
  const handleRecordAttendance = (e) => {
    e.preventDefault();

    const subject = subjects.find(
      (s) => s.id === Number(selectedSubject)
    );

    if (!subject) {
      alert("Please select a subject.");
      return;
    }

    if (subject.conducted >= subject.allotted) {
      alert(
        "All allotted lectures for this subject have been conducted."
      );
      return;
    }

    const duplicate = attendanceRecords.some(
      (record) =>
        record.subjectId === subject.id &&
        record.date === attendanceDate
    );

    if (duplicate) {
      alert(
        "Attendance for this subject is already recorded on this date."
      );
      return;
    }

    const newRecord = {
      id: Date.now(),
      subjectId: subject.id,
      subjectName: subject.name,
      date: attendanceDate,
      status: attendanceStatus,
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);

    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subject.id
          ? {
              ...s,
              conducted: s.conducted + 1,
              attended:
                s.attended +
                (attendanceStatus === "Present" ? 1 : 0),
            }
          : s
      )
    );

    setShowRecord(false);
    setSelectedSubject("");
    setAttendanceDate(new Date().toISOString().split("T")[0]);
    setAttendanceStatus("Present");
  };

  // Edit an existing attendance record
  const handleEditAttendance = (e) => {
    e.preventDefault();

    if (!editingRecord) return;

    const oldRecord = attendanceRecords.find(
      (record) => record.id === editingRecord.id
    );

    if (!oldRecord) return;

    // Prevent duplicate subject/date combinations
    const duplicate = attendanceRecords.some(
      (record) =>
        record.id !== editingRecord.id &&
        record.subjectId === oldRecord.subjectId &&
        record.date === editingRecord.date
    );

    if (duplicate) {
      alert(
        "Attendance for this subject is already recorded on that date."
      );
      return;
    }

    // Update the history record
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.id === editingRecord.id
          ? {
              ...record,
              date: editingRecord.date,
              status: editingRecord.status,
            }
          : record
      )
    );

    // Recalculate the subject's attended count
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id !== oldRecord.subjectId) {
          return subject;
        }

        const oldAttended =
          oldRecord.status === "Present" ? 1 : 0;

        const newAttended =
          editingRecord.status === "Present" ? 1 : 0;

        return {
          ...subject,
          attended:
            subject.attended - oldAttended + newAttended,
        };
      })
    );

    setEditingRecord(null);
  };

  // Delete an attendance record
  const handleDeleteAttendance = (recordId) => {
    const record = attendanceRecords.find(
      (item) => item.id === recordId
    );

    if (!record) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) return;

    setAttendanceRecords((prev) =>
      prev.filter((item) => item.id !== recordId)
    );

    setSubjects((prev) =>
      prev.map((subject) =>
        subject.id === record.subjectId
          ? {
              ...subject,
              conducted: Math.max(0, subject.conducted - 1),
              attended: Math.max(
                0,
                subject.attended -
                  (record.status === "Present" ? 1 : 0)
              ),
            }
          : subject
      )
    );
  };

  // Login and registration pages
  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-brand">
            <div className="brand-logo">A</div>
            <span>AttendEase</span>
          </div>

          <div className="auth-content">
            <div className="auth-illustration">
              <div className="illustration-card">
                <div className="illustration-header">
                  <span>Attendance Overview</span>
                  <span className="illustration-dot">●</span>
                </div>

                <div className="illustration-chart">
                  <div className="chart-circle">
                    <div className="chart-inner">
                      <strong>75%</strong>
                      <small>Target</small>
                    </div>
                  </div>
                </div>

                <div className="illustration-lines">
                  <div><span className="line-purple" /></div>
                  <div><span className="line-green" /></div>
                  <div><span className="line-blue" /></div>
                </div>
              </div>

              <div className="floating-check">✓</div>
              <div className="floating-star">✦</div>
            </div>

            <h1>
              Stay on track.
              <br />
              Own your attendance.
            </h1>

            <p>
              A smarter way to monitor your classes, track your progress,
              and stay ahead throughout the semester.
            </p>
          </div>

          <div className="auth-footer">
            © 2026 AttendEase. Made for students.
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="mobile-brand">
              <div className="brand-logo">A</div>
              <span>AttendEase</span>
            </div>

            {page === "login" ? (
              <>
                <div className="form-heading">
                  <span className="form-eyebrow">WELCOME BACK</span>
                  <h2>Sign in to your account</h2>
                  <p>
                    Enter your details to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />

                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />

                  <div className="form-options">
                    <label className="remember">
                      <input type="checkbox" />
                      Remember me
                    </label>
                    <span className="forgot-text">
                      Forgot password?
                    </span>
                  </div>

                  <button className="auth-submit" type="submit">
                    Sign In <span>→</span>
                  </button>
                </form>

                <div className="auth-switch">
                  Don't have an account?
                  <button onClick={() => setPage("register")}>
                    Create account
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-heading">
                  <span className="form-eyebrow">GET STARTED</span>
                  <h2>Create your account</h2>
                  <p>
                    Join AttendEase and take control of your attendance.
                  </p>
                </div>

                <form onSubmit={handleRegister}>
                  <label htmlFor="register-name">Full Name</label>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />

                  <label htmlFor="register-email">Email Address</label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />

                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    name="password"
                    type="password"
                    minLength="6"
                    placeholder="Create a password"
                    required
                  />

                  <label htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    minLength="6"
                    placeholder="Re-enter your password"
                    required
                  />

                  <button className="auth-submit" type="submit">
                    Create Account <span>→</span>
                  </button>
                </form>

                <div className="auth-switch">
                  Already have an account?
                  <button onClick={() => setPage("login")}>
                    Sign in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-logo">A</div>
          <span>AttendEase</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <button
          className={`sidebar-link ${
            activeTab === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          ▦ <span>Dashboard</span>
        </button>

        <button
          className={`sidebar-link ${
            activeTab === "subjects" ? "active" : ""
          }`}
          onClick={() => setActiveTab("subjects")}
        >
          ▤ <span>My Subjects</span>
        </button>

        <button
          className={`sidebar-link ${
            activeTab === "history" ? "active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          ◷ <span>Attendance History</span>
        </button>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-details">
            <strong>{user.name}</strong>
            <small>Student Account</small>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            ↪
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-eyebrow">STUDENT PORTAL</p>
            <h1>
              {activeTab === "history"
                ? "Attendance History"
                : activeTab === "subjects"
                ? "My Subjects"
                : "Dashboard"}
            </h1>
          </div>

          <div className="header-user">
            <span>{user.name}</span>
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
            <section className="dashboard-welcome">
              <div>
                <span className="welcome-tag">
                  YOUR ACADEMIC JOURNEY
                </span>
                <h2>Welcome, {user.name}!</h2>
                <p>
                  Let's make every lecture count. Your progress starts here.
                </p>
              </div>
              <div className="welcome-symbol">✦</div>
            </section>

            <section className="dashboard-stats">
              <div className="dashboard-stat">
                <div className="stat-icon purple-bg">◉</div>
                <span>Overall Attendance</span>
                <strong>{percentage}%</strong>
                <small>Required: 75%</small>
              </div>

              <div className="dashboard-stat">
                <div className="stat-icon green-bg">✓</div>
                <span>Classes Attended</span>
                <strong>{totalAttended}</strong>
                <small>Out of {totalConducted} conducted</small>
              </div>

              <div className="dashboard-stat">
                <div className="stat-icon blue-bg">▤</div>
                <span>Total Subjects</span>
                <strong>{subjects.length}</strong>
                <small>Added this semester</small>
              </div>

              <div className="dashboard-stat">
                <div className="stat-icon orange-bg">◷</div>
                <span>Lectures Remaining</span>
                <strong>{remainingLectures}</strong>
                <small>Semester capacity</small>
              </div>
            </section>
          </>
        )}

        {activeTab !== "history" && (
          <>
            <section className="subjects-heading">
              <div>
                <h2>My Subjects</h2>
                <p>
                  Manage your subjects and monitor attendance.
                </p>
              </div>

              <div className="subject-actions">
                <button
                  className="record-attendance-button"
                  onClick={() => setShowRecord(true)}
                  disabled={subjects.length === 0}
                >
                  + Record Attendance
                </button>

                <button
                  className="add-subject-button"
                  onClick={() => setShowAdd(true)}
                >
                  + Add Subject
                </button>
              </div>
            </section>

            <div className="allocation-summary">
              <span>
                Total allocated: <strong>{totalAllotted}/60</strong>
              </span>
              <span>
                Unallocated: <strong>{unallocatedLectures}</strong>
              </span>
            </div>

            {subjects.length === 0 ? (
              <section className="empty-subjects">
                <div className="empty-icon">
                  <div className="empty-icon-inner">▤</div>
                  <span>+</span>
                </div>

                <h3>No subjects added yet</h3>
                <p>
                  Start by adding your semester subjects to track attendance,
                  view progress, and receive recommendations.
                </p>

                <button
                  className="add-subject-button"
                  onClick={() => setShowAdd(true)}
                >
                  + Add Your First Subject
                </button>
              </section>
            ) : (
              <section className="subject-list">
                {subjects.map((subject) => {
  const recommendation = getAttendanceRecommendation(subject);

  const subjectPercentage = recommendation.percentage;
  const isSafe = subjectPercentage >= 75;

                  return (
                    <article
                      className="subject-card"
                      key={subject.id}
                    >
                      <div className="subject-card-top">
                        <div className="subject-symbol">
                          {subject.name.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="subject-lecture-count">
                          {subject.conducted}/{subject.allotted} lectures
                        </span>
                      </div>

                      <h3>{subject.name}</h3>

                      <div className="subject-percentage">
                        <strong>{subjectPercentage}%</strong>
                        <span>Attendance</span>
                      </div>

                      <div className="subject-progress">
                        <div
                          style={{
                            width: `${subjectPercentage}%`,
                            background: isSafe ? "#35b779" : "#e36b6b",
                          }}
                        />
                      </div>

                      <p className="subject-empty-note">
                        {subject.conducted === 0
                          ? "No attendance records yet. Start recording your lectures."
                          : `${subject.attended} attended · ${
                              subject.conducted - subject.attended
                            } absent · ${
                              subject.allotted - subject.conducted
                            } remaining`}
                      </p>

                      <span
  className={`attendance-status ${
    isSafe ? "status-safe" : "status-low"
  }`}
>
  {subject.conducted === 0
    ? "No records"
    : isSafe
    ? "On track"
    : "Below 75%"}
</span>

{/* Attendance Recommendations */}
<div className="recommendation-box">
  <h4>Attendance Recommendations</h4>

  {subject.conducted === 0 ? (
    <p>
      Start recording attendance to receive personalized
      recommendations.
    </p>
  ) : isSafe ? (
    <>
      <p className="recommendation-success">
        ✓ Your attendance is above the required 75%.
      </p>

      <p>
        You can miss up to{" "}
        <strong>{recommendation.safeAbsences}</strong>{" "}
        more lectures while maintaining 75% attendance.
      </p>
    </>
  ) : recommendation.canRecover ? (
    <>
      <p className="recommendation-warning">
        ⚠ Your attendance is below 75%.
      </p>

      <p>
        Attend the next{" "}
        <strong>{recommendation.classesNeeded}</strong>{" "}
        consecutive classes to reach 75%.
      </p>

      <p className="recommendation-success">
        ✓ Recovery is possible within your remaining allotted lectures.
      </p>
    </>
  ) : (
    <>
      <p className="recommendation-danger">
        Your attendance is below 75%, and recovery is not
        possible within the remaining allotted lectures.
      </p>

      <p>
        You would need to attend{" "}
        <strong>{recommendation.classesNeeded}</strong>{" "}
        consecutive classes, but only{" "}
        <strong>{recommendation.remaining}</strong>{" "}
        allotted lectures remain.
      </p>
    </>
  )}
</div>
                    </article>
                  );
                })}
              </section>
            )}
          </>
        )}

        {activeTab === "history" && (
          <section className="history-section">
            <div className="subjects-heading">
              <div>
                <h2>Attendance Records</h2>
                <p>Review and manage your recorded lectures.</p>
              </div>

              <button
                className="record-attendance-button"
                onClick={() => setShowRecord(true)}
                disabled={subjects.length === 0}
              >
                + Record Attendance
              </button>
            </div>

            {attendanceRecords.length === 0 ? (
              <section className="empty-subjects">
                <div className="empty-icon">
                  <div className="empty-icon-inner">◷</div>
                </div>

                <h3>No attendance records yet</h3>
                <p>
                  Your attendance history will appear here after you
                  record your first lecture.
                </p>
              </section>
            ) : (
              <div className="history-table-wrap">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...attendanceRecords]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((record) => (
                        <tr key={record.id}>
                          <td>{record.subjectName}</td>

                          <td>
                            {new Date(
                              `${record.date}T00:00:00`
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td>
                            <span
                              className={`record-status ${
                                record.status === "Present"
                                  ? "record-present"
                                  : "record-absent"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td>
                            <div className="history-actions">
                              <button
                                className="edit-record-button"
                                onClick={() =>
                                  setEditingRecord({ ...record })
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="delete-record-button"
                                onClick={() =>
                                  handleDeleteAttendance(record.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        <footer className="dashboard-footer">
          AttendEase · Your attendance, simplified.
        </footer>
      </main>

      {/* Add Subject Modal */}
      {showAdd && (
        <div
          className="modal-overlay"
          onClick={() => setShowAdd(false)}
        >
          <form
            className="add-subject-modal"
            onSubmit={handleAddSubject}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-x"
              onClick={() => setShowAdd(false)}
            >
              ×
            </button>

            <div className="modal-icon">＋</div>
            <h2>Add a Subject</h2>
            <p>
              Enter the details of a subject for this semester.
            </p>

            <label htmlFor="subject-name">Subject Name</label>
            <input
              id="subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Data Structures"
              required
            />

            <label htmlFor="subject-allotted">
              Allotted Lectures
            </label>
            <input
              id="subject-allotted"
              type="number"
              min="1"
              max={unallocatedLectures}
              value={allotted}
              onChange={(e) => setAllotted(e.target.value)}
              placeholder="Enter lecture count"
              required
            />

            <div className="allocation-info">
              <span>Allocated: {totalAllotted}/60</span>
              <span>Available: {unallocatedLectures}</span>
            </div>

            <button
              className="auth-submit"
              type="submit"
              disabled={unallocatedLectures <= 0}
            >
              Save Subject <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* Record Attendance Modal */}
      {showRecord && (
        <div
          className="modal-overlay"
          onClick={() => setShowRecord(false)}
        >
          <form
            className="add-subject-modal"
            onSubmit={handleRecordAttendance}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-x"
              onClick={() => setShowRecord(false)}
            >
              ×
            </button>

            <div className="modal-icon">✓</div>
            <h2>Record Attendance</h2>
            <p>Enter the details of your lecture.</p>

            <label htmlFor="record-subject">
              Select Subject
            </label>
            <select
              id="record-subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">Choose a subject</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <label htmlFor="attendance-date">
              Lecture Date
            </label>
            <input
              id="attendance-date"
              type="date"
              value={attendanceDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />

            <label>Attendance Status</label>

            <div className="attendance-options">
              <button
                type="button"
                className={
                  attendanceStatus === "Present"
                    ? "attendance-option selected-present"
                    : "attendance-option"
                }
                onClick={() => setAttendanceStatus("Present")}
              >
                ✓ Present
              </button>

              <button
                type="button"
                className={
                  attendanceStatus === "Absent"
                    ? "attendance-option selected-absent"
                    : "attendance-option"
                }
                onClick={() => setAttendanceStatus("Absent")}
              >
                ✕ Absent
              </button>
            </div>

            <button className="auth-submit" type="submit">
              Save Attendance <span>→</span>
            </button>
          </form>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {editingRecord && (
        <div
          className="modal-overlay"
          onClick={() => setEditingRecord(null)}
        >
          <form
            className="add-subject-modal"
            onSubmit={handleEditAttendance}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-x"
              onClick={() => setEditingRecord(null)}
            >
              ×
            </button>

            <div className="modal-icon">✎</div>
            <h2>Edit Attendance</h2>
            <p>Update your attendance record.</p>

            <label htmlFor="edit-subject">Subject</label>
            <input
              id="edit-subject"
              value={editingRecord.subjectName}
              disabled
            />

            <label htmlFor="edit-date">Lecture Date</label>
            <input
              id="edit-date"
              type="date"
              value={editingRecord.date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  date: e.target.value,
                })
              }
              required
            />

            <label>Attendance Status</label>

            <div className="attendance-options">
              <button
                type="button"
                className={
                  editingRecord.status === "Present"
                    ? "attendance-option selected-present"
                    : "attendance-option"
                }
                onClick={() =>
                  setEditingRecord({
                    ...editingRecord,
                    status: "Present",
                  })
                }
              >
                ✓ Present
              </button>

              <button
                type="button"
                className={
                  editingRecord.status === "Absent"
                    ? "attendance-option selected-absent"
                    : "attendance-option"
                }
                onClick={() =>
                  setEditingRecord({
                    ...editingRecord,
                    status: "Absent",
                  })
                }
              >
                ✕ Absent
              </button>
            </div>

            <button className="auth-submit" type="submit">
              Update Attendance <span>→</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;