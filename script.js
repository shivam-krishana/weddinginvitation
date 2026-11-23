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

// Opening seal: guests tap to open. Skipped on refresh within a session, or with ?intro=0
(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("intro") === "0" || sessionStorage.getItem("opened-shivali")) return;

  const el = document.createElement("button");
  el.type = "button";
  el.className = "intro";
  el.setAttribute("aria-label", "Open the invitation");

  const eyebrow = document.createElement("p");
  eyebrow.className = "intro-eyebrow";
  eyebrow.textContent = "You are invited";

  const seal = document.createElement("div");
  seal.className = "seal";
  seal.textContent = "S & A";

  el.append(eyebrow, seal);

  const tap = document.createElement("p");
  tap.className = "intro-tap";
  tap.textContent = "Tap to open";
  el.append(tap);

  document.body.classList.add("locked");
  document.body.append(el);

  el.addEventListener("click", () => {
    sessionStorage.setItem("opened-shivali", "1");
    el.classList.add("open");
    document.body.classList.remove("locked");
    setTimeout(() => el.remove(), 1100);
  });
  el.focus();
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
