
const navbar = document.getElementById('navbar');
const topBtn = document.getElementById('topBtn');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginModal = document.getElementById('loginModal');
const dashboard = document.getElementById('dashboard');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  topBtn.style.display = window.scrollY > 500 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => window.scrollTo({top: 0, behavior:'smooth'}));
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

function openLogin() {
  if (dashboard && !dashboard.classList.contains('hidden')) return;
  loginModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  showLoginView();
}
function closeLogin() {
  loginModal.classList.add('hidden');
  document.body.style.overflow = '';
}
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeLogin(); });

function showSignup() {
  document.getElementById('authLoginView').classList.add('hidden');
  document.getElementById('authSignupView').classList.remove('hidden');
}
function showLoginView() {
  document.getElementById('authSignupView').classList.add('hidden');
  document.getElementById('authLoginView').classList.remove('hidden');
}
let selectedRole = '';
function selectRole(button) {
  selectedRole = button.dataset.role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  button.classList.add('selected');
}

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!selectedRole) {
    showToast('Please select Student, Teacher or System Admin.');
    return;
  }
  const user = {
    name: document.getElementById('signupName').value.trim(),
    email: document.getElementById('signupEmail').value.trim(),
    password: document.getElementById('signupPassword').value,
    role: selectedRole
  };
  localStorage.setItem('shuranganUser', JSON.stringify(user));
  document.getElementById('loginId').value = user.email;
  document.getElementById('loginPassword').value = '';
  showLoginView();
  showToast('Account created. Please sign in to continue.');
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const stored = JSON.parse(localStorage.getItem('shuranganUser') || 'null');
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!stored) {
    showToast('No demo account found. Please create an account first.');
    showSignup();
    return;
  }
  if ((id !== stored.email) && (id !== stored.name)) {
    showToast('Email/ID does not match the registered account.');
    return;
  }
  if (password !== stored.password) {
    showToast('Incorrect password.');
    return;
  }
  closeLogin();
  openDashboard(stored);
});

const dashboardData = {
  "Student": {
    items: ["Overview","Attendance","Exams & Results","Payments","Profile"],
    title: "Student Dashboard",
    cards: [["Attendance","92%","Good standing"],["Upcoming Exam","Bengali Music Theory","18 Aug 2026"],["Pending Payment","৳ 2,500","Due 15 Aug"]]
  },
  "Teacher": {
    items: ["Overview","My Batches","Student Attendance","Classes & Schedule","Profile"],
    title: "Teacher Dashboard",
    cards: [["My Batches","4","Active batches"],["Today's Classes","3","Scheduled sessions"],["Students","86","Across your batches"]]
  },
  "System Admin": {
    items: ["Overview","User Management","Programs & Batches","Payments & Reports","System Settings"],
    title: "System Admin Dashboard",
    cards: [["Students","1,500+","Registered learners"],["Teachers","85+","Academy faculty"],["Programs","25+","Active programs"]]
  }
};

function openDashboard(user) {
  dashboard.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('dashName').textContent = user.name;
  document.getElementById('dashRole').textContent = user.role;
  document.getElementById('dashAvatar').textContent = user.name.charAt(0).toUpperCase();
  const data = dashboardData[user.role] || dashboardData.Student;
  document.getElementById('dashTitle').textContent = data.title;
  const nav = document.getElementById('dashNav');
  nav.innerHTML = data.items.map((item,i) =>
    `<button class="${i===0?'active':''}" onclick="renderDash('${item.replace(/'/g,"\\'")}', '${user.role}')">${dashIcon(item)}<span>${item}</span></button>`
  ).join('');
  renderDash(data.items[0], user.role);
}
function dashIcon(item) {
  const icons = {"Overview":"⌂","Attendance":"✓","Exams & Results":"▤","Payments":"৳","Profile":"◯","My Batches":"▦","Student Attendance":"✓","Classes & Schedule":"◷","User Management":"♙","Programs & Batches":"◆","Payments & Reports":"৳","System Settings":"⚙"};
  return icons[item] || "•";
}
function renderDash(page, role) {
  document.querySelectorAll('#dashNav button').forEach(b => b.classList.toggle('active', b.textContent.trim().endsWith(page)));
  document.getElementById('dashTitle').textContent = page;
  const user = JSON.parse(localStorage.getItem('shuranganUser') || '{"name":"User","role":"Student"}');
  const content = document.getElementById('dashContent');
  if (page === 'Overview') {
    const cards = dashboardData[role].cards;
    content.innerHTML = `
      <div class="dash-welcome"><div><span>WELCOME BACK</span><h2>${escapeHtml(user.name)}</h2><p>Your ${role.toLowerCase()} workspace is ready.</p></div><div class="dash-seal">✦</div></div>
      <div class="dash-stat-grid">${cards.map(c=>`<div class="dash-stat-card"><small>${c[0]}</small><strong>${c[1]}</strong><span>${c[2]}</span></div>`).join('')}</div>
      <div class="dash-panel"><h3>Shurangan Academy</h3><p>Stay connected with your cultural learning journey. Use the menu to access ${role === 'Student' ? 'attendance, examinations, payments and profile information' : role === 'Teacher' ? 'batches, attendance, schedules and student information' : 'users, programs, payments, reports and system settings'}.</p></div>`;
  } else {
    const descriptions = {
      "Attendance":"Review attendance records and monthly participation.",
      "Exams & Results":"View examinations, marks, results and academic progress.",
      "Payments":"Check fee payments, transaction history and outstanding balances.",
      "Profile":"Manage your academy profile and account information.",
      "My Batches":"View assigned batches, programs and enrolled students.",
      "Student Attendance":"Record and review student attendance for your batches.",
      "Classes & Schedule":"Check upcoming classes, rooms and teaching schedules.",
      "User Management":"Manage students, teachers and system users.",
      "Programs & Batches":"Create and manage cultural programs, batches and schedules.",
      "Payments & Reports":"Review fee transactions and academy financial reports.",
      "System Settings":"Configure academy-wide settings and administrative preferences."
    };
    content.innerHTML = `<div class="dash-panel large"><div class="panel-icon">${dashIcon(page)}</div><h2>${page}</h2><p>${descriptions[page] || 'Manage this area of the Shurangan academy system.'}</p><div class="demo-table"><div><b>Module status</b><span>Ready for Oracle backend</span></div><div><b>Access level</b><span>${role}</span></div><div><b>Next step</b><span>Connect API & database</span></div></div></div>`;
  }
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }

function logout() {
  dashboard.classList.add('hidden');
  document.body.style.overflow = '';
  window.scrollTo({top:0, behavior:'smooth'});
  showToast('You have been logged out.');
}

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

const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
  });
}, {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => observer.observe(section));
