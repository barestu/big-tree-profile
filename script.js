  // ── Core references ──
  const navbar      = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgress');

  // ── Scroll: progress bar + navbar ──
  window.addEventListener('scroll', () => {
    // Progress bar
    if (progressBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
    }
    // Navbar compact
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Mobile menu ──
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');

  hamburger.addEventListener('click', () => {
    const open = mobileDrawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileDrawer.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Stagger delays: assign to grid children before observing ──
  document.querySelectorAll('.biz-grid, .brands-grid, .why-grid, .team-grid').forEach(grid => {
    grid.querySelectorAll('.fade-up').forEach((el, i) => {
      el.dataset.stagger = i * 110; // ms
    });
  });

  // ── Scroll-into-view animations (with stagger) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.stagger || 0;
        entry.target.style.transitionDelay = delay + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        // Clear delay after animation so hover transitions aren't delayed
        setTimeout(() => { entry.target.style.transitionDelay = ''; }, +delay + 750);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Active nav link tracking ──
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  // Immediate active on click (don't wait for scroll observer)
  navLinks.forEach(a => {
    a.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Update active on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px -55% 0px' });

  document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

  // ── Smooth scroll (offset for fixed nav) ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });

  // ── Animated counter for about-badge ──
  function animateCounter(el, target) {
    const startTime = Date.now();
    const dur = 1400;
    const tick = () => {
      const t = Math.min((Date.now() - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target) + '+';
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const badgeNum     = document.querySelector('.about-badge .num');
  const aboutSection = document.getElementById('tentang');
  if (badgeNum && aboutSection) {
    const ctrObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Delay slightly so counter starts as the fade-up animation reveals the badge
        setTimeout(() => animateCounter(badgeNum, 4), 700);
        ctrObs.disconnect();
      }
    }, { threshold: 0.2 });
    ctrObs.observe(aboutSection);
  }

  // ── Initialize Lucide icons ──
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ── Contact form ──
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Mengirim…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Pesan Terkirim!';
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Kirim Pesan';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
