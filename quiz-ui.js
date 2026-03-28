// ============================================================
// QUIZ-UI.JS — ส่วนแสดงผล UI ทั้งหมด
// Auth Modal, Quiz Screen, Result Screen
// ============================================================

const QuizUI = (() => {

  // ============================================================
  // สร้าง Modal Container หลัก (inject ครั้งเดียว)
  // ============================================================
  function init() {
    if (document.getElementById('quiz-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'quiz-overlay';
    overlay.innerHTML = `
      <!-- AUTH MODAL -->
      <div class="qm-modal" id="qm-auth">
        <div class="qm-box qm-auth-box">
          <div class="qm-logo">🗄️</div>
          <h2 class="qm-title" id="auth-title">เข้าสู่ระบบ</h2>

          <!-- Tab Switcher -->
          <div class="auth-tabs">
            <button class="auth-tab active" onclick="QuizUI.switchTab('login')">เข้าสู่ระบบ</button>
            <button class="auth-tab" onclick="QuizUI.switchTab('register')">สมัครสมาชิก</button>
          </div>

          <!-- Login Form -->
          <div id="form-login" class="auth-form active">
            <div class="qm-field">
              <label>ชื่อผู้ใช้</label>
              <input type="text" id="login-user" placeholder="กรอกชื่อผู้ใช้" autocomplete="username" />
            </div>
            <div class="qm-field">
              <label>รหัสผ่าน</label>
              <input type="password" id="login-pass" placeholder="กรอกรหัสผ่าน" autocomplete="current-password" />
            </div>
            <p class="auth-err" id="login-err"></p>
            <button class="qm-btn qm-btn-primary" onclick="QuizUI.doLogin()">เข้าสู่ระบบ</button>
          </div>

          <!-- Register Form -->
          <div id="form-register" class="auth-form">
            <div class="qm-field">
              <label>ชื่อ-นามสกุล</label>
              <input type="text" id="reg-name" placeholder="ชื่อจริง นามสกุล" />
            </div>
            <div class="qm-field">
              <label>ชื่อผู้ใช้ (ภาษาอังกฤษ)</label>
              <input type="text" id="reg-user" placeholder="เช่น student01" autocomplete="username" />
            </div>
            <div class="qm-field">
              <label>รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
              <input type="password" id="reg-pass" placeholder="กำหนดรหัสผ่าน" autocomplete="new-password" />
            </div>
            <p class="auth-err" id="reg-err"></p>
            <button class="qm-btn qm-btn-primary" onclick="QuizUI.doRegister()">สมัครสมาชิก</button>
          </div>
        </div>
      </div>

      <!-- QUIZ MODAL -->
      <div class="qm-modal" id="qm-quiz" style="display:none">
        <div class="qm-box qm-quiz-box">
          <div class="quiz-header">
            <div>
              <p class="quiz-unit-label" id="quiz-unit-label"></p>
              <h2 class="quiz-title" id="quiz-title-text"></h2>
            </div>
            <button class="qm-btn-close" onclick="QuizUI.closeQuiz()">✕</button>
          </div>

          <!-- Progress -->
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
          </div>
          <p class="quiz-progress-text" id="quiz-progress-text"></p>

          <!-- Question Body -->
          <div class="quiz-body" id="quiz-body"></div>

          <!-- Navigation -->
          <div class="quiz-nav">
            <button class="qm-btn qm-btn-sec" id="quiz-prev-btn" onclick="QuizEngine.prev()">← ก่อนหน้า</button>
            <button class="qm-btn qm-btn-primary" id="quiz-next-btn" onclick="QuizEngine.next()">ถัดไป →</button>
          </div>

          <!-- Warning -->
          <p class="quiz-warning" id="quiz-warning"></p>
        </div>
      </div>

      <!-- RESULT MODAL -->
      <div class="qm-modal" id="qm-result" style="display:none">
        <div class="qm-box qm-result-box">
          <div id="result-content"></div>
          <div class="result-actions">
            <button class="qm-btn qm-btn-sec" onclick="QuizUI.showReview()">ดูเฉลย</button>
            <button class="qm-btn qm-btn-primary" id="result-next-btn" style="display:none" onclick="QuizUI.goNextUnit()">ไปหน่วยถัดไป →</button>
            <button class="qm-btn qm-btn-retry" onclick="QuizUI.retryQuiz()">ทำใหม่</button>
          </div>

          <!-- Review Section -->
          <div id="review-section" style="display:none">
            <h3 class="review-title">เฉลยข้อสอบ</h3>
            <div id="review-list"></div>
          </div>
        </div>
      </div>

      <!-- LOCKED MODAL -->
      <div class="qm-modal" id="qm-locked" style="display:none">
        <div class="qm-box qm-locked-box">
          <div class="locked-icon">🔒</div>
          <h2>หน่วยนี้ยังไม่เปิด</h2>
          <p id="locked-msg"></p>
          <button class="qm-btn qm-btn-primary" onclick="QuizUI.hideAll()">ตกลง</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // กด ESC ปิด
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') QuizUI.closeQuiz();
    });
  }

  // ============================================================
  // SHOW / HIDE MODALS
  // ============================================================
  function showAuth() {
    init();
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.getElementById('qm-auth').style.display = 'flex';
    document.getElementById('qm-quiz').style.display = 'none';
    document.getElementById('qm-result').style.display = 'none';
    document.getElementById('qm-locked').style.display = 'none';
  }

  function hideAll() {
    const overlay = document.getElementById('quiz-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  function showQuizModal() {
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.getElementById('qm-auth').style.display = 'none';
    document.getElementById('qm-quiz').style.display = 'flex';
    document.getElementById('qm-result').style.display = 'none';
    document.getElementById('qm-locked').style.display = 'none';
  }

  function showLockedMessage(unitNum) {
    init();
    const prev = unitNum - 1;
    document.getElementById('locked-msg').textContent =
      `ต้องผ่านแบบทดสอบหน่วยที่ ${prev} ด้วยคะแนน ≥ 70% ก่อน`;
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.getElementById('qm-auth').style.display = 'none';
    document.getElementById('qm-quiz').style.display = 'none';
    document.getElementById('qm-result').style.display = 'none';
    document.getElementById('qm-locked').style.display = 'flex';
  }

  function closeQuiz() {
    hideAll();
  }

  // ============================================================
  // AUTH TAB SWITCH
  // ============================================================
  function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab === 'login') {
      document.querySelectorAll('.auth-tab')[0].classList.add('active');
      document.getElementById('form-login').classList.add('active');
    } else {
      document.querySelectorAll('.auth-tab')[1].classList.add('active');
      document.getElementById('form-register').classList.add('active');
    }
    clearErrors();
  }

  function clearErrors() {
    ['login-err', 'reg-err'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  // ============================================================
  // DO LOGIN
  // ============================================================
  function doLogin() {
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const result = Auth.login(username, password);

    if (!result.ok) {
      document.getElementById('login-err').textContent = result.msg;
      return;
    }

    hideAll();
    updateNavUserInfo();
    showDashboard();
  }

  // ============================================================
  // DO REGISTER
  // ============================================================
  function doRegister() {
    const displayName = document.getElementById('reg-name').value.trim();
    const username = document.getElementById('reg-user').value.trim();
    const password = document.getElementById('reg-pass').value;
    const result = Auth.register(username, password, displayName);

    if (!result.ok) {
      document.getElementById('reg-err').textContent = result.msg;
      return;
    }

    // Auto-login after register
    Auth.login(username, password);
    hideAll();
    updateNavUserInfo();
    showDashboard();
  }

  // ============================================================
  // UPDATE NAV USER INFO
  // ============================================================
  function updateNavUserInfo() {
    const user = Auth.getCurrentUser();
    let userBar = document.getElementById('nav-user-bar');

    if (!userBar) {
      userBar = document.createElement('div');
      userBar.id = 'nav-user-bar';
      userBar.className = 'nav-user-bar';
      const sidebar = document.querySelector('.sidebar-nav');
      if (sidebar) sidebar.prepend(userBar);
    }

    if (user) {
      const scores = [1,2,3,4,5,6].map(u => {
        const s = Auth.getBestScore(u);
        return s !== null ? `U${u}: ${s}%` : `U${u}: -`;
      }).join(' · ');

      userBar.innerHTML = `
        <div class="nav-user-info">
          <span class="nav-user-avatar">👤</span>
          <div>
            <p class="nav-user-name">${user.displayName}</p>
            <p class="nav-user-scores">${scores}</p>
          </div>
        </div>
        <button class="nav-logout-btn" onclick="QuizUI.doLogout()">ออกจากระบบ</button>
      `;
    } else {
      userBar.innerHTML = `
        <button class="qm-btn qm-btn-primary nav-login-trigger" onclick="QuizUI.showAuth()">
          🔐 เข้าสู่ระบบ / สมัครสมาชิก
        </button>
      `;
    }
  }

  // ============================================================
  // LOGOUT
  // ============================================================
  function doLogout() {
    Auth.logout();
    updateNavUserInfo();
    updateQuizButtons();
  }

  // ============================================================
  // RENDER QUIZ SCREEN
  // ============================================================
  function renderQuiz(unitNum, questions) {
    init();
    showQuizModal();

    const bank = QUIZ_BANK[unitNum];
    document.getElementById('quiz-unit-label').textContent = `หน่วยที่ ${unitNum}`;
    document.getElementById('quiz-title-text').textContent = bank.title;
    document.getElementById('review-section').style.display = 'none';

    renderQuestion(0);
  }

  function renderQuestion(idx) {
    const questions = QuizEngine.getCurrentQuestions();
    const answers = QuizEngine.getUserAnswers();
    const q = questions[idx];
    const total = questions.length;

    // Progress
    const pct = Math.round(((idx + 1) / total) * 100);
    document.getElementById('quiz-progress-fill').style.width = pct + '%';
    document.getElementById('quiz-progress-text').textContent = `ข้อ ${idx + 1} / ${total}`;

    // Question
    const body = document.getElementById('quiz-body');
    body.innerHTML = `
      <div class="quiz-question">${idx + 1}. ${q.q}</div>
      <div class="quiz-choices" id="quiz-choices">
        ${q.choices.map((c, ci) => `
          <button class="quiz-choice ${answers[idx] === ci ? 'selected' : ''}"
                  onclick="QuizEngine.selectAnswer(${ci}); QuizUI.highlightAnswer(${idx}, ${ci})">
            <span class="choice-letter">${['A','B','C','D'][ci]}</span>
            <span class="choice-text">${c}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Nav buttons
    document.getElementById('quiz-prev-btn').style.display = idx === 0 ? 'none' : '';
    document.getElementById('quiz-next-btn').textContent =
      idx === total - 1 ? '✅ ส่งคำตอบ' : 'ถัดไป →';
    document.getElementById('quiz-warning').textContent = '';
  }

  function highlightAnswer(qIdx, choiceIdx) {
    if (QuizEngine.getCurrentIndex() !== qIdx) return;
    document.querySelectorAll('.quiz-choice').forEach((btn, i) => {
      btn.classList.toggle('selected', i === choiceIdx);
    });
  }

  function showWarning(msg) {
    const w = document.getElementById('quiz-warning');
    if (w) {
      w.textContent = msg;
      w.style.animation = 'none';
      requestAnimationFrame(() => { w.style.animation = ''; });
    }
  }

  // ============================================================
  // RESULT SCREEN
  // ============================================================
  let _lastResult = null;
  let _lastUnitNum = null;

  function showResult(unitNum, score, total, answers, questions, attempt) {
    _lastResult = { unitNum, score, total, answers, questions };
    _lastUnitNum = unitNum;

    const percent = Math.round((score / total) * 100);
    const passed = percent >= PASS_PERCENT;
    const emoji = percent === 100 ? '🏆' : passed ? '🎉' : '😢';

    document.getElementById('quiz-overlay').style.display = 'flex';
    document.getElementById('qm-quiz').style.display = 'none';
    document.getElementById('qm-result').style.display = 'flex';
    document.getElementById('qm-locked').style.display = 'none';

    document.getElementById('result-content').innerHTML = `
      <div class="result-emoji">${emoji}</div>
      <h2 class="result-heading">${passed ? 'ผ่านการทดสอบ!' : 'ยังไม่ผ่าน'}</h2>
      <div class="result-score-ring ${passed ? 'pass' : 'fail'}">
        <span class="result-score-num">${percent}%</span>
        <span class="result-score-label">${score}/${total} ข้อ</span>
      </div>
      <p class="result-verdict ${passed ? 'pass-txt' : 'fail-txt'}">
        ${passed
          ? `ยอดเยี่ยม! คุณผ่านเกณฑ์ ${PASS_PERCENT}%${unitNum < 6 ? ' หน่วยที่ ' + (unitNum+1) + ' ถูกปลดล็อกแล้ว 🔓' : ''}`
          : `คะแนนยังไม่ถึง ${PASS_PERCENT}% กรุณาทบทวนและทำใหม่`
        }
      </p>
    `;

    // แสดงปุ่มไปหน่วยถัดไป ถ้าผ่านและยังไม่ถึงหน่วย 6
    const nextBtn = document.getElementById('result-next-btn');
    nextBtn.style.display = passed && unitNum < 6 ? '' : 'none';

    // ซ่อน review เริ่มต้น
    document.getElementById('review-section').style.display = 'none';

    // อัปเดต nav scores
    updateNavUserInfo();
    updateQuizButtons();
  }

  function showReview() {
    const { unitNum, score, total, answers, questions } = _lastResult;
    const section = document.getElementById('review-section');
    section.style.display = 'block';

    document.getElementById('review-list').innerHTML = questions.map((q, i) => {
      const userAns = answers[i];
      const correct = q.answer;
      const isRight = userAns === correct;
      return `
        <div class="review-item ${isRight ? 'correct' : 'wrong'}">
          <p class="review-q">${i+1}. ${q.q}</p>
          <p class="review-your">
            คำตอบของคุณ: <strong>${userAns !== null ? q.choices[userAns] : 'ไม่ได้ตอบ'}</strong>
            ${isRight ? '✅' : '❌'}
          </p>
          ${!isRight ? `<p class="review-correct">เฉลย: <strong>${q.choices[correct]}</strong></p>` : ''}
          <p class="review-explain">💡 ${q.explain}</p>
        </div>
      `;
    }).join('');

    section.scrollIntoView({ behavior: 'smooth' });
  }

  function retryQuiz() {
    if (_lastUnitNum) {
      document.getElementById('review-section').style.display = 'none';
      QuizEngine.start(_lastUnitNum);
    }
  }

  function goNextUnit() {
    hideAll();
    if (_lastUnitNum && _lastUnitNum < 6) {
      openQuizForUnit(_lastUnitNum + 1);
    }
  }

  // ============================================================
  // OPEN QUIZ (called from quiz buttons in sidebar/content)
  // ============================================================
  function openQuizForUnit(unitNum) {
    const user = Auth.getCurrentUser();
    if (!user) {
      showAuth();
      return;
    }
    QuizEngine.start(unitNum);
  }

  // ============================================================
  // UPDATE QUIZ BUTTONS IN SIDEBAR + UNIT CARDS
  // ============================================================
  function updateQuizButtons() {
    const user = Auth.getCurrentUser();
    document.querySelectorAll('[data-quiz-unit]').forEach(btn => {
      const u = parseInt(btn.dataset.quizUnit);
      const locked = !Auth.isUnlocked(u);
      const score = Auth.getBestScore(u);

      btn.classList.toggle('quiz-btn-locked', locked);
      btn.innerHTML = locked
        ? `🔒 หน่วยที่ ${u} (ปลดล็อกได้เมื่อผ่านหน่วยก่อนหน้า)`
        : `📝 ทำแบบทดสอบหน่วยที่ ${u}${score !== null ? ` · คะแนนสูงสุด: ${score}%` : ''}`;
    });
  }

  // ============================================================
  // SHOW DASHBOARD (หน้า Home ของ Quiz Hub)
  // ============================================================
  function showDashboard() {
    const user = Auth.getCurrentUser();
    const hub = document.getElementById('quiz-hub-section');
    if (hub && user) {
      hub.style.display = 'block';
      updateQuizButtons();
    }
  }

  return {
    init, showAuth, hideAll, switchTab,
    doLogin, doRegister, doLogout,
    updateNavUserInfo, updateQuizButtons,
    renderQuiz, renderQuestion, highlightAnswer,
    showWarning, showResult, showReview,
    retryQuiz, goNextUnit,
    openQuizForUnit, showLockedMessage,
    showDashboard, closeQuiz
  };
})();

// ============================================================
// BOOT — รันเมื่อหน้าโหลด
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  QuizUI.init();
  QuizUI.updateNavUserInfo();
  QuizUI.updateQuizButtons();
});
