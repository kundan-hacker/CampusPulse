/**
 * CampusPulse: The Student Survival OS
 * Clean, intuitive architecture with multi-theme customizer (Day/Night modes),
 * self-registration student database, bunk forecaster, and CGPA calculator.
 */

// ==========================================================================
// 1. DATABASE & PERSISTENCE (Clean Slate - No Demo Personas)
// ==========================================================================

const DB_STORAGE_KEY = 'CAMPUS_PULSE_USER_DB_V3';
const SESSION_KEY = 'CAMPUS_PULSE_SESSION_V3';
const THEME_KEY = 'CAMPUS_PULSE_THEME_CHOICE';

// Clean Initial State
const INITIAL_DATABASE = {
  users: [],
  subjects: [],
  deadlines: [],
  exams: [],
  sessions: [],
  timetable: {
    Monday: [
      { start: '09:00 AM', end: '10:00 AM', subject: 'Core Course Lecture 1', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '10:00 AM', end: '11:00 AM', subject: 'Core Course Lecture 2', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '11:15 AM', end: '01:15 PM', subject: 'Hands-on Practical Lab', room: 'Lab 2', type: 'Practical Lab', faculty: 'Lab Incharge' },
      { start: '02:00 PM', end: '03:00 PM', subject: 'Elective Subject', room: 'Room 304', type: 'Lecture', faculty: 'Elective Faculty' }
    ],
    Tuesday: [
      { start: '09:00 AM', end: '10:00 AM', subject: 'Core Course Lecture 2', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '10:00 AM', end: '11:00 AM', subject: 'Elective Subject', room: 'Room 304', type: 'Lecture', faculty: 'Elective Faculty' },
      { start: '11:15 AM', end: '01:15 PM', subject: 'Software & Coding Lab', room: 'Lab 3', type: 'Practical Lab', faculty: 'Lab Incharge' }
    ],
    Wednesday: [
      { start: '09:00 AM', end: '10:00 AM', subject: 'Core Course Lecture 1', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '10:00 AM', end: '11:00 AM', subject: 'Engineering Maths / Analytics', room: 'Room 302', type: 'Lecture', faculty: 'Dr. Faculty' },
      { start: '01:30 PM', end: '03:30 PM', subject: 'Department Lab Practical', room: 'Lab 1', type: 'Practical Lab', faculty: 'Lab Incharge' }
    ],
    Thursday: [
      { start: '09:00 AM', end: '10:00 AM', subject: 'Core Course Lecture 1', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '10:00 AM', end: '11:00 AM', subject: 'Core Course Lecture 2', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '11:15 AM', end: '01:15 PM', subject: 'Hands-on Practical Lab', room: 'Lab 3', type: 'Practical Lab', faculty: 'Lab Incharge' },
      { start: '02:00 PM', end: '03:00 PM', subject: 'Training & Skill Development', room: 'Auditorium', type: 'Session', faculty: 'T&P Team' }
    ],
    Friday: [
      { start: '09:00 AM', end: '10:00 AM', subject: 'Elective Subject', room: 'Room 304', type: 'Lecture', faculty: 'Elective Faculty' },
      { start: '10:00 AM', end: '11:00 AM', subject: 'Core Course Lecture 2', room: 'Room 302', type: 'Lecture', faculty: 'Dept. Faculty' },
      { start: '11:15 AM', end: '01:15 PM', subject: 'Project Work / Mentorship', room: 'Seminar Hall', type: 'Mentorship', faculty: 'Project Guide' }
    ],
    Saturday: [
      { start: '09:30 AM', end: '11:30 AM', subject: 'Guest Lecture / Workshop', room: 'AV Hall', type: 'Guest Session', faculty: 'Industry Expert' },
      { start: '12:00 PM', end: '02:00 PM', subject: 'Hackathons & Technical Club Activity', room: 'CCC Lab', type: 'Club', faculty: 'Student Chapter' }
    ]
  },
  notices: [
    {
      id: 'not-1',
      badge: 'Hackathon Alert',
      date: 'Today',
      title: 'PromptRush 2026 AI Coding Sprint',
      body: '2-hour AI-powered building challenge. Create functional modern web solutions and present live to judges.',
      tag: '#PromptRush #COMSA #LiveContest'
    },
    {
      id: 'not-2',
      badge: 'Academic Notice',
      date: 'Yesterday',
      title: 'Mandatory 75% Attendance Requirement for Semester Exams',
      body: 'Students with aggregate attendance below 75% will need prior approval from Head of Department for exam hall tickets.',
      tag: '#UniversityRule #AttendanceCriteria'
    },
    {
      id: 'not-3',
      badge: 'Department Circular',
      date: 'This Week',
      title: 'Submission of Certified Practical Journals',
      body: 'All practical write-ups must be checked and signed by respective subject teachers before term-end submission dates.',
      tag: '#LabPracticals #JournalSubmission'
    }
  ]
};

// Database Engine
class LocalDbEngine {
  constructor() {
    this.data = this.read();
  }

