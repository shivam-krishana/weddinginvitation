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
  if (hero) fill(hero, 10);
  if (baraat) fill(baraat, 7);
})();

// Band ornaments. Each band gets at most one, and some get none on purpose —
// a page that moves everywhere reads as busy rather than alive.
(() => {
  const svgNS = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };
  // pathLength normalises every shape to 1 unit, so one dash rule draws them all
  const stroke = (node) => {
    node.setAttribute("pathLength", "1");
    node.setAttribute("class", "draw");
    return node;
  };

  // Rangoli that draws itself once the band arrives
  const rangoli = document.getElementById("rangoli");
  if (rangoli) {
    // Concentric rings of detached petals. Nothing runs to the centre, so it
    // reads as a rangoli rather than a web of spokes.
    const svg = el("svg", { viewBox: "0 0 400 400" });
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 192 })));
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 183 })));
    for (let i = 0; i < 16; i += 1) {
      svg.append(stroke(el("path", {
        d: "M200 12 C211 32 211 46 200 58 C189 46 189 32 200 12 Z",
        transform: `rotate(${i * 22.5} 200 200)`,
      })));
    }
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 134 })));
    for (let i = 0; i < 8; i += 1) {
      svg.append(stroke(el("path", {
        d: "M200 74 C224 106 224 132 200 156 C176 132 176 106 200 74 Z",
        transform: `rotate(${i * 45} 200 200)`,
      })));
    }
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 30 })));
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 19 })));
    rangoli.append(svg);
  }

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
  if (hero) fill(hero, 10);
  if (baraat) fill(baraat, 7);
})();

// Band ornaments. Each band gets at most one, and some get none on purpose —
// a page that moves everywhere reads as busy rather than alive.
(() => {
  const svgNS = "http://www.w3.org/2000/svg";
  const el = (name, attrs) => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };
  // pathLength normalises every shape to 1 unit, so one dash rule draws them all
  const stroke = (node) => {
    node.setAttribute("pathLength", "1");
    node.setAttribute("class", "draw");
    return node;
  };

  // Rangoli that draws itself once the band arrives
  const rangoli = document.getElementById("rangoli");
  if (rangoli) {
    // Concentric rings of detached petals. Nothing runs to the centre, so it
    // reads as a rangoli rather than a web of spokes.
    const svg = el("svg", { viewBox: "0 0 400 400" });
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 192 })));
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 183 })));
    for (let i = 0; i < 16; i += 1) {
      svg.append(stroke(el("path", {
        d: "M200 12 C211 32 211 46 200 58 C189 46 189 32 200 12 Z",
        transform: `rotate(${i * 22.5} 200 200)`,
      })));
    }
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 134 })));
    for (let i = 0; i < 8; i += 1) {
      svg.append(stroke(el("path", {
        d: "M200 74 C224 106 224 132 200 156 C176 132 176 106 200 74 Z",
        transform: `rotate(${i * 45} 200 200)`,
      })));
    }
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 30 })));
    svg.append(stroke(el("circle", { cx: 200, cy: 200, r: 19 })));
    rangoli.append(svg);
  }

  // Paisley vines growing in from both margins
  const vines = document.getElementById("vines");
  if (vines) {
    const vine = "M60 0 C14 70 96 120 42 192 C8 236 72 268 40 330" +
      " M42 46 C70 54 78 76 58 92 M50 150 C22 160 18 186 44 196" +
      " M46 250 C76 258 82 280 60 296";
    ["vine--l", "vine--r"].forEach((side) => {
      const svg = el("svg", { viewBox: "0 0 110 340", class: "vine " + side });
      svg.append(stroke(el("path", { d: vine })));
      vines.append(svg);
    });
  }

  if (reducedMotion) return;

  // Marigold petals drifting down over the lunch band
  const petals = document.getElementById("petals");
  if (petals) {
    for (let i = 0; i < 14; i += 1) {
      const petal = document.createElement("i");
      const size = 7 + Math.random() * 7;
      petal.style.left = (Math.random() * 98).toFixed(2) + "%";
      petal.style.width = size.toFixed(1) + "px";
      petal.style.height = (size * 0.66).toFixed(1) + "px";
      petal.style.animationDuration = (9 + Math.random() * 8).toFixed(1) + "s, " +
        (2.5 + Math.random() * 2.5).toFixed(1) + "s";
      petal.style.animationDelay = (-Math.random() * 16).toFixed(1) + "s, " +
        (-Math.random() * 4).toFixed(1) + "s";
      petals.append(petal);
    }
  }

  // Fireworks over the baraat. Each burst is one element whose box-shadow
  // carries every spark, so a burst costs a single composited layer.
  const fireworks = document.getElementById("fireworks");
  if (fireworks) {
    const colours = ["#ffd98a", "#ffb3c6", "#fff1cd", "#ffc46b"];
    for (let i = 0; i < 9; i += 1) {
      const burst = document.createElement("i");
      const colour = colours[i % colours.length];
      const sparks = [];
      for (let k = 0; k < 28; k += 1) {
        const angle = (k / 28) * Math.PI * 2 + Math.random() * 0.2;
        const reach = 34 + Math.random() * 46;
        sparks.push(
          `${(Math.cos(angle) * reach).toFixed(1)}px ${(Math.sin(angle) * reach).toFixed(1)}px 0 ${colour}`
        );
      }
      burst.style.boxShadow = sparks.join(",");
      // Kept to the sky on either side of the painting rather than over it
      const side = i % 2 === 0 ? 4 + Math.random() * 16 : 80 + Math.random() * 16;
      burst.style.left = side.toFixed(1) + "%";
      burst.style.top = (10 + Math.random() * 44).toFixed(1) + "%";
      burst.style.animationDelay = (i * 0.52 + Math.random() * 0.4).toFixed(2) + "s";
      fireworks.append(burst);
    }
  }

  // Embers lifting off the footer diya
  const embers = document.getElementById("embers");
  if (embers) {
    for (let i = 0; i < 16; i += 1) {
      const ember = document.createElement("i");
      ember.style.left = (42 + Math.random() * 16).toFixed(2) + "%";
      ember.style.animationDuration = (4.5 + Math.random() * 4).toFixed(1) + "s, " +
        (1.6 + Math.random() * 1.6).toFixed(1) + "s";
      ember.style.animationDelay = (-Math.random() * 8).toFixed(1) + "s, " +
        (-Math.random() * 3).toFixed(1) + "s";
      embers.append(ember);
    }
  }
})();

