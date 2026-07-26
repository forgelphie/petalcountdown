(function () {
  "use strict";

  var RELEASE = new Date("2026-07-31T04:00:00Z");
  var TOTAL_PETALS = 12;
  var WINDOW_MS = TOTAL_PETALS * 24 * 60 * 60 * 1000; 
  var START = new Date(RELEASE.getTime() - WINDOW_MS);

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var els = {
    d: document.getElementById("cd-d"),
    h: document.getElementById("cd-h"),
    m: document.getElementById("cd-m"),
    s: document.getElementById("cd-s"),
    note: document.getElementById("cdNote"),
    countdown: document.getElementById("countdown"),
    cta: document.getElementById("ctaBtn"),
    daisyWrap: document.getElementById("daisyWrap")
  };

  var petals = Array.prototype.slice.call(document.querySelectorAll(".petal"));
  var fallenCount = -1; 
  var released = false;

  function pad(n) { return String(n).padStart(2, "0"); }

  function applyPetals(count, animate) {
    petals.forEach(function (p) {
      var i = Number(p.getAttribute("data-i"));
      var shouldFall = i < count;
      var isFallen = p.classList.contains("fallen");
      if (shouldFall && !isFallen) {
        if (animate) {
          p.classList.add("fallen");
        } else {
          p.style.transition = "none";
          p.classList.add("fallen");
          p.style.transform = "rotate(150deg) translateY(150px)";
          p.style.opacity = "0";
          void p.getBoundingClientRect();
          p.style.transition = "";
          p.style.transform = "";
        }
      }
    });
  }

  function tick() {
    var now = new Date();
    var msLeft = RELEASE - now;

    if (msLeft <= 0) {
      if (!released) {
        released = true;
        els.countdown.classList.add("is-released");
        els.cta.innerHTML = 'listen to petal <span class="arrow" aria-hidden="true">→</span>';
        applyPetals(TOTAL_PETALS, !reduceMotion);
      }
      els.d.textContent = "00";
      els.h.textContent = "00";
      els.m.textContent = "00";
      els.s.textContent = "00";
      return;
    }

    var totalSeconds = Math.floor(msLeft / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    els.d.textContent = pad(days);
    els.h.textContent = pad(hours);
    els.m.textContent = pad(minutes);
    els.s.textContent = pad(seconds);

    var elapsed = now - START;
    var frac = Math.min(1, Math.max(0, elapsed / WINDOW_MS));
    var count = Math.floor(frac * TOTAL_PETALS);

    if (count !== fallenCount) {
      var animate = fallenCount !== -1 && !reduceMotion; 
      applyPetals(count, animate);
      fallenCount = count;
    }
  }

  tick();
  setInterval(tick, 1000);

  if (!reduceMotion && els.daisyWrap) {
    for (var k = 0; k < 5; k++) {
      var lp = document.createElement("span");
      lp.className = "loose-petal";
      lp.style.left = (10 + Math.random() * 80) + "%";
      lp.style.top = (10 + Math.random() * 20) + "%";
      lp.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      lp.style.animationDelay = (Math.random() * 9) + "s";
      lp.style.animationDuration = (7 + Math.random() * 5) + "s";
      els.daisyWrap.appendChild(lp);
    }
  }
})();