  read() {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('DB load error', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  save() {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('DB save error', e);
    }
  }

  query(table, filterFn = null) {
    if (!this.data[table]) return [];
    if (!filterFn) return [...this.data[table]];
    return this.data[table].filter(filterFn);
  }

  insert(table, doc) {
    if (!this.data[table]) this.data[table] = [];
    this.data[table].push(doc);
    this.save();
    return doc;
  }

  update(table, id, changes) {
    if (!this.data[table]) return null;
    const idx = this.data[table].findIndex(item => item.id === id);
    if (idx !== -1) {
      this.data[table][idx] = { ...this.data[table][idx], ...changes };
      this.save();
      return this.data[table][idx];
    }
    return null;
  }

  delete(table, id) {
    if (!this.data[table]) return false;
    this.data[table] = this.data[table].filter(item => item.id !== id);
    this.save();
    return true;
  }
}

const db = new LocalDbEngine();

// ==========================================================================
// 2. AUTHENTICATION & SESSION MANAGEMENT
// ==========================================================================

class StudentAuth {
  constructor() {
    this.currentUserId = this.loadSession();
  }

  loadSession() {
    try {
      return localStorage.getItem(SESSION_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  saveSession(userId) {
    this.currentUserId = userId;
    if (userId) {
      localStorage.setItem(SESSION_KEY, userId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  getCurrentUser() {
    if (!this.currentUserId) return null;
    return db.query('users', u => u.id === this.currentUserId)[0] || null;
  }

  register(userData) {
    // Check if email or roll already exists
    const exists = db.query('users', u => 
      u.email.toLowerCase() === userData.email.toLowerCase() || 
      u.rollNo.toLowerCase() === userData.rollNo.toLowerCase()
    )[0];

    if (exists) {
      return { success: false, message: 'A student with this Email or Roll Number is already registered.' };
    }

    const userId = `usr_${Date.now()}`;
    const newUser = {
      id: userId,
      name: userData.name,
      rollNo: userData.rollNo,
      email: userData.email,
      password: userData.password,
      branch: userData.branch,
      semester: userData.semester,
      createdAt: new Date().toISOString()
    };

    db.insert('users', newUser);
    this.saveSession(userId);
    return { success: true, user: newUser };
  }

  login(emailOrRoll, password) {
    const user = db.query('users', u => 
      (u.email.toLowerCase() === emailOrRoll.toLowerCase() || u.rollNo.toLowerCase() === emailOrRoll.toLowerCase()) &&
      u.password === password
    )[0];

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please verify your Email/Roll No and password.' };
    }

    this.saveSession(user.id);
    return { success: true, user };
  }

  logout() {
    this.saveSession(null);
  }
}

const auth = new StudentAuth();

// ==========================================================================
// 3. THEME SYSTEM & DAY/NIGHT SWITCHER
// ==========================================================================

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'cyber-dark';
  applyTheme(saved);
}

function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem(THEME_KEY, themeName);

  // Update Day/Night toggle button text & icon
  const toggleBtnText = document.getElementById('theme-toggle-text');
  const toggleBtnIcon = document.getElementById('theme-toggle-icon');

  if (themeName === 'day-light') {
    if (toggleBtnText) toggleBtnText.innerText = 'Night Mode';
    if (toggleBtnIcon) toggleBtnIcon.setAttribute('data-lucide', 'moon');
  } else {
    if (toggleBtnText) toggleBtnText.innerText = 'Day Mode';
    if (toggleBtnIcon) toggleBtnIcon.setAttribute('data-lucide', 'sun');
  }

  // Update active mark in theme menu
  document.querySelectorAll('.theme-opt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
  });

  if (window.lucide) lucide.createIcons();
}

function toggleDayNight() {
  const current = document.documentElement.getAttribute('data-theme') || 'cyber-dark';
  if (current === 'day-light') {
    applyTheme('cyber-dark');
    showToast('Switched to Cyber Dark mode 🌙', 'info');
  } else {
    applyTheme('day-light');
    showToast('Switched to Day / Clean Light mode ☀️', 'info');
  }
}

function selectTheme(themeName) {
  applyTheme(themeName);
  toggleThemeMenu(false);
  showToast(`Theme changed to ${themeName}!`, 'success');
}

function toggleThemeMenu(forceState) {
  const menu = document.getElementById('theme-dropdown-menu');
  if (!menu) return;
  if (typeof forceState === 'boolean') {
    menu.classList.toggle('open', forceState);
  } else {
    menu.classList.toggle('open');
  }
}

// Close theme dropdown on outside click
window.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-dropdown-wrapper')) {
    toggleThemeMenu(false);
  }
});

// ==========================================================================
// 4. ATTENDANCE ELIGIBILITY FORECASTER ALGORITHM (Academic Mathematical Safety Margin)
// ==========================================================================

function calculateBunkQuota(attended, total, target = 75) {
  if (total <= 0) {
    return { percentage: 100, status: 'safe', bunkQuota: 0, attendNeeded: 0, message: 'No lectures conducted yet.' };
  }

  const pct = (attended / total) * 100;
  const roundedPct = Math.round(pct * 10) / 10;

  if (pct >= target) {
    // Formula for safe allowable contingency absence margin
    const margin = Math.floor((100 * attended - target * total) / target);
    let status = 'safe';
    let message = '';

    if (margin > 0) {
      message = `✅ Safe Margin: You have a buffer of <strong>${margin}</strong> allowable absence(s) while maintaining the mandatory ${target}% eligibility.`;
    } else {
      status = 'warning';
      message = `⚠️ On the 75% boundary (${roundedPct}%)! Every upcoming lecture is critical to prevent attendance shortage.`;
    }

    return { percentage: roundedPct, status, bunkQuota: margin, attendNeeded: 0, message };
  } else {
    // Formula for consecutive lectures to attend to clear shortage
    const attendNeeded = Math.ceil((target * total - 100 * attended) / (100 - target));
    const status = 'danger';
    const message = `🚨 Shortage Alert: You must attend the next <strong>${attendNeeded}</strong> consecutive lecture(s) to restore your ${target}% exam eligibility.`;

    return { percentage: roundedPct, status, bunkQuota: 0, attendNeeded, message };
  }
}

