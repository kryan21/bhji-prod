/* FINAL8: hero video + founder + autoplay films */
/* Bhaiya Ji Photobale — shared interactions */
(function () {
  'use strict';

  /* header state */
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* active nav */
  var page = (location.pathname.split('/').pop() || 'index.html');
  if (page === '') page = 'index.html';
  document.querySelectorAll('.nav a, .mobile-menu a[data-nav]').forEach(function (a) {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* mobile menu */
  var mm = document.querySelector('.mobile-menu');
  var burger = document.querySelector('.burger');
  var mmClose = document.querySelector('.mm-close');
  if (burger && mm) burger.addEventListener('click', function () { mm.classList.add('open'); document.body.style.overflow = 'hidden'; });
  function closeMM() { if (mm) { mm.classList.remove('open'); document.body.style.overflow = ''; } }
  if (mmClose) mmClose.addEventListener('click', closeMM);
  if (mm) mm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMM); });

  /* reveal on scroll */
  var rvEls = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && rvEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rvEls.forEach(function (el) { io.observe(el); });
  } else { rvEls.forEach(function (el) { el.classList.add('in'); }); }

  /* films rail arrows */
  var rail = document.querySelector('.films-rail');
  if (rail) {
    var prev = document.querySelector('[data-rail-prev]'), next = document.querySelector('[data-rail-next]');
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -560, behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: 560, behavior: 'smooth' }); });
  }

  /* film player modal */
  var modal = document.querySelector('#filmModal');
  var video = modal ? modal.querySelector('video') : null;
  var mTitle = modal ? modal.querySelector('[data-mtitle]') : null;
  var mMeta = modal ? modal.querySelector('[data-mmeta]') : null;
  var mLink = modal ? modal.querySelector('[data-mlink]') : null;
  function openFilm(src, title, meta, ig) {
    if (!modal || !video) return;
    video.src = src; video.poster = '';
    if (mTitle) mTitle.textContent = title || '';
    if (mMeta) mMeta.textContent = meta || '';
    if (mLink) mLink.href = ig || '#';
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  }
  function closeFilm() {
    if (!modal || !video) return;
    video.pause(); video.removeAttribute('src'); video.load();
    modal.classList.remove('open'); document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-film]').forEach(function (el) {
    el.addEventListener('click', function () {
      openFilm(el.getAttribute('data-film'), el.getAttribute('data-title'), el.getAttribute('data-meta'), el.getAttribute('data-ig'));
    });
  });
  if (modal) {
    modal.querySelector('.modal-close').addEventListener('click', closeFilm);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeFilm(); });
  }

  /* gallery filter + lightbox */
  var fBtns = document.querySelectorAll('.filter-btn');
  var gItems = document.querySelectorAll('.gal-item');
  fBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      fBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      gItems.forEach(function (it) {
        var cats = (it.getAttribute('data-cat') || '').split(' ');
        it.classList.toggle('hide', f !== 'all' && cats.indexOf(f) === -1);
      });
    });
  });
  var lb = document.querySelector('#lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbT = lb.querySelector('[data-ltitle]'), lbM = lb.querySelector('[data-lmeta]'), lbA = lb.querySelector('[data-llink]');
    function closeLB() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    gItems.forEach(function (it) {
      it.addEventListener('click', function () {
        var img = it.querySelector('img');
        lbImg.src = img ? img.src : '';
        lbT.textContent = it.getAttribute('data-title') || '';
        lbM.textContent = it.getAttribute('data-meta') || '';
        lbA.href = it.getAttribute('data-ig') || '#';
        lb.classList.add('open'); document.body.style.overflow = 'hidden';
      });
    });
    lb.querySelector('.modal-close').addEventListener('click', closeLB);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeFilm(); var l = document.querySelector('#lightbox'); if (l) { l.classList.remove('open'); document.body.style.overflow = ''; } }
  });

  /* work cards on home also open lightbox-style film player when they carry data-film (handled above) */

  /* faq */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = null; });
      if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* package preselect via ?package= */
  var params = new URLSearchParams(location.search);
  var pkgSel = document.querySelector('#pkgSelect');
  if (pkgSel && params.get('package')) pkgSel.value = params.get('package');

  /* enquiry form -> WhatsApp */
  var form = document.querySelector('#enquiryForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var lines = [
        'Hello Bhaiya Ji Photobale! I want to enquire about wedding photography.',
        'Names: ' + v('fNames'),
        'Phone: ' + v('fPhone'),
        'Wedding date: ' + v('fDate'),
        'City / Venue: ' + v('fCity'),
        'Package: ' + v('pkgSelect'),
        'Message: ' + v('fMsg')
      ].filter(function (l) { return l.split(':').slice(1).join(':').trim() !== ''; });
      window.open('https://wa.me/918595368753?text=' + encodeURIComponent(lines.join('\n')), '_blank');
    });
  }

  /* footer year */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();

