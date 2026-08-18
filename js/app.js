// Everest Tooling & Indestry — shared site behaviour
(function () {
  'use strict';

  // ---- mobile nav toggle ----
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ---- sticky header shadow ----
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---- scroll reveal ----
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---- animated counters ----
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400, start = null;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // ---- contact form (local only) ----
  var form = document.querySelector('#contactForm');
  if (form) {
    var alertBox = form.querySelector('.form__alert');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();
      var valid = name && email && message && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        if (alertBox) { alertBox.textContent = 'Please fill in your name, a valid email and your message.'; alertBox.className = 'form__alert err show'; }
        return;
      }
      try { localStorage.setItem('ev_lastEnquiry', JSON.stringify({ name: name, email: email, subject: data.get('subject') || '', message: message, at: new Date().toISOString() })); } catch (err) {}
      if (alertBox) { alertBox.textContent = 'Thank you, ' + name + '. Your enquiry has been recorded — our team will reach out within one working day.'; alertBox.className = 'form__alert ok show'; }
      form.reset();
    });
  }

  // ---- gallery lightbox ----
  var lb = document.querySelector('.lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item img'));
    var current = 0;
    function show(i) {
      current = (i + items.length) % items.length;
      lbImg.src = items[current].src;
      lbImg.alt = items[current].alt || '';
    }
    document.querySelectorAll('.gallery__item').forEach(function (g, i) {
      g.addEventListener('click', function () { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', function () { lb.classList.remove('open'); document.body.style.overflow = ''; });
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) { lb.classList.remove('open'); document.body.style.overflow = ''; } });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ---- footer year ----
  var yr = document.querySelector('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
