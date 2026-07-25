/* =========================================================
   TALA Digital Media Advertising & Events — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ---------- cursor spotlight ---------- */
  const spot = document.getElementById('spotlight');
  if (spot && finePointer && !reducedMotion) {
    window.addEventListener('mousemove', (e) => {
      spot.style.left = e.clientX + 'px';
      spot.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', () => { spot.style.opacity = 0; });
    window.addEventListener('mouseenter', () => { spot.style.opacity = 1; });
  } else if (spot) {
    spot.style.display = 'none';
  }

  /* ---------- mobile nav toggle ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    links.querySelectorAll('a[data-close]').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      })
    );
  }

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 3D tilt on cards (desktop / fine pointer only) ---------- */
  if (finePointer && !reducedMotion) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach(el => {
      let frame = null;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const max = parseFloat(el.dataset.tiltMax) || 7;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          el.style.transform =
            `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(6px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        if (frame) cancelAnimationFrame(frame);
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });

    /* hero watermark + medallion parallax */
    const hero = document.querySelector('.hero');
    const watermark = document.querySelector('.hero-watermark');
    const medallion = document.querySelector('.medallion');
    if (hero && (watermark || medallion)) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        if (watermark) {
          watermark.style.transform =
            `translate(${(px * -18).toFixed(1)}px, calc(-50% + ${(py * -18).toFixed(1)}px)) rotate(${(px * 3).toFixed(1)}deg)`;
        }
        if (medallion) {
          medallion.style.transform = `translate(${(px * 14).toFixed(1)}px, ${(py * 14).toFixed(1)}px)`;
        }
      });
      hero.addEventListener('mouseleave', () => {
        if (watermark) watermark.style.transform = 'translateY(-50%)';
        if (medallion) medallion.style.transform = 'translate(0, 0)';
      });
    }
  }

  /* ---------- work showreel video controls ---------- */
  document.querySelectorAll('.work-video').forEach(wrap => {
    const video = wrap.querySelector('video');
    const playBtn = wrap.querySelector('.play-btn');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => { video.play(); });
    video.addEventListener('play', () => wrap.classList.add('is-playing'));
    video.addEventListener('pause', () => wrap.classList.remove('is-playing'));
    video.addEventListener('ended', () => wrap.classList.remove('is-playing'));
  });

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- contact form ---------- */
  const CONTACT_EMAIL = 'taladigitalmedia@gmail.com';
  const form = document.getElementById('inquiryForm');
  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  if (form) {
    const fields = {
      name: form.querySelector('#f-name'),
      email: form.querySelector('#f-email'),
      phone: form.querySelector('#f-phone'),
      service: form.querySelector('#f-service'),
      message: form.querySelector('#f-message'),
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, message) {
      const wrap = field.closest('.field');
      const msg = wrap.querySelector('.err-msg');
      wrap.classList.add('invalid');
      if (msg) msg.textContent = message;
    }

    function clearError(field) {
      field.closest('.field').classList.remove('invalid');
    }

    function validate() {
      let valid = true;

      if (!fields.name.value.trim()) {
        setError(fields.name, 'Please tell us your name.');
        valid = false;
      } else clearError(fields.name);

      if (!fields.email.value.trim() || !emailPattern.test(fields.email.value.trim())) {
        setError(fields.email, 'Enter a valid email address.');
        valid = false;
      } else clearError(fields.email);

      if (!fields.service.value) {
        setError(fields.service, 'Select what you need.');
        valid = false;
      } else clearError(fields.service);

      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        setError(fields.message, 'Give us a few details (10+ characters).');
        valid = false;
      } else clearError(fields.message);

      return valid;
    }

    Object.values(fields).forEach(field => {
      if (!field) return;
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    function mailtoFallback() {
      const subject = `New project inquiry — ${fields.service.value}`;
      const body =
`Name: ${fields.name.value.trim()}
Email: ${fields.email.value.trim()}
Phone: ${fields.phone.value.trim() || 'Not provided'}
Service: ${fields.service.value}

Message:
${fields.message.value.trim()}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    function setSubmitting(isSubmitting) {
      submitBtn.disabled = isSubmitting;
      submitBtn.style.opacity = isSubmitting ? '.6' : '1';
      submitBtn.style.cursor = isSubmitting ? 'wait' : 'pointer';
      submitBtn.querySelector('.btn-label').textContent = isSubmitting ? 'Sending…' : 'Send inquiry';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validate()) {
        statusBox.textContent = 'Please fix the highlighted fields.';
        statusBox.className = 'form-status show err';
        return;
      }

      setSubmitting(true);
      statusBox.className = 'form-status';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          statusBox.textContent = "Thanks — your message is on its way. We'll be in touch shortly.";
          statusBox.className = 'form-status show ok';
          form.reset();
        } else {
          throw new Error('Form endpoint returned an error');
        }
      } catch (err) {
        // Network or endpoint failure — fall back to mailto so the
        // client's message still reaches us either way.
        mailtoFallback();
        statusBox.textContent = "Couldn't send automatically, so we opened your email app instead.";
        statusBox.className = 'form-status show err';
      } finally {
        setSubmitting(false);
      }
    });
  }

});
