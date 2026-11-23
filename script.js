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

// Countdown to the wedding day
const target = new Date(WEDDING_START).getTime();
const box = document.getElementById("countdown");
const countdownLabel = document.querySelector(".countdown-label");
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) {
    box.innerHTML = '<div class="done">The celebrations have begun! 🎉</div>';
    if (countdownLabel) countdownLabel.hidden = true;
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  box.innerHTML = [["Days", d], ["Hours", h], ["Mins", m], ["Secs", s]]
    .map(([l, v]) => `<div><b>${v}</b>${l}</div>`).join("");
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

  const hearts = document.createElement("div");
  hearts.className = "hearts";
  hearts.setAttribute("aria-hidden", "true");
  hearts.innerHTML = '<div class="heart a1"></div><div class="heart a2"></div><div class="heart a3"></div>';

  envelope.append(flap, pocket, letter, hearts);
  wrapper.append(envelope);

  const hint = document.createElement("p");
  hint.className = "intro-hint";
  hint.textContent = "Tap to open";

  el.append(wrapper, hint);
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
