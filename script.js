// What the cover countdown runs down to, in India Standard Time (UTC+05:30).
// TODO: confirm the start time; only the date is final.
const WEDDING_START = "2027-01-23T19:00+05:30";

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

// Personalised greeting from the link: ?to=Amarjeet Singh&city=Delhi&sub=W/F
// Values are written with textContent, so nothing in the URL can inject markup.
const params = new URLSearchParams(location.search);
// Capitalise the first letter of each word; the rest is left exactly as typed (so "MM Qaji" stays intact)
const cap = (t) => t.replace(/(^|\s)(\p{L})/gu, (_, sp, ch) => sp + ch.toUpperCase());
const to = cap((params.get("to") || "").trim().slice(0, 60));
const city = cap((params.get("city") || "").trim().slice(0, 40));
// Second line under the name; "W/F" (or nothing) means "With Family"
const rawSub = (params.get("sub") || "").trim().slice(0, 40);
const sub = !rawSub || rawSub.toUpperCase() === "W/F" ? "With Family" : rawSub;
if (to) document.title = `${to} · Shivali weds Aastik`;

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

  if (to) {
    const forLine = document.createElement("p");
    forLine.className = "intro-for";
    forLine.textContent = "To - " + (city ? `${to}, ${city}` : to);
    const subLine = document.createElement("p");
    subLine.className = "intro-sub";
    subLine.textContent = sub;
    el.append(forLine, subLine);
  }

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