/* ============================================================
   3D + INTERACTIVE LAYER
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var touch = window.matchMedia('(pointer: coarse)').matches;

  /* ---- scroll progress ---- */
  var prog = document.createElement('div'); prog.id = 'scrollProgress';
  document.body.appendChild(prog);

  /* ---- animated counters ---- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced) { el.textContent = target.toLocaleString('en-IN') + suffix; return; }
    var started = false;
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || started) return; started = true;
        var t0 = null, dur = 1600;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step); cio.disconnect();
      });
    }, { threshold: 0.5 });
    cio.observe(el);
  });

  if (reduced) { return; }

  /* ---- 3D tilt cards ---- */
  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var glare = document.createElement('span'); glare.className = 'tilt-glare';
      card.appendChild(glare);
      var raf = null, rx = 0, ry = 0, tx = 0, ty = 0;
      function loop() {
        rx += (tx - rx) * 0.14; ry += (ty - ry) * 0.14;
        card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
        if (Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) { raf = requestAnimationFrame(loop); }
        else { raf = null; if (tx === 0 && ty === 0) card.style.transform = ''; }
      }
      function kick() { if (!raf) raf = requestAnimationFrame(loop); }
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        var max = parseFloat(card.getAttribute('data-tilt')) || 9;
        ty = (px - 0.5) * 2 * max; tx = (0.5 - py) * 2 * max;
        card.style.setProperty('--gx', (px * 100) + '%');
        card.style.setProperty('--gy', (py * 100) + '%');
        kick();
      });
      card.addEventListener('pointerleave', function () { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---- hero 3D stage + parallax ---- */
  var hero = document.querySelector('.hero');
  var heroMain = document.querySelector('.hero-main');
  var heroFloat = document.querySelector('.hero-float');
  var heroBadge = document.querySelector('.hero-badge');
  if (hero && heroMain && finePointer) {
    var hx = 0, hy = 0, htx = 0, hty = 0, hRaf = null;
    function hLoop() {
      hx += (htx - hx) * 0.06; hy += (hty - hy) * 0.06;
      heroMain.style.transform = 'rotateY(' + (hx * 7).toFixed(2) + 'deg) rotateX(' + (-hy * 7).toFixed(2) + 'deg)';
      if (heroFloat) heroFloat.style.translate = (hx * -16) + 'px ' + (hy * -12) + 'px';
      if (heroBadge) heroBadge.style.translate = (hx * 14) + 'px ' + (hy * 10) + 'px';
      if (Math.abs(htx - hx) > 0.002 || Math.abs(hty - hy) > 0.002) { hRaf = requestAnimationFrame(hLoop); } else { hRaf = null; }
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      htx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      hty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!hRaf) hRaf = requestAnimationFrame(hLoop);
    });
    hero.addEventListener('pointerleave', function () { htx = 0; hty = 0; if (!hRaf) hRaf = requestAnimationFrame(hLoop); });
  }

  /* ---- hero particles (gold dust + sage motes) ---- */
  var canvas = null, ctx = null, parts = [], heroVisible = true;
  if (hero && !touch) {
    canvas = document.createElement('canvas'); canvas.id = 'heroParticles';
    hero.insertBefore(canvas, hero.firstChild);
    ctx = canvas.getContext('2d');
    var W = 0, H = 0;
    function sizeCanvas() {
      W = hero.offsetWidth; H = hero.offsetHeight;
      canvas.width = W; canvas.height = H;
    }
    sizeCanvas(); window.addEventListener('resize', sizeCanvas);
    var N = Math.min(70, Math.max(28, Math.floor(window.innerWidth / 22)));
    for (var i = 0; i < N; i++) {
      parts.push({
        x: Math.random(), y: Math.random(),
        r: 0.8 + Math.random() * 2.4,
        s: 0.00022 + Math.random() * 0.0005,
        drift: Math.random() * Math.PI * 2,
        gold: Math.random() > 0.42,
        a: 0.25 + Math.random() * 0.5
      });
    }
    var pio = new IntersectionObserver(function (es) { es.forEach(function (e) { heroVisible = e.isIntersecting; }); });
    pio.observe(hero);
    (function draw() {
      requestAnimationFrame(draw);
      if (!heroVisible || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      var t = Date.now() * 0.001;
      parts.forEach(function (p) {
        p.y -= p.s; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        var x = (p.x + Math.sin(t * 0.6 + p.drift) * 0.012) * W;
        var y = p.y * H;
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(190,152,66,' + p.a + ')' : 'rgba(42,90,67,' + (p.a * 0.55) + ')';
        ctx.fill();
      });
    })();
  }

  /* ---- scroll parallax images + progress (single rAF loop) ---- */
  var plx = Array.prototype.slice.call(document.querySelectorAll('[data-plx]'));
  var ticking = false;
  function onScrollFx() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    var vh = window.innerHeight;
    plx.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var sp = parseFloat(el.getAttribute('data-plx')) || 0.06;
      var off = (r.top + r.height / 2 - vh / 2) * -sp;
      el.style.transform = 'translateY(' + off.toFixed(1) + 'px) scale(1.12)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFx); }
  }, { passive: true });
  onScrollFx();

  /* ---- custom cursor ---- */
  if (finePointer) {
    document.body.classList.add('has-cursor');
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    var mx = -100, my = -100, rx2 = -100, ry2 = -100;
    document.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    (function cLoop() {
      requestAnimationFrame(cLoop);
      rx2 += (mx - rx2) * 0.16; ry2 += (my - ry2) * 0.16;
      ring.style.left = rx2 + 'px'; ring.style.top = ry2 + 'px';
    })();
    document.querySelectorAll('a, button, [data-tilt], .work-card, .gal-item, input, select, textarea').forEach(function (el) {
      el.addEventListener('pointerenter', function () { ring.classList.add('grow'); });
      el.addEventListener('pointerleave', function () { ring.classList.remove('grow'); });
    });
  }

  /* ---- magnetic buttons ---- */
  if (finePointer) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.classList.add('magnet');
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.32;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---- lightbox prev / next ---- */
  var lb = document.querySelector('#lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gal-item, [data-lightbox]'));
  if (lb && items.length > 1) {
    var prev = document.createElement('button'); prev.className = 'lb-nav lb-prev'; prev.innerHTML = '&#8249;'; prev.setAttribute('aria-label', 'Previous photo');
    var next = document.createElement('button'); next.className = 'lb-nav lb-next'; next.innerHTML = '&#8250;'; next.setAttribute('aria-label', 'Next photo');
    lb.appendChild(prev); lb.appendChild(next);
    var lbImg = lb.querySelector('img'), lbT = lb.querySelector('[data-ltitle]'), lbM = lb.querySelector('[data-lmeta]'), lbA = lb.querySelector('[data-llink]');
    function currentVisible() {
      return items.filter(function (it) { return !it.classList.contains('hide'); });
    }
    function show(dir) {
      var vis = currentVisible(); if (!vis.length) return;
      var src = lbImg.getAttribute('src');
      var idx = -1;
      vis.forEach(function (it, i) { var im = it.querySelector('img'); if (im && src && src.indexOf(im.getAttribute('src')) > -1) idx = i; });
      var n = vis[(idx + dir + vis.length) % vis.length];
      var im2 = n.querySelector('img');
      lbImg.src = im2 ? im2.src : '';
      if (lbT) lbT.innerHTML = n.getAttribute('data-title') || '';
      if (lbM) lbM.textContent = n.getAttribute('data-meta') || '';
      if (lbA) lbA.href = n.getAttribute('data-ig') || '#';
    }
    prev.addEventListener('click', function (e) { e.stopPropagation(); show(-1); });
    next.addEventListener('click', function (e) { e.stopPropagation(); show(1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') show(-1);
      if (e.key === 'ArrowRight') show(1);
    });
  }
})();

/* ===== inline autoplay film previews: muted loop, play on screen, pause off screen ===== */
document.addEventListener('DOMContentLoaded', function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video.film-vid'));
  if (!vids.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; /* poster only */
  function load(v) { if (!v.getAttribute('src') && v.getAttribute('data-src')) { v.src = v.getAttribute('data-src'); v.load(); } }
  function tryPlay(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { load(e.target); tryPlay(e.target); }
      else e.target.pause();
    });
  }, { rootMargin: '220px 0px', threshold: 0.12 });
  vids.forEach(function (v) { io.observe(v); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { vids.forEach(function (v) { v.pause(); }); return; }
    vids.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { load(v); tryPlay(v); }
    });
  });
});

/* hero film: honour reduced-motion (poster frame instead of autoplay) */
document.addEventListener('DOMContentLoaded', function () {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var hv = document.querySelector('video.hero-bg');
  if (hv) { hv.removeAttribute('autoplay'); hv.pause(); }
});
