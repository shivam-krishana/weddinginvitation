// What the hero countdown runs down to, in India Standard Time (UTC+05:30)
const WEDDING_START = "2027-01-23T20:00+05:30";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

// Countdown. Built once, then only the digits change, so the seconds can
// animate without the whole block flashing.
const target = new Date(WEDDING_START).getTime();
const box = document.getElementById("countdown");
const countdownLabel = document.querySelector(".countdown-label");
const cells = ["Days", "Hours", "Mins", "Secs"].map((label) => {
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
    done.textContent = "The celebrations have begun";
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

// Sky lanterns drifting up through the night bands
(() => {
  if (reducedMotion) return;

  const fill = (layer, count) => {
    for (let i = 0; i < count; i += 1) {
      const lantern = document.createElement("img");
      lantern.className = "lantern";
      lantern.src = "lantern.png";
      lantern.alt = "";
      const scale = 0.55 + Math.random() * 0.85;
      lantern.style.left = (Math.random() * 96).toFixed(2) + "%";
      lantern.style.width = (46 * scale).toFixed(1) + "px";
      lantern.style.animationDuration = (16 + Math.random() * 16).toFixed(1) + "s, " +
        (4 + Math.random() * 4).toFixed(1) + "s";
      lantern.style.animationDelay = (-Math.random() * 30).toFixed(1) + "s, " +
        (-Math.random() * 5).toFixed(1) + "s";
      layer.append(lantern);
    }
  };

  const hero = document.getElementById("lanterns");
  const baraat = document.getElementById("lanterns2");
  if (hero) fill(hero, 14);
  if (baraat) fill(baraat, 7);
})();

// Envelope intro. Skipped with ?intro=0, otherwise shown once per session.
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

  const letter = document.createElement("div");
  letter.className = "letter";
  letter.innerHTML =
    '<p class="letter-eyebrow">You are invited</p>' +
    '<p class="letter-shubh" lang="hi">॥ शुभ विवाह ॥</p>' +
    '<p class="letter-names">Shivali <span>&amp;</span> Aastik</p>' +
    '<p class="letter-date">23 January 2027</p>';

  // A patterned liner sits behind everything, so the gaps between the flap's
  // curved edge and the pocket mouth show lining paper rather than the card.
  const liner = document.createElement("div");
  liner.className = "liner";
  liner.setAttribute("aria-hidden", "true");

  const pocket = document.createElement("div");
  pocket.className = "front pocket";
  pocket.innerHTML =
    '<svg viewBox="0 0 300 198" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="pocketPaper" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#f6e9ce"/>' +
          '<stop offset=".6" stop-color="#efdfbd"/>' +
          '<stop offset="1" stop-color="#e3d0a8"/>' +
        '</linearGradient>' +
        '<linearGradient id="pocketSheen" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".35"/>' +
          '<stop offset=".5" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset="1" stop-color="#fff" stop-opacity=".2"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M0 16 Q150 140 300 16 L300 198 L0 198 Z" fill="url(#pocketPaper)"/>' +
      '<path d="M0 16 Q150 140 300 16 L300 198 L0 198 Z" fill="url(#pocketSheen)"/>' +
      '<path class="foil" d="M0 16 Q150 140 300 16"/>' +
      '<path class="foil foil--thin" d="M11 31 Q150 147 289 31 L289 187 L11 187 Z"/>' +
      '<g class="foil" transform="translate(150 148)">' +
        '<path d="M0 -17 C11 -8 14 1 0 16 C-14 1 -11 -8 0 -17 Z"/>' +
        '<path class="foil--thin" d="M0 -9 C5 -4 6 0 0 7 C-6 0 -5 -4 0 -9 Z"/>' +
        '<path d="M-26 -3 C-16 -10 -7 -8 0 1"/>' +
        '<path d="M26 -3 C16 -10 7 -8 0 1"/>' +
        '<path class="foil--thin" d="M-38 7 H-62"/>' +
        '<path class="foil--thin" d="M38 7 H62"/>' +
      '</g>' +
    '</svg>';

  const flap = document.createElement("div");
  flap.className = "front flap";
  flap.innerHTML =
    '<svg viewBox="0 0 300 118" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="flapPaper" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#f9eed8"/>' +
          '<stop offset=".55" stop-color="#f2e3c3"/>' +
          '<stop offset="1" stop-color="#e8d5ac"/>' +
        '</linearGradient>' +
      '</defs>' +
      '<path class="paper" d="M0 0 H300 C282 46 224 84 150 118 C76 84 18 46 0 0 Z" fill="url(#flapPaper)"/>' +
      '<path class="foil" d="M0 0 C18 46 76 84 150 118 C224 84 282 46 300 0"/>' +
      '<path class="foil foil--thin" d="M12 2 C29 43 83 78 150 106 C217 78 271 43 288 2"/>' +
      '<g class="foil" transform="translate(150 78)">' +
        '<path d="M0 -12 C8 -6 10 1 0 11 C-10 1 -8 -6 0 -12 Z"/>' +
        '<path class="foil--thin" d="M-18 -2 C-11 -7 -5 -5 0 0"/>' +
        '<path class="foil--thin" d="M18 -2 C11 -7 5 -5 0 0"/>' +
      '</g>' +
    '</svg>';

  const wax = document.createElement("div");
  wax.className = "wax";
  wax.setAttribute("aria-hidden", "true");
  wax.textContent = "S&A";

  const hearts = document.createElement("div");
  hearts.className = "hearts";
  hearts.setAttribute("aria-hidden", "true");
  hearts.innerHTML =
    '<div class="heart a1"></div><div class="heart a2 gold"></div><div class="heart a3"></div>' +
    '<div class="heart a4 gold"></div><div class="heart a5"></div><div class="heart a6 gold"></div>';

  envelope.append(letter, liner, pocket, flap, hearts, wax);
  wrapper.append(envelope);

  const hint = document.createElement("p");
  hint.className = "intro-hint";
  hint.textContent = "Tap to open";

  el.append(wrapper, hint);
  // A reload can restore the old scroll position behind the locked overlay,
  // which would drop the reader halfway down the page once it closes.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
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
      window.setTimeout(() => el.remove(), 650);
    }, 3200);
  };

  el.addEventListener("click", open);
  el.focus();
})();

// Scroll reveal, staggered within each band
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const siblings = Array.from(en.target.parentElement.querySelectorAll(".reveal"));
    en.target.style.transitionDelay = Math.min(siblings.indexOf(en.target), 6) * 90 + "ms";
    en.target.classList.add("in");
    io.unobserve(en.target);
  });
}, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Scroll-linked motion: progress bar and hero parallax
(() => {
  const bar = document.getElementById("progressBar");
  const heroInner = document.getElementById("heroInner");
  const skyline = document.getElementById("skyline");

  let queued = false;

  const update = () => {
    queued = false;
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (bar) {
      const scrollable = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${scrollable > 0 ? Math.min(1, y / scrollable) : 0})`;
    }

    // The hero text lifts away faster than the skyline behind it
    if (!reducedMotion && y < vh * 1.2) {
      const p = Math.min(1, y / vh);
      if (heroInner) {
        heroInner.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0)`;
        heroInner.style.opacity = String(Math.max(0, 1 - p * 1.3));
      }
      if (skyline) {
        skyline.style.transform = `translate3d(-50%, ${(p * 40).toFixed(1)}px, 0) scale(${(1 + p * 0.06).toFixed(4)})`;
      }
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
