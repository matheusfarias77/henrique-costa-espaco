/**
 * HENRIQUE COSTA ESPAÇO - JAVASCRIPT
 * Interactions: Navigation, Mobile Drawer, WhatsApp Integration & Strategic Pre-Booking Form
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const bookingForm = document.getElementById('preBookingForm');

  const WHATSAPP_PHONE = '5521988286774';

  /* --------------------------------------------------------------------------
     1. STICKY HEADER SCROLL SHADOW
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     2. MOBILE MENU DRAWER
     -------------------------------------------------------------------------- */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('is-active');
      mobileToggle.classList.toggle('is-active');
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. STRATEGIC PRE-BOOKING FORM -> DIRECT WHATSAPP CONVERSION
     -------------------------------------------------------------------------- */
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('bookingName');
      const phoneInput = document.getElementById('bookingPhone');
      const serviceSelect = document.getElementById('bookingService');
      const periodSelect = document.getElementById('bookingPeriod');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : 'Corte e Visagismo';
      const period = periodSelect ? periodSelect.value : 'Qualquer horário';

      if (!name || !phone) {
        alert('Por favor, preencha seu nome e WhatsApp para prosseguirmos.');
        return;
      }

      // Build personalized booking message
      const message = `Olá, Henrique! Gostaria de solicitar um pré-agendamento no Henrique Costa Espaço:

• Nome: ${name}
• WhatsApp: ${phone}
• Serviço Desejado: ${service}
• Preferência de Horário: ${period}

Como podemos confirmar o melhor horário?`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

      // Open WhatsApp directly
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* --------------------------------------------------------------------------
     4. SERVICE CATALOG CARDS -> SELECT IN FORM & SMOOTH NAVIGATION
     -------------------------------------------------------------------------- */
  const serviceActionLinks = document.querySelectorAll('.service-card-action');
  const bookingServiceSelect = document.getElementById('bookingService');
  const bookingSection = document.getElementById('agendamento');

  if (serviceActionLinks.length > 0 && bookingServiceSelect && bookingSection) {
    serviceActionLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = link.getAttribute('data-service');

        // 1. Select matching option in existing form without creating duplicates
        if (serviceName) {
          const optionExists = Array.from(bookingServiceSelect.options).some(
            (opt) => opt.value === serviceName
          );
          if (optionExists) {
            bookingServiceSelect.value = serviceName;
            bookingServiceSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        // 2. Smoothly scroll to the booking section accounting for fixed header height
        const headerEl = document.querySelector('.site-header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const targetElement = document.querySelector('.booking-wrapper') || bookingSection;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }

        // 3. Keep URL updated without causing jump
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#agendamento');
        }

        // 4. Focus the service select without auto-submitting or clearing other fields
        setTimeout(() => {
          bookingServiceSelect.focus({ preventScroll: true });
        }, prefersReducedMotion ? 40 : 450);
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. ACTIVE LINK HIGHLIGHT ON SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* --------------------------------------------------------------------------
     6. FAQ ACCORDION (ACCESSIBLE, ARIA-EXPANDED, KEYBOARD FRIENDLY)
     -------------------------------------------------------------------------- */
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  if (faqTriggers.length > 0) {
    faqTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const answerId = trigger.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);

        // Close other items to maintain an uncluttered editorial reading flow
        faqTriggers.forEach((otherTrigger) => {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            const otherAnswerId = otherTrigger.getAttribute('aria-controls');
            const otherAnswer = document.getElementById(otherAnswerId);
            if (otherAnswer) {
              otherAnswer.hidden = true;
            }
          }
        });

        // Toggle clicked item
        trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        if (answer) {
          answer.hidden = isExpanded;
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. TOUCH FEEDBACK ENHANCEMENT (NATIVE iOS SAFARI :active SUPPORT)
     -------------------------------------------------------------------------- */
  document.addEventListener('touchstart', () => {}, { passive: true });

  /* --------------------------------------------------------------------------
     8. ACCESSIBILITY: REVEAL IMMEDIATELY ON KEYBOARD FOCUS
     -------------------------------------------------------------------------- */
  document.addEventListener('focusin', (e) => {
    const target = e.target.closest('.reveal-on-scroll, .reveal-photo');
    if (target && !target.classList.contains('is-revealed')) {
      target.style.transitionDelay = '0ms';
      target.classList.add('is-revealed');
    }
  });

  /* --------------------------------------------------------------------------
     9. SCROLL REVEAL (MOBILE MICROINTERACTIONS WITH GROUP STAGGER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-photo');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window && revealElements.length > 0) {
    const isMobileViewport = () => window.innerWidth <= 768;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const toReveal = [];

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const rect = entry.boundingClientRect;
        const isTallerThanViewport = rect.height > windowHeight;

        // Condition:
        // - Taller elements: trigger when top enters viewport (independent of proportion)
        // - Standard elements: trigger when ~10% enters viewport or ratio >= 0.09
        const shouldTrigger = isTallerThanViewport
          ? (rect.top < windowHeight - 20 && rect.bottom > 20)
          : (entry.intersectionRatio >= 0.09 || rect.top <= windowHeight - Math.min(rect.height * 0.1, 40));

        if (shouldTrigger) {
          toReveal.push(entry);
        }
      });

      if (toReveal.length === 0) return;

      // Sort top-to-bottom so elements reveal in natural reading sequence
      toReveal.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      const isMobile = isMobileViewport();

      toReveal.forEach((entry, index) => {
        const el = entry.target;
        observer.unobserve(el);

        if (isMobile) {
          // Stagger sequence: 80ms interval, capped at 240ms total delay
          const delay = Math.min(index * 80, 240);
          if (delay > 0) {
            el.style.transitionDelay = `${delay}ms`;
          }

          el.classList.add('is-revealed');

          // Clear delay after animation ends so button/card interactions aren't delayed
          const clearDelay = () => {
            el.style.transitionDelay = '';
            el.removeEventListener('transitionend', onTransitionEnd);
          };
          const onTransitionEnd = (evt) => {
            if (evt.target === el && (evt.propertyName === 'opacity' || evt.propertyName === 'transform')) {
              clearDelay();
            }
          };
          el.addEventListener('transitionend', onTransitionEnd);
          setTimeout(clearDelay, delay + 650);
        } else {
          // Desktop: reveal immediately without mobile stagger delay
          el.classList.add('is-revealed');
        }
      });
    }, {
      root: null,
      threshold: [0, 0.08, 0.1, 0.2],
      rootMargin: '0px 0px -10px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     10. AUTHORITY STRIP SEQUENTIAL REVEAL (ESTILO -> CUIDADO -> BELEZA)
     Duração de 500ms por palavra, intervalos de 100ms, execução única.
     -------------------------------------------------------------------------- */
  const authorityStrip = document.querySelector('.authority-strip');
  if (authorityStrip) {
    if (prefersReduced) {
      authorityStrip.classList.add('is-in-view');
    } else if ('IntersectionObserver' in window) {
      const stripObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -10px 0px'
      });
      stripObserver.observe(authorityStrip);

      // Fallback: se o observer demorar ou falhar, revela com segurança
      setTimeout(() => {
        if (!authorityStrip.classList.contains('is-in-view')) {
          authorityStrip.classList.add('is-in-view');
        }
      }, 1200);
    } else {
      authorityStrip.classList.add('is-in-view');
    }
  }
});
