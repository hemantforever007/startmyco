/* ============================================================
   StartMyCo — script.js
   Mobile nav · smooth scroll · active nav · form validation
   · scroll-reveal animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll shadow ─────────────────────────────── */
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

 // Deployment id = AKfycbyK5fvYgji7aSxNIsIGGdhipwYZgZt_OwFtsNtr7ZoZZQbLzf9z_aw-slnVMbdJygkF_w

 // URL  = https://script.google.com/macros/s/AKfycbyK5fvYgji7aSxNIsIGGdhipwYZgZt_OwFtsNtr7ZoZZQbLzf9z_aw-slnVMbdJygkF_w/exec
  /* ── Mobile menu toggle ───────────────────────────────── */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close when any link inside is tapped
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });


  /* ── Smooth scroll for anchor links ──────────────────── */
  var NAV_HEIGHT = 78; // px — matches navbar height

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = this.getAttribute('href');
      var target = id === '#' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ── Active nav link on scroll (IntersectionObserver) ── */
  var sections    = document.querySelectorAll('section[id]');
  var navAnchors  = document.querySelectorAll('.nav-links a');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(function (s) { sectionObserver.observe(s); });


  /* ── Scroll-reveal animations ─────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el, i) {
    // Stagger siblings within the same grid
    el.style.transitionDelay = (i % 6 * 0.07) + 's';
    revealObserver.observe(el);
  });


  /* ── Contact form validation ──────────────────────────── */
  var form        = document.getElementById('contactForm');
  var nameInput   = document.getElementById('cfName');
  var phoneInput  = document.getElementById('cfPhone');
  var nameErr     = document.getElementById('cfNameErr');
  var phoneErr    = document.getElementById('cfPhoneErr');
  var successMsg  = document.getElementById('formSuccess');

  function setError(input, errEl, msg) {
    input.classList.add('field-error');
    errEl.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errEl) {
    input.classList.remove('field-error');
    errEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateName(val) {
    if (!val.trim())         return 'Name is required.';
    if (val.trim().length < 2) return 'Enter at least 2 characters.';
    return '';
  }

  function validatePhone(val) {
    var clean = val.replace(/\D/g, '');
    if (!clean)            return 'Phone number is required.';
    if (clean.length !== 10) return 'Enter a valid 10-digit number.';
    return '';
  }

  // Live clear on input
  nameInput.addEventListener('input', function () { clearError(nameInput, nameErr); });
  phoneInput.addEventListener('input', function () {
    // Strip non-digits as user types
    this.value = this.value.replace(/\D/g, '').slice(0, 10);
    clearError(phoneInput, phoneErr);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nErr = validateName(nameInput.value);
    var pErr = validatePhone(phoneInput.value);

    if (nErr) setError(nameInput, nameErr, nErr);
    else      clearError(nameInput, nameErr);

    if (pErr) setError(phoneInput, phoneErr, pErr);
    else      clearError(phoneInput, phoneErr);

    if (nErr || pErr) {
      (nErr ? nameInput : phoneInput).focus();
      return;
    }

    // ── Send to Formspree + Google Sheets ─────────────────
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    var name    = nameInput.value.trim();
    var phone   = phoneInput.value.trim();
    var service = document.getElementById('cfService').value || 'Not specified';

    var formData = new FormData();
    formData.append('name',    name);
    formData.append('phone',   phone);
    formData.append('service', service);

    // 1️⃣  Google Sheets — fire and forget (no-cors, saves silently)
    var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyK5fvYgji7aSxNIsIGGdhipwYZgZt_OwFtsNtr7ZoZZQbLzf9z_aw-slnVMbdJygkF_w/exec';
    fetch(SHEETS_URL, { method: 'POST', mode: 'no-cors', body: formData });

    // 2️⃣  Formspree — primary, drives the success / error UI
    var FORMSPREE_URL = 'https://formspree.io/f/xaqzpagd';  // ← paste your Formspree URL here (Step A below)
    fetch(FORMSPREE_URL, {
      method:  'POST',
      body:    formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        form.hidden = true;
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Callback';
        alert('Something went wrong. Please try again or call us at +91-9818426375');
      }
    })
    .catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request Callback';
      alert('Network error. Please try again or call us at +91-9818426375');
    });
  });

}());