// ==========================================================================
// 5. APPLICATION VIEWS (Scoped strictly to Current Student)
// ==========================================================================

let activeTab = 'dashboard';
let activeTimetableDay = 'Thursday';
let currentDeadlineFilter = 'all';

function getCurrentStudentSubjects() {
  const user = auth.getCurrentUser();
  if (!user) return [];
  return db.query('subjects', s => s.userId === user.id);
}

function getCurrentStudentDeadlines() {
  const user = auth.getCurrentUser();
  if (!user) return [];
  return db.query('deadlines', d => d.userId === user.id);
}

function getCurrentStudentExams() {
  const user = auth.getCurrentUser();
  if (!user) return [];
  return db.query('exams', e => e.userId === user.id);
}

function renderAll() {
  const user = auth.getCurrentUser();

  // Render Header Profile / Sign In Box
  const chipContainer = document.getElementById('user-chip-box');
  const studentTag = document.getElementById('header-student-tag');

  if (user) {
    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (chipContainer) {
      chipContainer.innerHTML = `
        <div class="user-chip" title="Click to Sign Out" onclick="handleLogout()">
          <div class="user-avatar">${initials}</div>
          <div class="user-meta">
            <span class="user-meta-name">${user.name}</span>
            <span class="user-meta-roll">${user.rollNo} • Sign Out</span>
          </div>
        </div>
      `;
    }
    if (studentTag) studentTag.innerText = `${user.branch} • ${user.semester}`;
  } else {
    if (chipContainer) {
      chipContainer.innerHTML = `
        <button class="btn-primary btn-xs" onclick="openAuthModal('required')">
          <i data-lucide="log-in"></i> Sign In / Register
        </button>
      `;
    }
    if (studentTag) studentTag.innerText = 'Guest Student • Register to save data';
    openAuthModal('required');
    return;
  }

  // Render all active sections
  renderDashboard();
  renderAttendanceTab();
  renderDeadlinesTab();
  renderTimetableTab();
  renderExamsTab();
  renderNoticesTab();

  if (window.lucide) lucide.createIcons();
}

// --------------------------------------------------------------------------
// TAB 1: DASHBOARD
// --------------------------------------------------------------------------
function renderDashboard() {
  const user = auth.getCurrentUser();
  const subjects = getCurrentStudentSubjects();
  const deadlines = getCurrentStudentDeadlines();
  const exams = getCurrentStudentExams();

  // Greeting
  const greetingEl = document.getElementById('dash-greeting-text');
  const greetingSub = document.getElementById('dash-greeting-sub');
  if (greetingEl && user) greetingEl.innerText = `Welcome back, ${user.name}!`;
  if (greetingSub && user) greetingSub.innerText = `${user.branch} (${user.semester}) • Student Academic Hub`;

  // 1. Attendance Average Stat
  let totalAttended = 0;
  let totalHeld = 0;
  let dangerCount = 0;

  subjects.forEach(s => {
    totalAttended += s.attended;
    totalHeld += s.total;
    const p = s.total > 0 ? (s.attended / s.total) * 100 : 100;
    if (p < (s.targetCutoff || 75)) dangerCount++;
  });

  const avgPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;
  const statAtt = document.getElementById('dash-stat-attendance');
  const statAttDesc = document.getElementById('dash-stat-attendance-desc');
  const warningBadge = document.getElementById('attendance-warning-badge');

  if (statAtt) statAtt.innerText = totalHeld > 0 ? `${avgPct}%` : '--%';
  if (statAttDesc) {
    if (subjects.length === 0) {
      statAttDesc.innerText = 'No subjects registered yet';
    } else if (dangerCount > 0) {
      statAttDesc.innerHTML = `<span class="text-rose font-bold">${dangerCount} subject(s) below 75%!</span>`;
    } else {
      statAttDesc.innerText = `All ${subjects.length} subjects safe (≥75%)`;
    }
  }
  if (warningBadge) {
    warningBadge.style.display = dangerCount > 0 ? 'inline-block' : 'none';
  }

  // 2. Pending Deadlines Stat
  const pendingTasks = deadlines.filter(d => !d.completed);
  const urgentTasks = pendingTasks.filter(d => {
    const hours = (new Date(d.dueDateTime) - new Date()) / (1000 * 60 * 60);
    return hours <= 48;
  });

  const statTasks = document.getElementById('dash-stat-tasks');
  const statTasksDesc = document.getElementById('dash-stat-tasks-desc');
  const navBadge = document.getElementById('pending-count-badge');

  if (statTasks) statTasks.innerText = pendingTasks.length;
  if (navBadge) navBadge.innerText = pendingTasks.length;
  if (statTasksDesc) {
    if (urgentTasks.length > 0) {
      statTasksDesc.innerHTML = `<span class="text-rose font-bold">${urgentTasks.length} task(s) due within 48h!</span>`;
    } else {
      statTasksDesc.innerText = `${pendingTasks.length} total pending in queue`;
    }
  }

  // 3. Upcoming Exam Stat
  const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextExam = sortedExams[0];
  const statExam = document.getElementById('dash-stat-exam');
  const statExamDesc = document.getElementById('dash-stat-exam-desc');

  if (nextExam) {
    const diffDays = Math.max(0, Math.ceil((new Date(nextExam.date) - new Date()) / (1000 * 60 * 60 * 24)));
    if (statExam) statExam.innerText = `${diffDays} Days`;
    if (statExamDesc) statExamDesc.innerText = `${nextExam.title}`;
  } else {
    if (statExam) statExam.innerText = '-- Days';
    if (statExamDesc) statExamDesc.innerText = 'No exams scheduled';
  }

  // 4. Quick Bunk Simulator Dropdown in Dash
  const bunkSelect = document.getElementById('dash-bunk-subject-select');
  if (bunkSelect) {
    if (subjects.length === 0) {
      bunkSelect.innerHTML = `<option value="">No subjects yet (Click + Add Subject)</option>`;
    } else {
      bunkSelect.innerHTML = subjects.map(s => `<option value="${s.id}">${s.name} (${s.code || 'COURSE'})</option>`).join('');
    }
  }
  updateDashboardBunkSimulation();

  // 5. Urgent Tasks in Dash
  const urgentContainer = document.getElementById('dash-urgent-deadlines-container');
  if (urgentContainer) {
    if (pendingTasks.length === 0) {
      urgentContainer.innerHTML = `
        <div class="text-center py-6 text-muted">
          <i data-lucide="check-circle-2" style="width: 32px; height: 32px; color: var(--accent-emerald); margin-bottom: 0.4rem;"></i>
          <p>No pending deadlines! Click "+ Add" to create a task.</p>
        </div>
      `;
    } else {
      urgentContainer.innerHTML = pendingTasks.slice(0, 3).map(task => {
        const diffHours = Math.round((new Date(task.dueDateTime) - new Date()) / (1000 * 60 * 60));
        const dueText = diffHours <= 0 ? 'Overdue' : diffHours < 24 ? `${diffHours}h left` : `${Math.round(diffHours / 24)}d left`;
        const isUrgent = diffHours < 48;

        return `
          <div class="urgent-row-item ${isUrgent ? 'priority-high' : ''}">
            <div class="urgent-item-info">
              <h4>${task.title}</h4>
              <span>${task.subjectName || 'General'} • ${task.type}</span>
            </div>
            <span class="due-tag">${dueText}</span>
          </div>
        `;
      }).join('');
    }
  }
}

