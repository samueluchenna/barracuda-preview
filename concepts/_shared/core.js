/* Barracuda concept sites: the few things every design needs. No libraries, no tracking, no cookies.
   WhatsApp opens through a real anchor click (window.open with noopener returns null and navigates the page itself). */
(function () {
  'use strict';
  var WA = '2347088654508', TEL = '07088654508';
  var doc = document, root = doc.documentElement;
  var BB = window.BB = {
    show: '0708 865 4508',
    tel: TEL,
    reduced: !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
    qs: function (s, c) { return (c || doc).querySelector(s); },
    qsa: function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  };

  BB.wa = function (text) { return 'https://wa.me/' + WA + (text ? '?text=' + encodeURIComponent(text) : ''); };

  /* open WhatsApp from a click handler */
  BB.send = function (text) {
    var a = doc.createElement('a');
    a.href = BB.wa(text); a.target = '_blank'; a.rel = 'noopener';
    a.style.display = 'none';
    doc.body.appendChild(a); a.click(); doc.body.removeChild(a);
  };

  /* the one place the request wording lives, so every design says the same thing */
  BB.msg = function (kind, o) {
    o = o || {};
    var who = o.name ? ' My name is ' + o.name + '.' : '';
    var party = (o.adults || 1) + (Number(o.adults || 1) === 1 ? ' adult' : ' adults') + (Number(o.children) > 0 ? ' and ' + o.children + (Number(o.children) === 1 ? ' child' : ' children') : '');
    var day = o.date ? BB.niceDate(o.date) : 'a day to be agreed';
    if (kind === 'room') {
      var n = Number(o.nights) || 1;
      return 'Hello Barracuda Beach Resort. I would like to book a room from ' + day + ' for ' + n + (n === 1 ? ' night' : ' nights') + ', for ' + party + '.' + who + ' Please tell me which rooms are free and what they cost. Thank you.';
    }
    if (kind === 'event') {
      return 'Hello Barracuda Beach Resort. I would like to ask about a group or event on ' + day + ' for about ' + party + '.' + (o.note ? ' ' + o.note + '.' : '') + who + ' Please tell me if the day is open and what it costs. Thank you.';
    }
    return 'Hello Barracuda Beach Resort. I would like to come for a day visit on ' + day + ', for ' + party + '.' + who + ' Please tell me if the day is open and what the fee is. Thank you.';
  };

  BB.niceDate = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return days[d.getDay()] + ' ' + d.getDate() + ' ' + mons[d.getMonth()] + ' ' + d.getFullYear();
  };

  /* upgrade plain WhatsApp links: href works without JavaScript, JavaScript adds the ready message */
  BB.qsa('a[data-wa]').forEach(function (a) {
    a.href = BB.wa(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener';
  });

  /* copy buttons */
  BB.qsa('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy'), old = b.getAttribute('data-label') || b.textContent;
      function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1800); }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done, fallback); } else { fallback(); }
      function fallback() {
        var x = doc.createElement('textarea'); x.value = t; x.setAttribute('readonly', ''); x.style.position = 'fixed'; x.style.opacity = '0';
        doc.body.appendChild(x); x.select();
        try { doc.execCommand('copy'); done(); } catch (e) { b.textContent = 'Press and hold to copy'; }
        doc.body.removeChild(x);
      }
    });
  });

  /* the resort's own room videos: nothing loads from YouTube until a guest taps play */
  BB.qsa('[data-yt]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var id = b.getAttribute('data-yt'), tgt = b.getAttribute('data-target');
      var host = (tgt && BB.qs(tgt)) || b.closest('[data-ytbox]') || b;
      if (tgt) { BB.qsa('[data-yt][data-target="' + tgt + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); }
      var f = doc.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      f.title = b.getAttribute('data-title') || 'Room video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
      f.setAttribute('loading', 'lazy'); f.className = 'ytframe';
      host.innerHTML = ''; host.appendChild(f);
    });
  });

  /* "send my location": the phone asks first, the location goes only into the WhatsApp message */
  BB.qsa('[data-loc]').forEach(function (b) {
    var note = BB.qs('[data-loc-note]');
    b.addEventListener('click', function () {
      if (!navigator.geolocation) { if (note) note.textContent = 'This phone cannot share its location. Call us on ' + BB.show + ' and we will guide you.'; return; }
      navigator.geolocation.getCurrentPosition(function (p) {
        var u = 'https://maps.google.com/?q=' + p.coords.latitude.toFixed(5) + ',' + p.coords.longitude.toFixed(5);
        BB.send('Hello Barracuda Beach Resort. I am trying to find you. Here is where I am: ' + u + ' Please guide me to the gate.');
      }, function () {
        if (note) note.textContent = 'No location shared. You can still call us on ' + BB.show + ' and we will guide you.';
      }, { timeout: 12000, maximumAge: 60000 });
    });
  });

  /* scroll reveal with a scroll handler (not IntersectionObserver: a fast fling leaves gaps), safe with JavaScript off */
  BB.reveal = function (sel) {
    var els = BB.qsa(sel || '.rv');
    if (!els.length) return;
    function pass() {
      var h = window.innerHeight || 800;
      els.forEach(function (el) {
        if (el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.94) el.classList.add('in');   // includes everything already scrolled past
      });
    }
    var t = false;
    function tick() { if (t) return; t = true; requestAnimationFrame(function () { t = false; pass(); }); }
    if (BB.reduced) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    window.addEventListener('load', tick);
    pass();
    setTimeout(pass, 600); setTimeout(pass, 1800);
  };

  /* start work after the logo intro, if it is playing */
  BB.ready = function (fn) {
    if (root.classList.contains('intro')) { window.addEventListener('introdone', fn, { once: true }); } else { fn(); }
  };

  /* the share sheet where the phone has one, otherwise copy the address */
  BB.share = function (btn, url, title) {
    btn.addEventListener('click', function () {
      if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { var o = btn.textContent; btn.textContent = 'Address copied'; setTimeout(function () { btn.textContent = o; }, 1800); });
      }
    });
  };

  /* min date for date inputs = today */
  BB.qsa('input[type=date]').forEach(function (i) {
    var d = new Date(); var z = function (n) { return (n < 10 ? '0' : '') + n; };
    i.min = d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  });
})();
