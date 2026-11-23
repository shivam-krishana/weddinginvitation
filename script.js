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
    '<svg class="letter-rule" viewBox="0 0 160 14" aria-hidden="true" focusable="false">' +
      '<path d="M0 7 H58 M102 7 H160"/>' +
      '<path d="M80 1 C87 5 88 8 80 13 C72 8 73 5 80 1 Z"/>' +
      '<path d="M66 7 C71 3 76 4 79 7 M94 7 C89 3 84 4 81 7"/>' +
    '</svg>' +
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
        // A block-printed buti laid over the paper, as on the bands inside
        '<pattern id="buti" width="24" height="24" patternUnits="userSpaceOnUse">' +
          '<path d="M12 4 C16 9 16 13 12 18 C8 13 8 9 12 4 Z" fill="none" ' +
            'stroke="#a9801f" stroke-opacity=".22" stroke-width="1"/>' +
          '<circle cx="12" cy="21" r="1" fill="#a9801f" fill-opacity=".2"/>' +
          '<path d="M3 12 H7 M17 12 H21" stroke="#a9801f" stroke-opacity=".14" stroke-width="1"/>' +
        '</pattern>' +
        '<clipPath id="pocketClip">' +
          '<path d="M0 16 Q150 140 300 16 L300 198 L0 198 Z"/>' +
        '</clipPath>' +
      '</defs>' +
      '<path d="M0 16 Q150 140 300 16 L300 198 L0 198 Z" fill="url(#pocketPaper)"/>' +
      '<rect width="300" height="198" fill="url(#buti)" clip-path="url(#pocketClip)"/>' +
      '<path d="M0 16 Q150 140 300 16 L300 198 L0 198 Z" fill="url(#pocketSheen)"/>' +
      '<path class="foil" d="M0 16 Q150 140 300 16"/>' +
      '<path class="foil foil--thin" d="M11 31 Q150 147 289 31 L289 187 L11 187 Z"/>' +
      '<path class="foil foil--thin" d="M17 37 Q150 139 283 37 L283 181 L17 181 Z"/>' +
      '<g class="foil" transform="translate(150 150)">' +
        '<path d="M0 -19 C12 -9 15 1 0 17 C-15 1 -12 -9 0 -19 Z"/>' +
        '<path class="foil--thin" d="M0 -10 C6 -4 7 0 0 8 C-7 0 -6 -4 0 -10 Z"/>' +
        '<path d="M-28 -3 C-17 -11 -7 -9 0 1"/>' +
        '<path d="M28 -3 C17 -11 7 -9 0 1"/>' +
        '<path class="foil--thin" d="M-40 6 H-74"/>' +
        '<path class="foil--thin" d="M40 6 H74"/>' +
        '<circle class="foil--thin" cx="-80" cy="6" r="2"/>' +
        '<circle class="foil--thin" cx="80" cy="6" r="2"/>' +
      '</g>' +
    '</svg>';

  // The flap is a real two-sided sheet: cream outside, lining paper inside.
  // Giving it a back face means the fold never has to repaint a fill
  // part-way through the rotation, which is what made it stutter.
  const flapShape = "M0 0 H300 C282 46 224 84 150 118 C76 84 18 46 0 0 Z";
  const flap = document.createElement("div");
  flap.className = "front flap";
  flap.innerHTML =
    '<div class="flap-face">' +
      '<svg viewBox="0 0 300 118" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<linearGradient id="flapPaper" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#f9eed8"/>' +
            '<stop offset=".55" stop-color="#f2e3c3"/>' +
            '<stop offset="1" stop-color="#e8d5ac"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<clipPath id="flapClip"><path d="' + flapShape + '"/></clipPath>' +
        '<path d="' + flapShape + '" fill="url(#flapPaper)"/>' +
        '<rect width="300" height="118" fill="url(#buti)" clip-path="url(#flapClip)"/>' +
        '<path class="foil" d="M0 0 C18 46 76 84 150 118 C224 84 282 46 300 0"/>' +
        '<path class="foil foil--thin" d="M12 2 C29 43 83 78 150 106 C217 78 271 43 288 2"/>' +
        '<path class="foil foil--thin" d="M20 2 C36 40 88 73 150 99 C212 73 264 40 280 2"/>' +
        '<g class="foil" transform="translate(150 74)">' +
          '<path d="M0 -13 C9 -6 11 1 0 12 C-11 1 -9 -6 0 -13 Z"/>' +
          '<path class="foil--thin" d="M-20 -3 C-12 -8 -6 -6 0 0"/>' +
          '<path class="foil--thin" d="M20 -3 C12 -8 6 -6 0 0"/>' +
          '<path class="foil--thin" d="M-30 -9 H-52 M30 -9 H52"/>' +
        '</g>' +
      '</svg>' +
    '</div>' +
    '<div class="flap-face flap-face--back">' +
      '<svg viewBox="0 0 300 118" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
        '<path d="' + flapShape + '" fill="#8d2340"/>' +
        '<path d="' + flapShape + '" fill="url(#pocketSheen)" opacity=".5"/>' +
      '</svg>' +
    '</div>';

  const wax = document.createElement("div");
  wax.className = "wax";
  wax.setAttribute("aria-hidden", "true");
  wax.textContent = "S&A";

  envelope.append(letter, liner, pocket, flap, wax);
  wrapper.append(envelope);

  const hint = document.createElement("p");
  hint.className = "intro-hint";
  hint.innerHTML = "<span>Tap to open</span>";

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
    el.classList.add("opening");
    hint.innerHTML = "";
    // The card settles at about 1.6s; hold it long enough to read, then go.
    window.setTimeout(() => {
      el.classList.add("done");
      document.body.classList.remove("locked");
      window.setTimeout(() => el.remove(), 700);
    }, 2900);
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
