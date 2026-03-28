// ============================================================
// AUTH.JS — ระบบสมาชิก (Login / Register)
// ใช้ localStorage เก็บข้อมูลผู้ใช้ฝั่ง Client
// ในระบบจริงควรเปลี่ยนเป็น Backend API
// ============================================================

const Auth = (() => {
  const USERS_KEY = 'db_course_users';
  const SESSION_KEY = 'db_course_session';

  // ---------- Helpers ----------
  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getCurrentUser() {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    const users = getUsers();
    return users[id] || null;
  }

  // ---------- Register ----------
  function register(username, password, displayName) {
    if (!username || !password || !displayName) return { ok: false, msg: 'กรุณากรอกข้อมูลให้ครบ' };
    if (username.length < 3) return { ok: false, msg: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร' };
    if (password.length < 6) return { ok: false, msg: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };

    const users = getUsers();
    if (users[username]) return { ok: false, msg: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' };

    users[username] = {
      username,
      password, // ในระบบจริง ต้อง hash ก่อน
      displayName,
      createdAt: new Date().toISOString(),
      scores: {},          // { unit1: 80, unit2: 90, ... }
      quizAttempts: {},    // { unit1: [...history], ... }
      unlockedUnits: [1],  // เริ่มเปิดแค่หน่วย 1
    };

    saveUsers(users);
    return { ok: true };
  }

  // ---------- Login ----------
  function login(username, password) {
    const users = getUsers();
    const user = users[username];
    if (!user) return { ok: false, msg: 'ไม่พบชื่อผู้ใช้นี้' };
    if (user.password !== password) return { ok: false, msg: 'รหัสผ่านไม่ถูกต้อง' };

    localStorage.setItem(SESSION_KEY, username);
    return { ok: true, user };
  }

  // ---------- Logout ----------
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ---------- Save Score ----------
  function saveScore(unitNum, score, totalQ, answers) {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return;
    const users = getUsers();
    if (!users[id]) return;

    const attempt = {
      score,
      totalQ,
      percent: Math.round((score / totalQ) * 100),
      answers,
      date: new Date().toISOString(),
    };

    // เก็บ best score
    const prev = users[id].scores[`unit${unitNum}`] || 0;
    users[id].scores[`unit${unitNum}`] = Math.max(prev, attempt.percent);

    // เก็บประวัติทุกครั้ง
    if (!users[id].quizAttempts[`unit${unitNum}`]) {
      users[id].quizAttempts[`unit${unitNum}`] = [];
    }
    users[id].quizAttempts[`unit${unitNum}`].push(attempt);

    // ถ้าผ่าน (≥70%) → ปลดล็อกหน่วยถัดไป
    const PASS_SCORE = 70;
    if (attempt.percent >= PASS_SCORE && unitNum < 6) {
      const nextUnit = unitNum + 1;
      if (!users[id].unlockedUnits.includes(nextUnit)) {
        users[id].unlockedUnits.push(nextUnit);
      }
    }

    saveUsers(users);
    return attempt;
  }

  // ---------- Check if unit is unlocked ----------
  function isUnlocked(unitNum) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.unlockedUnits.includes(unitNum);
  }

  // ---------- Get best score for a unit ----------
  function getBestScore(unitNum) {
    const user = getCurrentUser();
    if (!user) return null;
    return user.scores[`unit${unitNum}`] ?? null;
  }

  return { register, login, logout, getCurrentUser, saveScore, isUnlocked, getBestScore };
})();
