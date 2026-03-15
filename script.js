/* ============================================
   ABHISHEK KANIGANTI — PORTFOLIO JS
   Animations, particles, interactions
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  /* ===========================================
     1. PAGE LOADER
     =========================================== */
  const loader = document.getElementById('page-loader');
  const loaderBarInner = document.querySelector('.loader-bar-inner');

  function hideLoader() {
    if (!prefersReducedMotion) {
      gsap.to(loader, { opacity: 0, duration: 0.6, onComplete: () => { loader.style.display = 'none'; } });
    } else {
      loader.style.display = 'none';
    }
  }

  // Simulate load progress
  if (!prefersReducedMotion) {
    gsap.to(loaderBarInner, { width: '100%', duration: 1.5, ease: 'power2.inOut', onComplete: () => {
      hideLoader();
      runEntranceAnimations();
    }});
  } else {
    loader.style.display = 'none';
    document.querySelectorAll('.hero-label, .hero-role, .hero-summary, .hero-cta, .hero-stats').forEach(el => el.style.opacity = 1);
    document.querySelectorAll('.hero-name .letter').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  /* ===========================================
     2. HERO NAME — SPLIT INTO LETTERS
     =========================================== */
  const heroNameEl = document.getElementById('hero-name');
  const fullName = 'Abhishek Kaniganti';
  fullName.split('').forEach(char => {
    const span = document.createElement('span');
    span.classList.add('letter');
    span.textContent = char === ' ' ? '\u00A0' : char;
    heroNameEl.appendChild(span);
  });

  /* ===========================================
     3. LENIS SMOOTH SCROLL
     =========================================== */
  let lenis;
  if (!prefersReducedMotion && !isMobile) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
      // Close mobile nav
      document.querySelector('.nav-links').classList.remove('open');
    });
  });

  /* ===========================================
     4. CUSTOM CURSOR
     =========================================== */
  if (!isMobile) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
    });

    // Ring follows with lerp
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(cursorRing, { x: ringX, y: ringY });
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-tag, .badge, .contact-pill, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  }

  /* ===========================================
     5. SCROLL PROGRESS BAR
     =========================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  });

  /* ===========================================
     6. NAVBAR SCROLL EFFECT
     =========================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  const navToggle = document.querySelector('.nav-toggle');
  navToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });

  /* ===========================================
     7. tsParticles — NEURAL NETWORK
     =========================================== */
  if (typeof tsParticles !== 'undefined') {
    tsParticles.load('tsparticles', {
      fullScreen: false,
      fpsLimit: 60,
      particles: {
        number: {
          value: isMobile ? 30 : 80,
          density: { enable: true, area: 800 }
        },
        color: { value: ['#7c6af5', '#2dd4bf', '#f59e0b'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: { enable: true, speed: 0.8, minimumValue: 0.1 }
        },
        size: {
          value: { min: 1, max: 3 },
        },
        links: {
          enable: true,
          distance: 150,
          color: '#7c6af5',
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: !prefersReducedMotion,
          speed: 0.6,
          direction: 'none',
          outModes: { default: 'bounce' },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: 'grab',
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 180,
            links: { opacity: 0.4 },
          },
        },
      },
      detectRetina: true,
    });
  }

  /* ===========================================
     8. TYPEWRITER EFFECT
     =========================================== */
  const typewriterEl = document.getElementById('typewriter');
  const titles = [
    'AI Engineer',
    'ML Engineer',
    'Multi-Agent Systems Builder',
    'LLM Applications Developer',
  ];
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const currentTitle = titles[titleIndex];
    if (!isDeleting) {
      typewriterEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentTitle.length) {
        isDeleting = true;
        typeSpeed = 2000; // pause before delete
      } else {
        typeSpeed = 80;
      }
    } else {
      typewriterEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500; // pause before typing next
      }
    }
    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  /* ===========================================
     9. STAT COUNTER ANIMATION
     =========================================== */
  function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const decimals = parseInt(counter.dataset.decimals) || 0;
      const duration = 2;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = eased * target;
        counter.textContent = current.toFixed(decimals);
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }
      requestAnimationFrame(updateCount);
    });
  }

  /* ===========================================
     10. ENTRANCE ANIMATIONS (GSAP)
     =========================================== */
  function runEntranceAnimations() {
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Letters animate in
    tl.to('.hero-name .letter', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.03,
    }, 0.2);

    // Label
    tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.6 }, 0.1);

    // Role
    tl.to('.hero-role', { opacity: 1, duration: 0.6 }, 1);

    // Summary
    tl.to('.hero-summary', { opacity: 1, y: 0, duration: 0.6 }, 1.3);

    // CTA
    tl.to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, 1.5);

    // Stats
    tl.to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, onComplete: animateCounters }, 1.7);

    // Nav
    tl.from('#navbar', { y: -30, opacity: 0, duration: 0.8 }, 0.5);
  }

  /* ===========================================
     11. SCROLL TRIGGER ANIMATIONS
     =========================================== */
  if (!prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Helper for consistent ScrollTrigger config
    const st = (trigger, start = 'top 85%') => ({
      trigger,
      start,
      toggleActions: 'play none none none',
      once: true,
    });

    // About section
    gsap.from('#about .section-label', {
      scrollTrigger: st('#about'),
      opacity: 0, y: 30, duration: 0.6,
    });
    gsap.from('#about .section-title', {
      scrollTrigger: st('#about'),
      opacity: 0, y: 30, duration: 0.6, delay: 0.1,
    });
    gsap.from('.about-visual', {
      scrollTrigger: st('.about-grid'),
      opacity: 0, x: -60, duration: 0.8,
    });
    gsap.from('.about-text', {
      scrollTrigger: st('.about-grid'),
      opacity: 0, x: 60, duration: 0.8, delay: 0.2,
    });

    // Experience — timeline items slide from alternating sides
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      const fromX = i % 2 === 0 ? -80 : 80;
      gsap.from(item, {
        scrollTrigger: st(item),
        opacity: 0, x: fromX, duration: 0.8, ease: 'power3.out',
      });
    });

    // Skills — stagger tags
    document.querySelectorAll('.skill-category').forEach(cat => {
      gsap.from(cat, {
        scrollTrigger: st(cat, 'top 90%'),
        opacity: 0, y: 40, duration: 0.6,
      });
      gsap.from(cat.querySelectorAll('.skill-tag'), {
        scrollTrigger: st(cat, 'top 90%'),
        opacity: 0, y: 15, scale: 0.85, duration: 0.35, stagger: 0.04, ease: 'back.out(1.7)', delay: 0.2,
      });
    });


    // Contact
    gsap.from('.contact-heading', {
      scrollTrigger: st('#contact', 'top 90%'),
      opacity: 0, y: 40, duration: 0.8,
    });
    gsap.from('.contact-pill', {
      scrollTrigger: st('.contact-pills', 'top 95%'),
      opacity: 0, y: 20, duration: 0.5, stagger: 0.1,
    });
    gsap.from('.contact-form', {
      scrollTrigger: st('.contact-form', 'top 95%'),
      opacity: 0, y: 30, duration: 0.6,
    });

    // Section labels and titles for remaining sections
    ['#experience', '#skills', '#projects', '#education'].forEach(id => {
      gsap.from(`${id} .section-label`, {
        scrollTrigger: st(id),
        opacity: 0, y: 30, duration: 0.6,
      });
      gsap.from(`${id} .section-title`, {
        scrollTrigger: st(id),
        opacity: 0, y: 30, duration: 0.6, delay: 0.1,
      });
    });
  }

  /* ===========================================
     12. 3D TILT EFFECT ON PROJECT CARDS
     =========================================== */
  if (!isMobile) {
    document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }

  /* ===========================================
     13. INTERSECTION OBSERVER SAFETY NET
     Guarantees elements become visible even if
     ScrollTrigger doesn't fire (Lenis compat)
     =========================================== */
  const revealTargets = document.querySelectorAll(
    '.skill-tag, .skill-category, .project-card, .edu-card, .contact-pill, .contact-form, .contact-heading, .badge, .timeline-item, .about-visual, .about-text, .section-label, .section-title'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Give ScrollTrigger/GSAP a moment to fire, then force visible
        setTimeout(() => {
          const el = entry.target;
          gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        }, 200);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

})();

