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
     4. ACTIVE LINK HIGHLIGHT ON SCROLL
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
     5. FAQ ACCORDION (ACCESSIBLE, ARIA-EXPANDED, KEYBOARD FRIENDLY)
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
     6. SCROLL REVEAL (DISCREET EDITORIAL MICROINTERACTIONS)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }
});
