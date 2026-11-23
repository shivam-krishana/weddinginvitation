// What the cover countdown runs down to, in India Standard Time (UTC+05:30)
const WEDDING_START = "2027-01-23T20:00+05:30";

// Map links
document.querySelectorAll("[data-map]").forEach((a) => {
  a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(a.dataset.map);
});

// WhatsApp RSVP
document.querySelectorAll("[data-wa]").forEach((a) => {
  const msg = "Hello! Regarding the wedding invitation of Shivali & Aastik — ";
  a.href = `https://wa.me/${a.dataset.wa}?text=${encodeURIComponent(msg)}`;
  a.target = "_blank";
  a.rel = "noopener";
});

// Countdown to the wedding day. Built once, then only the digits change, so the
// seconds can animate without the whole block flashing.
const target = new Date(WEDDING_START).getTime();
const box = document.getElementById("countdown");
const countdownLabel = document.querySelector(".countdown-label");
const UNITS = ["Days", "Hours", "Mins", "Secs"];
const cells = UNITS.map((label) => {
  const cell = document.createElement("div");
  const value = document.createElement("b");
  cell.append(value, document.createTextNode(label));
  box.append(cell);
  return { cell, value };
});

function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    box.textContent = "";
    const done = document.createElement("div");
    done.className = "done";
    done.textContent = "The celebrations have begun! 🎉";
    box.append(done);
    if (countdownLabel) countdownLabel.hidden = true;
    return;
  }
  const parts = [
    Math.floor(diff / 864e5),
    Math.floor((diff % 864e5) / 36e5),
    Math.floor((diff % 36e5) / 6e4),
    Math.floor((diff % 6e4) / 1e3),
  ];
  parts.forEach((n, i) => {
    const { cell, value } = cells[i];
    if (value.textContent === String(n)) return;
    value.textContent = n;
    cell.classList.remove("pulse");
    void cell.offsetWidth; // restart the animation
    cell.classList.add("pulse");
  });
}
tick();
setInterval(tick, 1000);

// Envelope open animation (inspired by Josh Nichols / CodePen). Skipped with ?intro=0.
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("intro") === "0" || sessionStorage.getItem("opened-shivali")) return;

  const el = document.createElement("button");
  el.type = "button";
  el.className = "intro";
  el.setAttribute("aria-label", "Open the invitation");

  const wrapper = document.createElement("div");
  wrapper.className = "envlope-wrapper";

  const envelope = document.createElement("div");
  envelope.id = "envelope";
  envelope.className = "close";

  const flap = document.createElement("div");
  flap.className = "front flap";

  const pocket = document.createElement("div");
  pocket.className = "front pocket";

  const letter = document.createElement("div");
  letter.className = "letter";
  letter.innerHTML =
    '<p class="letter-eyebrow">You are invited</p>' +
    '<p class="letter-shubh" lang="hi">॥ शुभ विवाह ॥</p>' +
    '<p class="letter-names">Shivali <span>&amp;</span> Aastik</p>' +
    '<p class="letter-date">23 January 2027</p>';

  const wax = document.createElement("div");
  wax.className = "wax";
  wax.setAttribute("aria-hidden", "true");
  wax.textContent = "S&A";

  const hearts = document.createElement("div");
  hearts.className = "hearts";
  hearts.setAttribute("aria-hidden", "true");
  hearts.innerHTML =
    '<div class="heart a1"></div>' +
    '<div class="heart a2 gold"></div>' +
    '<div class="heart a3"></div>' +
    '<div class="heart a4 gold"></div>' +
    '<div class="heart a5"></div>' +
    '<div class="heart a6 gold"></div>';

  envelope.append(flap, pocket, letter, hearts, wax);
  wrapper.append(envelope);

  const hint = document.createElement("p");
  hint.className = "intro-hint";
  hint.textContent = "Tap to open";

  const blooms = ["bloom--tl", "bloom--br"].map((where) => {
    const img = document.createElement("img");
    img.className = "bloom " + where;
    img.src = "floral-corner.jpg";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  });

  el.append(...blooms, wrapper, hint);
  document.body.classList.add("locked");
  document.body.append(el);

  let opening = false;
  const open = () => {
    if (opening) return;
    opening = true;
    sessionStorage.setItem("opened-shivali", "1");
    envelope.classList.remove("close");
    envelope.classList.add("open");
    hint.textContent = "";
    window.setTimeout(() => {
      el.classList.add("done");
      document.body.classList.remove("locked");
      window.setTimeout(() => el.remove(), 550);
    }, 3200);
  };

  el.addEventListener("click", open);
  el.focus();
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Drifting petals
(() => {
  const layer = document.getElementById("petals");
  if (!layer || reducedMotion) return;

  const tints = ["", "gold", "pale"];
  for (let i = 0; i < 13; i += 1) {
    const petal = document.createElement("div");
    petal.className = ("petal " + tints[i % tints.length]).trim();
    const size = 9 + Math.random() * 11;
    petal.style.left = (Math.random() * 100).toFixed(2) + "%";
    petal.style.width = size.toFixed(1) + "px";
    petal.style.height = size.toFixed(1) + "px";
    petal.style.animationDuration = (12 + Math.random() * 12).toFixed(1) + "s, " +
      (3 + Math.random() * 3).toFixed(1) + "s";
    petal.style.animationDelay = (-Math.random() * 22).toFixed(1) + "s, " +
      (-Math.random() * 4).toFixed(1) + "s";
    layer.append(petal);
  }
})();

// Scroll-linked motion: progress bar, cover parallax, timeline fill
(() => {
  const bar = document.getElementById("progressBar");
  const coverInner = document.getElementById("coverInner");
  const mandala = document.getElementById("mandala");
  const timeline = document.querySelector(".timeline");
  const fill = document.getElementById("timelineFill");
  const title = document.querySelector(".section-title");

  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    // Reading progress across the whole document
    if (bar) {
      const scrollable = document.documentElement.scrollHeight - vh;
      const pct = scrollable > 0 ? Math.min(1, y / scrollable) : 0;
      bar.style.transform = `scaleX(${pct})`;
    }

    // The cover drifts up and dissolves as the first section takes over
    if (coverInner && !reducedMotion) {
      const p = Math.min(1, y / vh);
      coverInner.style.transform = `translate3d(0, ${(-p * 70).toFixed(1)}px, 0) scale(${(1 - p * 0.05).toFixed(4)})`;
      coverInner.style.opacity = String(Math.max(0, 1 - p * 1.25));
      if (mandala) mandala.style.opacity = String(Math.max(0, 0.16 - p * 0.16));
    }

    // Gold line fills as you travel down the celebrations
    if (timeline && fill) {
      const rect = timeline.getBoundingClientRect();
      const travelled = vh * 0.6 - rect.top;
      const pct = Math.max(0, Math.min(1, travelled / rect.height));
      fill.style.height = (pct * 100).toFixed(2) + "%";
    }

    // Nudge the sticky heading once it latches to the top
    if (title) {
      title.classList.toggle("stuck", title.getBoundingClientRect().top <= 1);
    }
  };

  const onScroll = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
