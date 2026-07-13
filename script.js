/* ===================================================================
   Harendra Pratap — Portfolio Interactivity
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sticky Nav ──
  const nav = document.getElementById('navbar');
  const handleNavScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ── Active Nav Link on Scroll ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav__link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => observerNav.observe(section));

  // ── Mobile Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinksContainer.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Smooth Scroll for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll-Triggered Reveal Animations ──
  const revealElements = document.querySelectorAll('.reveal');

  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observerReveal.observe(el));

  // ── Stats Counter Animation ──
  const statNumbers = document.querySelectorAll('.stat-item__number[data-target]');
  let statsAnimated = false;

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return num.toString();
    };

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easedProgress * target);

      element.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => animateCounter(el));
        observerStats.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observerStats.observe(statsSection);

  // ── Project Modal System ──
  const projectCards = document.querySelectorAll('.project-card[data-modal]');
  const modals = document.querySelectorAll('.modal');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.modal);
    });
  });

  modals.forEach(modal => {
    // Close on backdrop click
    modal.querySelector('.modal__backdrop').addEventListener('click', () => {
      closeModal(modal);
    });

    // Close on close button
    modal.querySelector('.modal__close').addEventListener('click', () => {
      closeModal(modal);
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  // ── Contact Form Validation ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate name
      const nameInput = document.getElementById('contact-name');
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
      }

      // Validate email
      const emailInput = document.getElementById('contact-email-input');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('error');
        isValid = false;
      } else {
        emailInput.classList.remove('error');
      }

      // Validate message
      const messageInput = document.getElementById('contact-message');
      if (!messageInput.value.trim()) {
        messageInput.classList.add('error');
        isValid = false;
      } else {
        messageInput.classList.remove('error');
      }

      if (isValid) {
        // Show success message
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');

        // Reset form after delay
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = 'block';
          formSuccess.classList.remove('show');
        }, 5000);
      }
    });

    // Remove error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }

  // ── Parallax-like Effect on Hero ──
  const heroImage = document.querySelector('.hero__image img');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    }, { passive: true });
  }

  // ── Skill Tags Hover Ripple Effect ──
  document.querySelectorAll('.skills__tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.08)';
    });
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

});
