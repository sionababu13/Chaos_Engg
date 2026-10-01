
import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [allotted, setAllotted] = useState("");

  const totalAllotted = subjects.reduce(
    (sum, subject) => sum + subject.allotted,
    0
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setUser({ name: email.split("@")[0], email });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    setUser({ name, email });
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setSubjects([]);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();

    const count = Number(allotted);

    if (!subjectName.trim() || count <= 0) return;

    if (totalAllotted + count > 60) {
      alert(`You can allocate only ${60 - totalAllotted} more lectures.`);
      return;
    }

    if (
      subjects.some(
        (subject) =>
          subject.name.toLowerCase() === subjectName.trim().toLowerCase()
      )
    ) {
      alert("This subject already exists.");
      return;
    }

    setSubjects([
      ...subjects,
      {
        id: Date.now(),
        name: subjectName.trim(),
        allotted: count,
        conducted: 0,
        attended: 0,
      },
    ]);

    setSubjectName("");
    setAllotted("");
    setShowAdd(false);
  };

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

            <h1>Stay on track.<br />Own your attendance.</h1>
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
                  <p>Enter your details to access your dashboard.</p>
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
                    <span className="forgot-text">Forgot password?</span>
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
                  <p>Join AttendEase and take control of your attendance.</p>
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

                  <label htmlFor="confirm-password">Confirm Password</label>
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

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-logo">A</div>
          <span>AttendEase</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <div className="sidebar-link active">▦ <span>Dashboard</span></div>
        <div className="sidebar-link">▤ <span>My Subjects</span></div>
        <div className="sidebar-link">◷ <span>Attendance History</span></div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <strong>{user.name}</strong>
            <small>Student Account</small>
          </div>
          <button className="logout-button" onClick={handleLogout} title="Logout">
            ↪
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-eyebrow">STUDENT PORTAL</p>
            <h1>Dashboard</h1>
          </div>
          <div className="header-user">
            <span>{user.name}</span>
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span className="welcome-tag">YOUR ACADEMIC JOURNEY</span>
            <h2>Welcome, {user.name}!</h2>
            <p>Let's make every lecture count. Your progress starts here.</p>
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
            <strong>{60 - totalConducted}</strong>
            <small>Semester capacity</small>
          </div>
        </section>

        <section className="subjects-heading">
          <div>
            <h2>My Subjects</h2>
            <p>Manage your subjects and monitor attendance.</p>
          </div>
          <button
            className="add-subject-button"
            onClick={() => setShowAdd(true)}
          >
            + Add Subject
          </button>
        </section>

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
              const subjectPercentage = subject.conducted
                ? Math.round((subject.attended / subject.conducted) * 100)
                : 0;

              return (
                <article className="subject-card" key={subject.id}>
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
                      style={{ width: `${subjectPercentage}%` }}
                    />
                  </div>
                  <p className="subject-empty-note">
                    No attendance records yet. Start recording your lectures.
                  </p>
                </article>
              );
            })}
          </section>
        )}

        <footer className="dashboard-footer">
          AttendEase · Your attendance, simplified.
        </footer>
      </main>

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
            <p>Enter the details of a subject for this semester.</p>

            <label htmlFor="subject-name">Subject Name</label>
            <input
              id="subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Data Structures"
              required
            />

            <label htmlFor="subject-allotted">Allotted Lectures</label>
            <input
              id="subject-allotted"
              type="number"
              min="1"
              max={60 - totalAllotted}
              value={allotted}
              onChange={(e) => setAllotted(e.target.value)}
              placeholder="Enter lecture count"
              required
            />

            <div className="allocation-info">
              <span>Allocated: {totalAllotted}/60</span>
              <span>Available: {60 - totalAllotted}</span>
            </div>

            <button className="auth-submit" type="submit">
              Save Subject <span>→</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;