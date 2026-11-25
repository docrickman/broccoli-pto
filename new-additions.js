// Single source of truth for the "NEW ADDITIONS" alerts. To announce something new, add an entry to
// the top of NEW_ADDITIONS (batch: 'latest'), move the previous 'latest' entries to 'earlier', and give
// the target card a matching id on its page. Entry ids must stay unique: they key the "seen" tracking.
(function () {
  var NEW_ADDITIONS = [
    { id: 'subathon', batch: 'latest', important: true, page: 'chatters.html', anchor: 'subathon',
      img: 'assets/spaceghoast.png', where: 'Union Portal',
      title: 'SUBATHON CLAUSE (YOU AGREED TO THIS)',
      blurb: 'Art. 23: every Golden Kappa train extends the subathon 2.3x. Your signature is on file. We are framing it.' },
    { id: 'aliases', batch: 'latest', page: 'chatters.html', anchor: 'aliases',
      img: 'assets/alias-philly.webp', where: 'Union Portal',
      title: 'Your Known Aliases',
      blurb: '"Gerald" and "Philly." Recoloring the mustache did not work. It is a fingerprint.' },
    { id: 'mentorship', batch: 'latest', page: 'timeoff.html', anchor: 'mentorship',
      img: 'assets/mentor.png', where: 'Time Off Portal',
      title: 'Employee Mentorship Program',
      blurb: 'You have been assigned a mentor. He was better at the zombie thing as a child. Ask him about turtles.' },
    { id: 'uniform', batch: 'latest', page: 'timeoff.html', anchor: 'uniform',
      img: 'assets/hivis.png', where: 'Time Off Portal',
      title: 'New Uniform Policy',
      blurb: 'Mandatory hi-vis, so the Borb can find you on impact.' },
    { id: 'nightshift', batch: 'latest', page: 'complaints.html', anchor: 'nightshift',
      img: 'assets/nightshift.webp', where: 'HR Portal',
      title: 'Pre-taliation: Night Shift',
      blurb: 'After-hours coverage. Same employee, different paint.' },
    { id: 'pierrot', batch: 'latest', page: 'index.html', anchor: 'gallery',
      img: 'assets/pierrot.png', where: 'Gateway Museum',
      title: 'New Acquisition: Pie-rrot',
      blurb: 'The sad clown period. Now on permanent display.' },
    { id: 'pies-out', batch: 'latest', page: 'records.html', anchor: 'pies-out',
      img: 'assets/pies-out.png', where: 'Records Room',
      title: 'Incident Report: "Pies Out"',
      blurb: 'The cream did not stay where it was aimed. Facilities would like a word.' },

    { id: 'cube', batch: 'earlier', page: 'timeoff.html', anchor: 'cube',
      img: 'assets/TheCube.jpg', where: 'Time Off Portal',
      title: 'The Approved Leave Facility', blurb: 'Time in the Cube counts as time worked.' },
    { id: 'borbling', batch: 'earlier', page: 'timeoff.html', anchor: 'borbling',
      img: 'assets/CombOverBorbling.png', where: 'Time Off Portal',
      title: 'The PTO Intern', blurb: 'The Borbling denies requests by instinct.' },
    { id: 'pork-composite', batch: 'earlier', page: 'complaints.html', anchor: 'pork-composite',
      img: 'assets/BrocJohnPorkHybrid.png', where: 'HR Portal',
      title: 'HR-PORK-01 Composite', blurb: 'Employee BROC-0002. The questions have snouts.' },
    { id: 'offstream', batch: 'earlier', page: 'chatters.html', anchor: 'offstream',
      img: 'assets/BrocMinecraft.jpg', where: 'Union Portal',
      title: 'Offstream Activity Report', blurb: 'Joy without chat present. The pickaxe is subpoenaed.' },
    { id: 'biangle', batch: 'earlier', page: 'records.html', anchor: 'biangle',
      img: 'assets/Biangle.png', where: 'Records Room',
      title: 'Sighting: The Biangle', blurb: 'Three sides. Two visors. Departs when perceived.' }
  ];

  var SEEN_KEY = 'bhi-new-additions-seen-v1';

  function getSeen() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch (e) { return {}; }
  }
  function markSeen(id) {
    try {
      var s = getSeen();
      s[id] = 1;
      localStorage.setItem(SEEN_KEY, JSON.stringify(s));
    } catch (e) {}
  }
  function unseenCount() {
    var s = getSeen();
    return NEW_ADDITIONS.filter(function (a) { return !s[a.id]; }).length;
  }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var currentPage = (location.pathname.split('/').pop() || 'index.html');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Arriving at a card through a NEW link counts as seeing it.
  if (location.hash) {
    var hash = location.hash.slice(1);
    NEW_ADDITIONS.forEach(function (a) {
      if (a.page === currentPage && a.anchor === hash) markSeen(a.id);
    });
  }

  function itemHtml(a, seen) {
    return '<a class="na-item' + (a.important ? ' na-important' : '') + (seen[a.id] ? ' na-seen' : '') +
      '" href="' + esc(a.page) + '#' + esc(a.anchor) + '" data-id="' + esc(a.id) + '">' +
      '<span class="na-badge">' + (a.important ? 'READ THIS' : 'NEW!') + '</span>' +
      '<img src="' + esc(a.img) + '" alt="">' +
      '<div><div class="na-t">' + esc(a.title) + '</div>' +
      '<div class="na-w">' + esc(a.where) + '</div>' +
      '<div class="na-b">' + esc(a.blurb) + '</div></div></a>';
  }

  function renderGateway(root) {
    var seen = getSeen();
    var n = unseenCount();
    var latest = NEW_ADDITIONS.filter(function (a) { return a.batch === 'latest'; });
    var earlier = NEW_ADDITIONS.filter(function (a) { return a.batch !== 'latest'; });
    var shout = 'BROCCOLI LOOK HERE ➔ BROCCOLI THIS MEANS YOU ➔ NEW STUFF NEW STUFF NEW STUFF ➔ ' +
      'DO NOT SCROLL PAST THIS BROCCOLI ➔ WE CAN SEE YOU SCROLLING ➔ BROCCOLI!!! ➔ ';

    root.innerHTML =
      '<div class="na-inner">' +
        '<div class="na-head"><canvas></canvas>' +
          '<div class="na-title">🚨 BROCCOLI!!! BROCCOLI!!! NEW STUFF!!! 🚨</div>' +
          '<div class="na-sub">' + (n > 0
            ? 'You have <span style="color:#fff;font-size:1.3em">' + n + '</span> unseen addition' + (n === 1 ? '' : 's') + '. We are counting.'
            : 'You have seen everything. HR is suspicious but proud.') + '</div>' +
          '<div class="na-arrows"><span>⬇</span><span>⬇</span><span>⬇</span><span>⬇</span><span>⬇</span></div>' +
        '</div>' +
        '<div class="na-marquee"><div>' + esc(shout + shout) + '</div></div>' +
        '<div class="na-label">✨ Just Added</div>' +
        '<div class="na-list">' + latest.map(function (a) { return itemHtml(a, seen); }).join('') + '</div>' +
        (earlier.length ? '<div class="na-label">Also Recent (in case you missed these too)</div>' +
          '<div class="na-list">' + earlier.map(function (a) { return itemHtml(a, seen); }).join('') + '</div>' : '') +
        '<div class="na-actions">' +
          ('speechSynthesis' in window ? '<button class="na-btn" type="button" data-act="shout">🔊 SHOUT IT AT ME</button>' : '') +
          '<button class="na-btn na-ghost" type="button" data-act="reset">I have not actually seen these (reset)</button>' +
        '</div>' +
      '</div>';

    root.addEventListener('click', function (e) {
      var link = e.target.closest('.na-item');
      if (link) { markSeen(link.getAttribute('data-id')); return; }
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      if (btn.getAttribute('data-act') === 'shout') shoutAtHim();
      if (btn.getAttribute('data-act') === 'reset') {
        try { localStorage.removeItem(SEEN_KEY); } catch (err) {}
        renderGateway(root);
      }
    });

    if (!reduceMotion) startFireworks(root.querySelector('canvas'));
  }

  function shoutAtHim() {
    var n = unseenCount();
    var line = 'BROCCOLI. BROCCOLI. ' + (n > 0
      ? 'THERE ARE ' + n + ' NEW THINGS ON THE WEBSITE. LOOK AT THEM. LOOK AT THEM NOW.'
      : 'YOU HAVE SEEN EVERYTHING. THE WORM IS PROUD OF YOU.');
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(line);
      u.rate = 1.05;
      u.pitch = 1.35;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function startFireworks(canvas) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var colors = ['#ff004c', '#ff9a00', '#ffe600', '#2bd96b', '#1fb6ff', '#9b5cff', '#ffffff'];
    var lastBurst = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width));
      canvas.height = Math.max(1, Math.round(r.height));
    }
    resize();
    window.addEventListener('resize', resize);

    function burst() {
      var x = canvas.width * (0.08 + Math.random() * 0.84);
      var y = canvas.height * (0.15 + Math.random() * 0.5);
      var color = colors[Math.floor(Math.random() * colors.length)];
      var count = 36 + Math.floor(Math.random() * 20);
      for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count;
        var speed = 1.4 + Math.random() * 2.6;
        particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 1, decay: 0.012 + Math.random() * 0.012, color: color });
      }
    }

    function frame(t) {
      if (!document.hidden) {
        if (t - lastBurst > 650) { burst(); lastBurst = t; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.vy += 0.035;
          p.vx *= 0.985;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 3, 3);
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderFloatingNag() {
    var n = unseenCount();
    var a = document.createElement('a');
    a.href = 'index.html#new';
    a.className = 'na-float' + (n === 0 ? ' na-calm' : '');
    a.textContent = n > 0
      ? '🚨 BROCCOLI! ' + n + ' NEW THING' + (n === 1 ? '' : 'S') + ' YOU HAVEN’T SEEN 🚨'
      : '🎆 New Additions';
    document.body.appendChild(a);
  }

  function init() {
    var root = document.getElementById('new');
    if (root) renderGateway(root);
    else renderFloatingNag();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
