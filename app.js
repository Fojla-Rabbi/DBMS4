
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginModal = document.getElementById('loginModal');
const dashboardView = document.getElementById('dashboardView');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  topBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
});

topBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

document.querySelectorAll('#mobileMenu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

function openLogin(tab = 'login') {
  loginModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  showAuthTab(tab);
}

function closeLogin() {
  loginModal.classList.add('hidden');
  document.body.style.overflow = '';
}

loginModal.addEventListener('click', e => {
  if (e.target === loginModal) closeLogin();
});

function showAuthTab(tab) {
  const loginPane = document.getElementById('loginPane');
  const signupPane = document.getElementById('signupPane');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');

  const isLogin = tab === 'login';
  loginPane.classList.toggle('hidden', !isLogin);
  signupPane.classList.toggle('hidden', isLogin);
  loginTab.classList.toggle('active', isLogin);
  signupTab.classList.toggle('active', !isLogin);
}

const defaultUsers = [
  { name: 'Arafat Hossain', email: 'student@shurangan.bd', password: '123456', role: 'student' },
  { name: 'Nusrat Jahan', email: 'teacher@shurangan.bd', password: '123456', role: 'teacher' },
  { name: 'Md. Hasan Rahman', email: 'admin@shurangan.bd', password: '123456', role: 'admin' }
];

function getUsers() {
  const saved = localStorage.getItem('shurangan_users');
  if (!saved) {
    localStorage.setItem('shurangan_users', JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
  return JSON.parse(saved);
}

function saveUsers(users) {
  localStorage.setItem('shurangan_users', JSON.stringify(users));
}

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const user = getUsers().find(u => u.email.toLowerCase() === email && u.password === password);

  if (!user) {
    showToast('Invalid email or password.');
    return;
  }

  localStorage.setItem('shurangan_current_user', JSON.stringify(user));
  closeLogin();
  showDashboard(user);
});

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const role = document.querySelector('input[name="role"]:checked').value;

  const users = getUsers();

  if (users.some(u => u.email.toLowerCase() === email)) {
    showToast('An account with this email already exists.');
    return;
  }

  const user = { name, email, password, role };
  users.push(user);
  saveUsers(users);
  localStorage.setItem('shurangan_current_user', JSON.stringify(user));

  e.target.reset();
  closeLogin();
  showToast('Account created successfully.');
  setTimeout(() => showDashboard(user), 450);
});

function roleLabel(role) {
  return { student: 'Student', teacher: 'Teacher', admin: 'System Admin' }[role] || 'User';
}

const dashboardData = {
  student: {
    title: 'Student Dashboard',
    nav: [
      ['overview', 'Overview', '▦'],
      ['attendance', 'Attendance', '✓'],
      ['results', 'Exams & Results', '◇'],
      ['payments', 'Payments', 'BDT '],
      ['profile', 'Profile', '○']
    ]
  },
  teacher: {
    title: 'Teacher Dashboard',
    nav: [
      ['overview', 'Overview', '▦'],
      ['batches', 'My Batches', '▤'],
      ['student-attendance', 'Student Attendance', '✓'],
      ['schedule', 'Classes & Schedule', '◷'],
      ['profile', 'Profile', '○']
    ]
  },
  admin: {
    title: 'System Admin Dashboard',
    nav: [
      ['overview', 'Overview', '▦'],
      ['users', 'User Management', '♙'],
      ['programs', 'Programs & Batches', '◆'],
      ['reports', 'Payments & Reports', 'BDT '],
      ['settings', 'System Settings', '⚙']
    ]
  }
};