function updateDashboardBunkSimulation() {
  const select = document.getElementById('dash-bunk-subject-select');
  const resultBox = document.getElementById('dash-bunk-result-box');
  if (!select || !resultBox) return;

  const subjects = getCurrentStudentSubjects();
  if (subjects.length === 0) {
    resultBox.innerHTML = `Add your courses to evaluate your attendance eligibility and contingency margins.`;
    return;
  }

  const subject = subjects.find(s => s.id === select.value) || subjects[0];
  if (!subject) return;

  const forecast = calculateBunkQuota(subject.attended, subject.total, subject.targetCutoff);
  const nextTotal = subject.total + 1;
  const nextAttended = subject.attended;
  const nextPct = Math.round((nextAttended / nextTotal) * 1000) / 10;
  const willBeSafe = nextPct >= (subject.targetCutoff || 75);

  resultBox.innerHTML = `
    <div style="line-height: 1.45;">
      <strong>Current Attendance:</strong> ${forecast.percentage}% (${subject.attended} of ${subject.total} attended).<br>
      If absent next lecture, attendance becomes <strong>${nextPct}%</strong> (${nextAttended}/${nextTotal}).<br>
      <div class="mt-2 ${willBeSafe ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
        ${willBeSafe ? '✓ Safe: Remains within the university 75% eligibility criteria.' : '⚠ Warning: Drops below the 75% mandatory threshold!'}
      </div>
      <div class="mt-2 text-secondary">${forecast.message}</div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// TAB 2: ATTENDANCE TRACKER
// --------------------------------------------------------------------------
function renderAttendanceTab() {
  const container = document.getElementById('subjects-container');
  if (!container) return;

  const subjects = getCurrentStudentSubjects();

  // Update summary strip
  let totalAtt = 0;
  let totalHeld = 0;
  subjects.forEach(s => {
    totalAtt += s.attended;
    totalHeld += s.total;
  });

  const avgPct = totalHeld > 0 ? Math.round((totalAtt / totalHeld) * 1000) / 10 : 0;
  const globalPctEl = document.getElementById('global-att-percent');
  const globalCountsEl = document.getElementById('global-att-counts');
  const globalHintEl = document.getElementById('global-att-hint');
  const globalStatusEl = document.getElementById('global-att-status');

  if (globalPctEl) globalPctEl.innerText = totalHeld > 0 ? `${avgPct}%` : '--%';
  if (globalCountsEl) globalCountsEl.innerText = `${totalAtt} / ${totalHeld}`;
  if (globalHintEl) globalHintEl.innerText = `Across ${subjects.length} Subjects`;
  if (globalStatusEl) {
    if (totalHeld === 0 || avgPct >= 75) {
      globalStatusEl.className = 'pill-badge pill-safe';
      globalStatusEl.innerText = 'Eligible for Exams';
    } else {
      globalStatusEl.className = 'pill-badge pill-danger';
      globalStatusEl.innerText = 'Debarred Risk (<75%)';
    }
  }

  // Render subject cards or friendly empty state
  if (subjects.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <i data-lucide="book-open"></i>
        <h3>No Subjects Added Yet</h3>
        <p>Start tracking your attendance and calculate your safe contingency leave margin. Click below to add your first course!</p>
        <button class="btn-primary" onclick="openAddSubjectModal()">
          <i data-lucide="plus-circle"></i> Add Your First Subject
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = subjects.map(s => {
    const forecast = calculateBunkQuota(s.attended, s.total, s.targetCutoff);
    const isDanger = forecast.status === 'danger';

    // 72px ring -> r=34, circumference = 2 * PI * 34 ≈ 213.6
    const circumference = 213.6;
    const offset = circumference - (forecast.percentage / 100) * circumference;

    return `
      <div class="card subject-item-card ${isDanger ? 'is-danger' : ''}">
        <div>
          <div class="sub-card-top">
            <div>
              <span class="sub-code-pill">${s.code || 'COURSE'}</span>
              <h3 class="sub-title">${s.name}</h3>
              <div class="sub-prof">${s.faculty || 'Department Faculty'}</div>
            </div>
            <div class="sub-gauge-box">
              <svg class="ring-svg" width="72" height="72">
                <circle class="ring-bg" stroke-width="6" fill="transparent" r="34" cx="36" cy="36"/>
                <circle class="ring-fill ${forecast.status}" stroke-width="6" fill="transparent" r="34" cx="36" cy="36"
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${Math.max(0, offset)};" />
              </svg>
              <div class="ring-text">${forecast.percentage}%</div>
            </div>
          </div>

          <div class="bunk-box ${forecast.status}">
            ${forecast.message}
          </div>
        </div>

        <div class="sub-card-footer">
          <span class="sub-count-txt">Attended: <strong>${s.attended}</strong> / ${s.total}</span>
          <div class="btn-mark-group">
            <button class="btn-mark present" onclick="handleMarkAttendance('${s.id}', true)">
              + Present
            </button>
            <button class="btn-mark absent" onclick="handleMarkAttendance('${s.id}', false)">
              - Absent
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function handleMarkAttendance(subjectId, isPresent) {
  const subject = db.query('subjects', s => s.id === subjectId)[0];
  if (!subject) return;

  if (isPresent) {
    db.update('subjects', subjectId, {
      attended: subject.attended + 1,
      total: subject.total + 1
    });
    showToast(`Marked Present in ${subject.name}! (${subject.attended + 1}/${subject.total + 1})`, 'success');
  } else {
    db.update('subjects', subjectId, {
      total: subject.total + 1
    });
    showToast(`Marked Absent in ${subject.name}. Attendance updated.`, 'error');
  }

  renderAttendanceTab();
  renderDashboard();
}

// --------------------------------------------------------------------------
// TAB 3: ASSIGNMENTS & DEADLINES
// --------------------------------------------------------------------------
function renderDeadlinesTab() {
  const container = document.getElementById('deadlines-list-container');
  if (!container) return;

  const searchVal = (document.getElementById('deadline-search')?.value || '').toLowerCase().trim();
  const deadlines = getCurrentStudentDeadlines();

  const filtered = deadlines.filter(task => {
    if (currentDeadlineFilter === 'pending' && task.completed) return false;
    if (currentDeadlineFilter === 'completed' && !task.completed) return false;
    if (currentDeadlineFilter === 'practical' && task.type !== 'practical') return false;
    if (currentDeadlineFilter === 'assignment' && task.type !== 'assignment') return false;
    if (currentDeadlineFilter === 'urgent') {
      const hours = (new Date(task.dueDateTime) - new Date()) / (1000 * 60 * 60);
      if (task.completed || hours <= 0 || hours > 48) return false;
    }

    if (searchVal) {
      const matchTitle = task.title.toLowerCase().includes(searchVal);
      const matchNotes = (task.notes || '').toLowerCase().includes(searchVal);
      return matchTitle || matchNotes;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <i data-lucide="check-square"></i>
        <h3>No Tasks Found</h3>
        <p>Add assignments, lab practical write-ups, or project deadlines to stay organized.</p>
        <button class="btn-primary" onclick="openAddDeadlineModal()">
          <i data-lucide="plus-circle"></i> Add Deadline
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(task => {
    const diffHours = Math.round((new Date(task.dueDateTime) - new Date()) / (1000 * 60 * 60));
    const timeText = task.completed ? 'Completed' : diffHours <= 0 ? 'Overdue!' : diffHours < 24 ? `${diffHours}h left` : `${Math.round(diffHours / 24)}d left`;

    return `
      <div class="deadline-row-card ${task.completed ? 'is-done' : ''}">
        <div class="dl-main-left">
          <div class="dl-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskCompletion('${task.id}')">
            ${task.completed ? '✓' : ''}
          </div>
          <div>
            <div class="dl-title-txt ${task.completed ? 'completed' : ''}">${task.title}</div>
            <div class="dl-sub-txt">${task.subjectName || 'General'} • ${task.type} ${task.notes ? '• ' + task.notes : ''}</div>
          </div>
        </div>
        <div class="dl-right-meta">
          <span class="dl-time-due">${timeText}</span>
          <button class="btn-ghost btn-xs text-rose" onclick="deleteDeadlineTask('${task.id}')" title="Delete Task">✕</button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function setDeadlineFilter(filter, el) {
  currentDeadlineFilter = filter;
  document.querySelectorAll('.filter-pills .filter-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');
  renderDeadlinesTab();
}

function toggleTaskCompletion(id) {
  const task = db.query('deadlines', d => d.id === id)[0];
  if (!task) return;

  const updated = !task.completed;
  db.update('deadlines', id, { completed: updated });

  if (updated) {
    fireConfetti();
    showToast(`Great work! Finished: ${task.title} 🎉`, 'success');
  }

  renderDeadlinesTab();
  renderDashboard();
}

function deleteDeadlineTask(id) {
  if (confirm('Delete this deadline?')) {
    db.delete('deadlines', id);
    renderDeadlinesTab();
    renderDashboard();
    showToast('Task removed', 'info');
  }
}

// --------------------------------------------------------------------------
// TAB 4: TIMETABLE
// --------------------------------------------------------------------------
function renderTimetableTab() {
  const container = document.getElementById('timetable-slots-container');
  if (!container) return;

  const slots = db.data.timetable[activeTimetableDay] || [];

  if (slots.length === 0) {
    container.innerHTML = `<div class="empty-state-card"><p>No classes scheduled on ${activeTimetableDay}.</p></div>`;
    return;
  }

  container.innerHTML = slots.map(slot => {
    return `
      <div class="timetable-slot-card">
        <div class="slot-time-row">
          <span>${slot.start} – ${slot.end}</span>
          <span>${slot.type}</span>
        </div>
        <h4 class="slot-title">${slot.subject}</h4>
        <div class="slot-meta-row">${slot.room} • ${slot.faculty}</div>
      </div>
    `;
  }).join('');
}

function selectDay(day, el) {
  activeTimetableDay = day;
  document.querySelectorAll('#day-switch-container .day-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');
  renderTimetableTab();
}

// --------------------------------------------------------------------------
// TAB 5: EXAM COUNTDOWN
// --------------------------------------------------------------------------
function renderExamsTab() {
  const container = document.getElementById('exams-container');
  if (!container) return;

  const exams = getCurrentStudentExams();

  if (exams.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <i data-lucide="flame"></i>
        <h3>No Upcoming Exams Set</h3>
        <p>Add your mid-semester, viva, or end-semester exam dates to see a live ticking countdown timer.</p>
        <button class="btn-primary" onclick="openAddExamModal()">
          <i data-lucide="plus-circle"></i> Add Exam Date
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  container.innerHTML = exams.map(exam => {
    const diff = Math.max(0, new Date(exam.date) - new Date());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `
      <div class="card exam-item-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="sub-code-pill">${exam.type}</span>
            <h3 class="sub-title">${exam.title}</h3>
          </div>
          <button class="btn-ghost btn-xs text-rose" onclick="deleteExam('${exam.id}')">✕</button>
        </div>

        <div class="exam-clock-boxes">
          <div><div class="cd-val" id="ex-d-${exam.id}">${days}</div><div class="cd-lbl">Days</div></div>
          <div><div class="cd-val" id="ex-h-${exam.id}">${hours}</div><div class="cd-lbl">Hours</div></div>
          <div><div class="cd-val" id="ex-m-${exam.id}">${minutes}</div><div class="cd-lbl">Mins</div></div>
          <div><div class="cd-val" id="ex-s-${exam.id}">${seconds}</div><div class="cd-lbl">Secs</div></div>
        </div>

        <div style="font-size: 0.8rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
          <span>Syllabus Prepared:</span>
          <strong>${exam.readiness || 50}%</strong>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function deleteExam(id) {
  if (confirm('Delete this exam?')) {
    db.delete('exams', id);
    renderExamsTab();
    renderDashboard();
    showToast('Exam removed', 'info');
  }
}

// --------------------------------------------------------------------------
// TAB 6: NOTICES
// --------------------------------------------------------------------------
function renderNoticesTab() {
  const container = document.getElementById('notices-container');
  if (!container) return;

  container.innerHTML = db.data.notices.map(n => {
    return `
      <div class="card notice-item-card">
        <div>
          <div class="notice-meta">${n.badge} • ${n.date}</div>
          <h3 class="notice-title">${n.title}</h3>
          <p class="notice-text">${n.body}</p>
        </div>
        <div style="margin-top: 1rem; font-size: 0.75rem; color: var(--accent-indigo); font-weight: 600;">
          ${n.tag}
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// 6. STUDENT UTILITIES (CGPA Calculator & Print Report)
// ==========================================================================

const DEFAULT_CGPA_COURSES = [
  { name: 'Core Theory Course 1', credits: 4, gradePoint: 9 },
  { name: 'Core Theory Course 2', credits: 4, gradePoint: 8 },
  { name: 'Engineering Lab 1', credits: 2, gradePoint: 10 },
  { name: 'Elective Subject', credits: 3, gradePoint: 8 }
];

let cgpaCourses = [...DEFAULT_CGPA_COURSES];

function initCgpaCalculator() {
  renderCgpaRows();
}

function renderCgpaRows() {
  const container = document.getElementById('cgpa-rows-container');
  if (!container) return;

  container.innerHTML = cgpaCourses.map((c, i) => {
    return `
      <div class="cgpa-row">
        <input type="text" class="form-control" value="${c.name}" oninput="cgpaCourses[${i}].name = this.value">
        <input type="number" class="form-control" value="${c.credits}" min="1" max="10" oninput="cgpaCourses[${i}].credits = parseFloat(this.value) || 0; calculateCgpa();">
        <select class="form-control" onchange="cgpaCourses[${i}].gradePoint = parseFloat(this.value); calculateCgpa();">
          <option value="10" ${c.gradePoint === 10 ? 'selected' : ''}>O (10)</option>
          <option value="9" ${c.gradePoint === 9 ? 'selected' : ''}>A+ (9)</option>
          <option value="8" ${c.gradePoint === 8 ? 'selected' : ''}>A (8)</option>
          <option value="7" ${c.gradePoint === 7 ? 'selected' : ''}>B+ (7)</option>
          <option value="6" ${c.gradePoint === 6 ? 'selected' : ''}>B (6)</option>
          <option value="5" ${c.gradePoint === 5 ? 'selected' : ''}>C (5)</option>
          <option value="0" ${c.gradePoint === 0 ? 'selected' : ''}>F (0)</option>
        </select>
        <button class="btn-ghost btn-xs text-rose" onclick="removeCgpaRow(${i})">✕</button>
      </div>
    `;
  }).join('');

  calculateCgpa();
}

function addCgpaRow() {
  cgpaCourses.push({ name: `Course ${cgpaCourses.length + 1}`, credits: 3, gradePoint: 8 });
  renderCgpaRows();
}

function removeCgpaRow(index) {
  cgpaCourses.splice(index, 1);
  renderCgpaRows();
}

function calculateCgpa() {
  let totalCredits = 0;
  let weightedPoints = 0;

  cgpaCourses.forEach(c => {
    const cred = c.credits || 0;
    const gp = c.gradePoint || 0;
    totalCredits += cred;
    weightedPoints += cred * gp;
  });

  const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00';
  const valEl = document.getElementById('calculated-sgpa-val');
  if (valEl) valEl.innerText = sgpa;
}

function printAcademicReport() {
  const user = auth.getCurrentUser();
  if (!user) {
    showToast('Please register or sign in before generating report', 'error');
    return;
  }
  window.print();
}

// ==========================================================================
// 7. SELF-REGISTRATION & AUTH HANDLERS
// ==========================================================================

function openAuthModal(mode = 'register') {
  const cancelBtnBox = document.getElementById('auth-cancel-btn-box');
  if (cancelBtnBox) {
    cancelBtnBox.style.display = auth.getCurrentUser() ? 'block' : 'none';
  }
  switchAuthMode(mode === 'login' ? 'login' : 'register');
  openModal('modal-auth-gate');
}

function switchAuthMode(mode) {
  const regBtn = document.getElementById('tab-btn-register');
  const loginBtn = document.getElementById('tab-btn-login');
  const regView = document.getElementById('auth-view-register');
  const loginView = document.getElementById('auth-view-login');

  if (mode === 'register') {
    if (regBtn) regBtn.classList.add('active');
    if (loginBtn) loginBtn.classList.remove('active');
    if (regView) regView.style.display = 'block';
    if (loginView) loginView.style.display = 'none';
  } else {
    if (loginBtn) loginBtn.classList.add('active');
    if (regBtn) regBtn.classList.remove('active');
    if (loginView) loginView.style.display = 'block';
    if (regView) regView.style.display = 'none';
  }
  if (window.lucide) lucide.createIcons();
}

function handleUserRegistration(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const rollNo = document.getElementById('reg-roll').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const branch = document.getElementById('reg-branch').value.trim();
  const semester = document.getElementById('reg-sem').value;

  const res = auth.register({ name, rollNo, email, password, branch, semester });

  if (res.success) {
    closeModal('modal-auth-gate');
    renderAll();
    fireConfetti();
    showToast(`Welcome, ${res.user.name}! Your dashboard is ready 🎉`, 'success');
  } else {
    showToast(res.message, 'error');
  }
}

function handleUserLogin(e) {
  e.preventDefault();
  const emailOrRoll = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const res = auth.login(emailOrRoll, password);

  if (res.success) {
    closeModal('modal-auth-gate');
    renderAll();
    showToast(`Welcome back, ${res.user.name}!`, 'success');
  } else {
    showToast(res.message, 'error');
  }
}

function handleLogout() {
  if (confirm('Sign out of your student session?')) {
    auth.logout();
    showToast('Signed out.', 'info');
    renderAll();
  }
}

// ==========================================================================
// 8. ADD ITEM MODAL HANDLERS
// ==========================================================================

function openAddSubjectModal() {
  if (!auth.getCurrentUser()) {
    openAuthModal('required');
    return;
  }
  openModal('modal-add-subject');
}

function handleSaveSubject(e) {
  e.preventDefault();
  const user = auth.getCurrentUser();
  if (!user) return;

  const name = document.getElementById('sub-name-input').value.trim();
  const code = document.getElementById('sub-code-input').value.trim() || 'SUB';
  const faculty = document.getElementById('sub-faculty-input').value.trim() || 'Faculty Incharge';
  const attended = parseInt(document.getElementById('sub-attended-input').value) || 0;
  const total = parseInt(document.getElementById('sub-total-input').value) || 1;
  const targetCutoff = parseInt(document.getElementById('sub-cutoff-input').value) || 75;

  db.insert('subjects', {
    id: `sub_${Date.now()}`,
    userId: user.id,
    name,
    code,
    faculty,
    attended: Math.min(attended, total),
    total,
    targetCutoff
  });

  closeModal('modal-add-subject');
  renderAll();
  showToast(`Added ${name} to your subjects!`, 'success');
  e.target.reset();
}

function openAddDeadlineModal() {
  const user = auth.getCurrentUser();
  if (!user) {
    openAuthModal('required');
    return;
  }

  const select = document.getElementById('dl-subject-input');
  const subjects = getCurrentStudentSubjects();
  if (select) {
    if (subjects.length === 0) {
      select.innerHTML = `<option value="General">General / Other</option>`;
    } else {
      select.innerHTML = subjects.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
  }

  // Default to tomorrow 5 PM
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const dtInput = document.getElementById('dl-datetime-input');
  if (dtInput) dtInput.value = tomorrow;

  openModal('modal-add-deadline');
}

function handleSaveDeadline(e) {
  e.preventDefault();
  const user = auth.getCurrentUser();
  if (!user) return;

  const title = document.getElementById('dl-title-input').value.trim();
  const subjectName = document.getElementById('dl-subject-input').value;
  const type = document.getElementById('dl-type-input').value;
  const dueDateTime = document.getElementById('dl-datetime-input').value;
  const priority = document.getElementById('dl-priority-input').value;
  const notes = document.getElementById('dl-notes-input').value.trim();

  db.insert('deadlines', {
    id: `dl_${Date.now()}`,
    userId: user.id,
    title,
    subjectName,
    type,
    dueDateTime,
    priority,
    notes,
    completed: false
  });

  closeModal('modal-add-deadline');
  renderAll();
  showToast(`Deadline added for ${title}!`, 'success');
  e.target.reset();
}

function openAddExamModal() {
  if (!auth.getCurrentUser()) {
    openAuthModal('required');
    return;
  }
  const nextMonth = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const dtInput = document.getElementById('exam-date-input');
  if (dtInput) dtInput.value = nextMonth;
  openModal('modal-add-exam');
}

function handleSaveExam(e) {
  e.preventDefault();
  const user = auth.getCurrentUser();
  if (!user) return;

  const title = document.getElementById('exam-title-input').value.trim();
  const date = document.getElementById('exam-date-input').value;
  const type = document.getElementById('exam-type-input').value;
  const readiness = parseInt(document.getElementById('exam-readiness-input').value) || 50;

  db.insert('exams', {
    id: `ex_${Date.now()}`,
    userId: user.id,
    title,
    date,
    type,
    readiness
  });

  closeModal('modal-add-exam');
  renderAll();
  showToast(`Exam timer set for ${title}!`, 'success');
  e.target.reset();
}

// ==========================================================================
// 9. NAVIGATION & GENERAL MODAL CONTROLS
// ==========================================================================

function switchTab(tabId) {
  activeTab = tabId;

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  document.querySelectorAll('.tab-page').forEach(page => {
    page.classList.remove('active');
  });

  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');

  if (tabId === 'dashboard') renderDashboard();
  if (tabId === 'attendance') renderAttendanceTab();
  if (tabId === 'deadlines') renderDeadlinesTab();
  if (tabId === 'timetable') renderTimetableTab();
  if (tabId === 'exams') renderExamsTab();
  if (tabId === 'notices') renderNoticesTab();

  if (window.lucide) lucide.createIcons();
}

document.querySelectorAll('.nav-tab').forEach(b => {
  b.addEventListener('click', () => switchTab(b.getAttribute('data-tab')));
});

function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    if (e.target.id === 'modal-auth-gate' && !auth.getCurrentUser()) return;
    e.target.classList.remove('open');
  }
});

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Confetti System
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e'];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight * 0.4 + (Math.random() - 0.5) * 50,
      radius: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 1) * 6 - 3,
      gravity: 0.2,
      alpha: 1
    });
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= 0.015;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (alive) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

// Live Clock & Countdown Tick
function updateLiveClock() {
  const now = new Date();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
  const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const timeStr = now.toLocaleTimeString('en-GB');

  const clockEl = document.getElementById('live-digital-clock');
  const dayEl = document.getElementById('current-day-name');
  const dateEl = document.getElementById('current-date-str');

  if (clockEl) clockEl.innerText = timeStr;
  if (dayEl) dayEl.innerText = dayName;
  if (dateEl) dateEl.innerText = dateStr;

  // Tick exam countdown clocks
  const exams = getCurrentStudentExams();
  exams.forEach(exam => {
    const diff = Math.max(0, new Date(exam.date) - now);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById(`ex-d-${exam.id}`);
    const hEl = document.getElementById(`ex-h-${exam.id}`);
    const mEl = document.getElementById(`ex-m-${exam.id}`);
    const sEl = document.getElementById(`ex-s-${exam.id}`);

    if (dEl) dEl.innerText = d;
    if (hEl) hEl.innerText = h.toString().padStart(2, '0');
    if (mEl) mEl.innerText = m.toString().padStart(2, '0');
    if (sEl) sEl.innerText = s.toString().padStart(2, '0');
  });
}

// ==========================================================================
// 10. APP INITIALIZATION
// ==========================================================================

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCgpaCalculator();
  renderAll();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);
});