// Scroll intro. Skipped with ?intro=0, otherwise shown once per session.
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("intro") === "0" || sessionStorage.getItem("opened-shivali")) return;

  const grounds = { plum: "intro--plum", maroon: "intro--maroon", night: "intro--night" };
  const bg = params.get("bg");
  const groundClass = Object.prototype.hasOwnProperty.call(grounds, bg) ? grounds[bg] : "";

  const el = document.createElement("button");
  el.type = "button";
  el.className = "intro" + (groundClass ? " " + groundClass : "");
  el.setAttribute("aria-label", "Open the invitation");

  const niche = document.createElement("div");
  niche.className = "intro-niche";
  niche.setAttribute("aria-hidden", "true");
  niche.innerHTML =
    '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet">' +
      '<path d="M0 400 V160 C0 88 42 46 90 26 C126 13 141 6 150 0' +
        ' C159 6 174 13 210 26 C258 46 300 88 300 160 V400"/>' +
      '<path d="M14 400 V162 C14 96 54 58 98 39 C131 26 144 18 150 12' +
        ' C156 18 169 26 202 39 C246 58 286 96 286 162 V400"/>' +
    '</svg>';

  const scroll = document.createElement("div");
  scroll.className = "intro-scroll";
  scroll.innerHTML =
    '<div class="scroll-sheet" aria-hidden="true">' +
      '<div class="scroll-sheet-inner">' +
        '<p class="scroll-eyebrow">You are invited</p>' +
        '<p class="scroll-shubh" lang="hi">॥ शुभ विवाह ॥</p>' +
        '<p class="scroll-names">Shivali <span>&amp;</span> Aastik</p>' +
        '<svg class="scroll-rule" viewBox="0 0 160 14" aria-hidden="true" focusable="false">' +
          '<path d="M0 7 H58 M102 7 H160"/>' +
          '<path d="M80 1 C87 5 88 8 80 13 C72 8 73 5 80 1 Z"/>' +
          '<path d="M66 7 C71 3 76 4 79 7 M94 7 C89 3 84 4 81 7"/>' +
        '</svg>' +
        '<p class="scroll-date">23 January 2027</p>' +
      '</div>' +
    '</div>' +
    '<div class="scroll-rod scroll-rod--top" aria-hidden="true"></div>' +
    '<div class="scroll-rod scroll-rod--bot" aria-hidden="true"></div>' +
    '<div class="scroll-cord" aria-hidden="true">' +
      '<svg viewBox="0 0 26 120" preserveAspectRatio="xMidYMin meet">' +
        '<path class="thread" d="M13 0 C19 16 7 30 13 46 C17 58 11 66 13 76"/>' +
        '<rect class="band" x="7" y="76" width="12" height="7" rx="2"/>' +
        '<path class="tassel" d="M8 83 H18 L20 104 C20 110 6 110 6 104 Z"/>' +
        '<path class="thread" d="M9 104 V116 M13 106 V118 M17 104 V116"/>' +
      '</svg>' +
    '</div>';

  const hint = document.createElement("p");
  hint.className = "intro-hint";
  hint.innerHTML = "<span>Tap to open</span>";

  el.append(niche, scroll, hint);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.body.classList.add("locked");
  document.body.append(el);

  let opening = false;
  const open = () => {
    if (opening) return;
    opening = true;
    sessionStorage.setItem("opened-shivali", "1");
    scroll.classList.add("open");
    el.classList.add("opening");
    // The sheet finishes unrolling at about 1.5s; hold it long enough to read.
    window.setTimeout(() => {
      el.classList.add("done");
      document.body.classList.remove("locked");
      window.setTimeout(() => el.remove(), 700);
    }, 3100);
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
