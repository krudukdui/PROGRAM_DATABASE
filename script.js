// ============================================
// TOPIC NAVIGATION (sub-tabs within a unit)
// ============================================
function showTopic(unitId, topicId, btn) {
  // Hide all topic contents in this unit
  const unit = document.getElementById(unitId);
  if (!unit) return;

  unit.querySelectorAll('.topic-content').forEach(el => el.classList.remove('active'));
  unit.querySelectorAll('.tnav-btn').forEach(el => el.classList.remove('active'));

  const target = document.getElementById(`${unitId}-${topicId}`);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');

  // Animate items in the newly shown topic
  setTimeout(() => {
    target?.querySelectorAll('.quality-card, .pro-item, .con-item, .df-card, .dbe-item, .comp-item, .rw-item, .db-type-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 50);
    });
  }, 30);
}

// ============================================
// NAVIGATION
// ============================================

const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  const navLink = document.querySelector(`.nav-item[href="#${id}"]`);
  if (navLink) navLink.classList.add('active');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('.main-content').scrollTo({ top: 0, behavior: 'smooth' });
}

// Nav click
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    // ถ้าเป็นลิงก์ภายนอก (มี target="_blank") ให้เปิดปกติ ไม่ต้อง preventDefault
    if (item.getAttribute('target') === '_blank') return;

    e.preventDefault();
    const href = item.getAttribute('href').replace('#', '');
    showSection(href);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    }
  });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

// Navigate function (called from cards)
function navigateTo(id) {
  showSection(id);
}

// ============================================
// UNIT 1 ANIMATIONS
// ============================================
function animateDBLayers() {
  const layers = document.querySelectorAll('.db-layer');
  layers.forEach((layer, i) => {
    layer.style.opacity = '0';
    layer.style.transform = 'translateX(-20px)';
    setTimeout(() => {
      layer.style.transition = 'all 0.5s ease';
      layer.style.opacity = '1';
      layer.style.transform = 'translateX(0)';
    }, i * 200);
  });
}

// ============================================
// INTERSECTING OBSERVERS FOR ANIMATIONS
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Observe animatable elements
document.querySelectorAll('.unit-card, .vocab-item, .dt-card, .norm-card, .crud-card, .ma-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

// MutationObserver to detect section activation
const mutationObs = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const el = mutation.target;
      if (el.classList.contains('active')) {
        // Trigger animations for newly shown section
        setTimeout(() => {
          el.querySelectorAll('.unit-card, .vocab-item, .dt-card, .norm-card, .crud-card, .ma-item').forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 60);
          });

          el.querySelectorAll('.flow-step, .timeline-item, .ht-step, .qs-step').forEach((step, i) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-12px)';
            step.style.transition = 'all 0.4s ease';
            setTimeout(() => {
              step.style.opacity = '1';
              step.style.transform = 'translateX(0)';
            }, 100 + i * 80);
          });
        }, 50);
      }
    }
  });
});

sections.forEach(section => {
  mutationObs.observe(section, { attributes: true });
});

// ============================================
// INTERACTIVE DATA TYPE HOVER INFO
// ============================================
const dtCards = document.querySelectorAll('.dt-card');
dtCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'rgba(255,255,255,0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
  });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
  const units = ['home', 'unit1', 'unit2', 'unit3', 'unit4', 'unit5', 'unit6'];
  const current = [...sections].findIndex(s => s.classList.contains('active'));

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (current < units.length - 1) {
      showSection(units[current + 1]);
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (current > 0) {
      showSection(units[current - 1]);
    }
  }
});

// ============================================
// DEMO TABLE ROW HIGHLIGHT
// ============================================
document.querySelectorAll('.demo-table tbody tr').forEach(row => {
  row.addEventListener('click', () => {
    document.querySelectorAll('.demo-table tbody tr').forEach(r => r.style.background = '');
    row.style.background = 'rgba(79,124,255,0.1)';
  });
});

// ============================================
// INITIAL LOAD ANIMATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Show home section by default
  showSection('home');

  // Animate hero elements
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(24px)';
    setTimeout(() => {
      hero.style.transition = 'all 0.6s ease';
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);
  }

  // Stagger home cards
  setTimeout(() => {
    document.querySelectorAll('.unit-card').forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }, 300);
});

// ============================================
// MACRO DEMO INTERACTIVITY
// ============================================
const meButton = document.querySelector('.me-button');
if (meButton) {
  meButton.addEventListener('click', () => {
    meButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      meButton.style.transform = 'scale(1)';
    }, 150);

    const mmTitle = document.querySelector('.mm-title');
    if (mmTitle) {
      mmTitle.style.color = '#22C55E';
      setTimeout(() => {
        mmTitle.style.color = '#4ADE80';
      }, 500);
    }
  });
}

// ============================================
// HIGHLIGHT ACTIVE NAV ON SCROLL
// ============================================
let activeSection = 'home';

function updateActiveNav(id) {
  if (id !== activeSection) {
    activeSection = id;
  }
}