function showDashboard(user) {
  document.body.classList.add('dashboard-active');
  dashboardView.classList.remove('hidden');
  dashboardView.classList.add('dashboard-visible');
  window.scrollTo(0, 0);

  document.getElementById('dashName').textContent = user.name;
  document.getElementById('dashRole').textContent = roleLabel(user.role);
  document.getElementById('dashAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('dashTitle').textContent = dashboardData[user.role].title;
  document.getElementById('dashWelcome').textContent = `Welcome back, ${user.name}.`;

  const nav = document.getElementById('dashboardNav');
  nav.innerHTML = dashboardData[user.role].nav.map((item, i) =>
    `<button class="dash-nav-item ${i === 0 ? 'active' : ''}" data-page="${item[0]}">
      <span>${item[2]}</span>${item[1]}
    </button>`
  ).join('');

  nav.querySelectorAll('.dash-nav-item').forEach(button => {
    button.addEventListener('click', () => {
      nav.querySelectorAll('.dash-nav-item').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      renderDashboardPage(user, button.dataset.page);
    });
  });

  renderDashboardPage(user, 'overview');
}

function renderDashboardPage(user, page) {
  const titleMap = {};
  dashboardData[user.role].nav.forEach(x => titleMap[x[0]] = x[1]);
  document.getElementById('dashTitle').textContent = titleMap[page] || dashboardData[user.role].title;

  const content = document.getElementById('dashboardContent');

  if (user.role === 'student') {
    content.innerHTML = studentPage(page, user);
  } else if (user.role === 'teacher') {
    content.innerHTML = teacherPage(page, user);
  } else {
    content.innerHTML = adminPage(page, user);
  }
}

function card(icon, label, value, note = '') {
  return `<div class="dash-stat"><span class="dash-stat-icon">${icon}</span><div><small>${label}</small><strong>${value}</strong>${note ? `<em>${note}</em>` : ''}</div></div>`;
}

function studentPage(page, user) {
  const pages = {
    overview: `
      <div class="dash-grid four">
        ${card('✓','Attendance','92%','Good standing')}
        ${card('◇','Current GPA','3.78','Excellent progress')}
        ${card('◷','Next Class','Today','5:00 PM')}
        ${card('BDT ','Fee Status','Paid','Current month')}
      </div>
      <div class="dash-grid two mt-6">
        <div class="dash-panel"><div class="panel-head"><h3>Current Programs</h3><span>2 Active</span></div>
          <div class="list-row"><b>Rabindra Sangeet</b><small>Batch RS-12 • Music Hall</small><strong>92%</strong></div>
          <div class="list-row"><b>Bengali Folk Dance</b><small>Batch FD-08 • Studio 2</small><strong>89%</strong></div>
        </div>
        <div class="dash-panel"><div class="panel-head"><h3>Upcoming</h3><span>View all</span></div>
          <div class="timeline-row"><b>12</b><div><strong>Monthly Assessment</strong><small>Music Hall • 5:00 PM</small></div></div>
          <div class="timeline-row"><b>18</b><div><strong>Folk Dance Showcase</strong><small>Main Auditorium • 6:30 PM</small></div></div>
        </div>
      </div>`,
    attendance: `
      <div class="dash-grid four">${card('✓','Overall Attendance','92%')}${card('♫','Music','95%')}${card('✦','Dance','89%')}${card('◉','Arts','93%')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Attendance History</h3><span>Current Term</span></div>
        ${['Rabindra Sangeet','Bengali Folk Dance','Bengal Folk Art'].map((x,i)=>`<div class="progress-row"><div><b>${x}</b><span>${[95,89,93][i]}%</span></div><div class="progress"><i style="width:${[95,89,93][i]}%"></i></div></div>`).join('')}
      </div>`,
    results: `
      <div class="dash-panel"><div class="panel-head"><h3>Examinations & Results</h3><span>2026 Term</span></div>
        <div class="table-like"><div class="table-head"><span>Examination</span><span>Date</span><span>Result</span></div>
        <div><span>Mid-Term Music Assessment</span><span>08 Aug 2026</span><b>92 / 100</b></div>
        <div><span>Dance Performance Assessment</span><span>02 Aug 2026</span><b>88 / 100</b></div>
        <div><span>Arts Portfolio Review</span><span>25 Jul 2026</span><b>91 / 100</b></div></div>
      </div>`,
    payments: `
      <div class="dash-grid three">${card('BDT ','Current Fee','BDT 4,500','Paid')}${card('▣','Last Payment','BDT 4,500','05 Aug 2026')}${card('✓','Balance','BDT 0','No dues')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Payment History</h3><span>All transactions</span></div>
        <div class="table-like"><div class="table-head"><span>Transaction</span><span>Date</span><span>Amount</span></div>
        <div><span>Monthly Tuition — August</span><span>05 Aug 2026</span><b>BDT 4,500</b></div>
        <div><span>Monthly Tuition — July</span><span>05 Jul 2026</span><b>BDT 4,500</b></div></div>
      </div>`,
    profile: profilePage(user)
  };
  return pages[page] || pages.overview;
}

function teacherPage(page, user) {
  const pages = {
    overview: `
      <div class="dash-grid four">${card('▤','Active Batches','4')}${card('♙','Students','86')}${card('✓','Avg. Attendance','91%')}${card('◷','Today','2 Classes')}</div>
      <div class="dash-grid two mt-6">
        <div class="dash-panel"><div class="panel-head"><h3>Today's Classes</h3><span>10 Aug 2026</span></div>
          <div class="timeline-row"><b>5:00</b><div><strong>Rabindra Sangeet — RS-12</strong><small>Music Hall • 24 Students</small></div></div>
          <div class="timeline-row"><b>7:00</b><div><strong>Music Ensemble — ME-04</strong><small>Studio 1 • 18 Students</small></div></div>
        </div>
        <div class="dash-panel"><div class="panel-head"><h3>Attention Needed</h3><span>3 items</span></div>
          <div class="list-row"><b>Attendance pending</b><small>Batch FD-08 • Today</small><strong>Open</strong></div>
          <div class="list-row"><b>Assessment review</b><small>RS-12 • 8 submissions</small><strong>Open</strong></div>
        </div>
      </div>`,
    batches: `
      <div class="dash-panel"><div class="panel-head"><h3>My Batches</h3><span>4 Active</span></div>
        ${['RS-12 • Rabindra Sangeet','NG-07 • Nazrul Geeti','FD-08 • Bengali Folk Dance','FM-03 • Folk Music Ensemble'].map((x,i)=>`<div class="list-row"><b>${x}</b><small>${[24,18,26,18][i]} Students • ${['Mon & Wed','Sun & Tue','Mon & Thu','Sat & Tue'][i]}</small><strong>View →</strong></div>`).join('')}
      </div>`,
    'student-attendance': `
      <div class="dash-grid three">${card('✓','Today Marked','62 / 68')}${card('!','Pending','6')}${card('◷','This Month','91%')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Batch Attendance</h3><span>Today</span></div>
        ${['RS-12','NG-07','FD-08','FM-03'].map((x,i)=>`<div class="progress-row"><div><b>${x}</b><span>${[96,90,88,92][i]}%</span></div><div class="progress"><i style="width:${[96,90,88,92][i]}%"></i></div></div>`).join('')}
      </div>`,
    schedule: `
      <div class="dash-panel"><div class="panel-head"><h3>Classes & Schedule</h3><span>Weekly</span></div>
        ${['Sunday — 5:00 PM — Nazrul Geeti — Music Hall','Monday — 5:00 PM — Rabindra Sangeet — Music Hall','Tuesday — 7:00 PM — Folk Music Ensemble — Studio 1','Thursday — 5:00 PM — Bengali Folk Dance — Studio 2'].map(x=>`<div class="list-row"><b>${x.split(' — ')[0]}</b><small>${x.split(' — ').slice(1).join(' • ')}</small><strong>Details</strong></div>`).join('')}
      </div>`,
    profile: profilePage(user)
  };
  return pages[page] || pages.overview;
}

function adminPage(page, user) {
  const pages = {
    overview: `
      <div class="dash-grid four">${card('♙','Total Users','1,842')}${card('▤','Programs','25')}${card('▣','Active Batches','48')}${card('BDT ','Monthly Revenue','BDT 8.4L')}</div>
      <div class="dash-grid two mt-6">
        <div class="dash-panel"><div class="panel-head"><h3>Academy Activity</h3><span>This month</span></div>
          <div class="progress-row"><div><b>Student enrollment</b><span>+12%</span></div><div class="progress"><i style="width:72%"></i></div></div>
          <div class="progress-row"><div><b>Fee collection</b><span>89%</span></div><div class="progress"><i style="width:89%"></i></div></div>
          <div class="progress-row"><div><b>Attendance reporting</b><span>94%</span></div><div class="progress"><i style="width:94%"></i></div></div>
        </div>
        <div class="dash-panel"><div class="panel-head"><h3>Quick Actions</h3></div>
          <div class="quick-actions"><button>+ Add Student</button><button>+ Create Batch</button><button>+ Add Program</button><button>View Reports</button></div>
        </div>
      </div>`,
    users: `
      <div class="dash-grid three">${card('♙','Students','1,520')}${card('👨‍🏫','Teachers','85')}${card('🛠️','Admins','7')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Recent Users</h3><button class="small-action">Manage All →</button></div>
        ${['Arafat Hossain • Student','Nusrat Jahan • Teacher','Maliha Rahman • Student','Tanvir Hasan • Teacher'].map(x=>`<div class="list-row"><b>${x.split(' • ')[0]}</b><small>${x.split(' • ')[1]} • Recently registered</small><strong>View</strong></div>`).join('')}
      </div>`,
    programs: `
      <div class="dash-grid three">${card('◆','Programs','25')}${card('▤','Batches','48')}${card('◷','Classrooms','16')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Programs & Batches</h3><button class="small-action">+ Add New</button></div>
        ${['Rabindra Sangeet','Nazrul Geeti','Bengali Folk Dance','Folk Music Ensemble','Bengal Folk Art'].map((x,i)=>`<div class="list-row"><b>${x}</b><small>${[6,4,8,5,3][i]} active batches</small><strong>Manage →</strong></div>`).join('')}
      </div>`,
    reports: `
      <div class="dash-grid three">${card('BDT ','Collected','BDT 8.4L','This month')}${card('▣','Transactions','1,264','Processed')}${card('!','Pending','18','Needs review')}</div>
      <div class="dash-panel mt-6"><div class="panel-head"><h3>Recent Transactions</h3><span>Latest</span></div>
        ${['ST-2048 • Tuition Payment • BDT 4,500','ST-2047 • Tuition Payment • BDT 4,500','ST-2046 • Registration Fee • BDT 2,000'].map(x=>`<div class="list-row"><b>${x.split(' • ')[0]}</b><small>${x.split(' • ')[1]}</small><strong>${x.split(' • ')[2]}</strong></div>`).join('')}
      </div>`,
    settings: `
      <div class="dash-panel"><div class="panel-head"><h3>System Settings</h3><span>Administration</span></div>
        ${['Academy Profile','User Roles & Permissions','Notification Settings','Database & Backup','Security & Authentication'].map(x=>`<div class="settings-row"><div><b>${x}</b><small>Manage ${x.toLowerCase()}.</small></div><button>Open →</button></div>`).join('')}
      </div>`,
    profile: profilePage(user)
  };
  return pages[page] || pages.overview;
}

function profilePage(user) {
  return `<div class="dash-panel profile-panel">
    <div class="profile-head"><div class="profile-large">${user.name.charAt(0).toUpperCase()}</div><div><h3>${user.name}</h3><p>${roleLabel(user.role)}</p></div></div>
    <div class="profile-fields"><div><small>Full Name</small><b>${user.name}</b></div><div><small>Email</small><b>${user.email}</b></div><div><small>Role</small><b>${roleLabel(user.role)}</b></div><div><small>Account Status</small><b class="status-good">Active</b></div></div>
  </div>`;
}

function logout() {
  localStorage.removeItem('shurangan_current_user');
  dashboardView.classList.add('hidden');
  dashboardView.classList.remove('dashboard-visible');
  document.body.classList.remove('dashboard-active');
  window.scrollTo({top: 0, behavior: 'smooth'});
  showToast('You have been logged out.');
}

function returnHome() {
  dashboardView.classList.add('hidden');
  dashboardView.classList.remove('dashboard-visible');
  document.body.classList.remove('dashboard-active');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// Newsletter
document.getElementById('newsletter').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  showToast('Thank you! You are subscribed to Shurangan updates.');
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Active navigation while scrolling
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));

// Restore an active session if the user refreshes while logged in.
const activeUser = localStorage.getItem('shurangan_current_user');
if (activeUser) {
  try { showDashboard(JSON.parse(activeUser)); } catch { localStorage.removeItem('shurangan_current_user'); }
}
