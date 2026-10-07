/* ==========================================================================
   app.js — rendering + interactions. Reads everything from data.js.
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Icons (inline, stroke-based) ---------- */
const ICONS = {
  nfc: '<path d="M6 8a6 6 0 0 1 0 8M10 5.5a10 10 0 0 1 0 13M14 3a14 14 0 0 1 0 18"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  "user-plus": '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 11-4.5M18 9v6M15 12h6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  whatsapp: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.2 18.8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a3.5 3.5 0 0 1-1.8-1.8l.8-1-1-2z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  facebook: '<path d="M14 8h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V10H8v3h2.5v6h3v-6H16l.5-3h-3V8.5c0-.3.2-.5.5-.5z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>',
  linkedin: '<path d="M7 10v7M7 7v.01M11 17v-7M11 13a3 3 0 0 1 6 0v4"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4M4 5v3h3M4 13a8 8 0 0 0 14 4M20 19v-3h-3"/>',
  device: '<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M11 18h2"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>'
};
const icon = (n) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

/* ---------- Helpers ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const get = (o, path) => path.split(".").reduce((a, k) => a?.[k], o);
const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
const digits = (p) => String(p).replace(/[^\d+]/g, "");
const host = (u) => String(u).replace(/^https?:\/\//, "").replace(/\/$/, "");

/* ---------- Data loading (swap for fetch later) ---------- */
async function loadProfile() {
  return profileData;
  // return fetch("/api/profile/123").then((r) => r.json());
}

/* ---------- Profile renderer ---------- */
const SECTIONS = {
  about: (d) => section("About", `<p>${esc(d.about)}</p>`),
  contact: (d) => {
    const c = d.contact;
    const rows = [
      ["phone", "Phone", c.phone, `tel:${digits(c.phone)}`],
      ["mail", "Email", c.email, `mailto:${c.email}`],
      ["pin", "Location", c.location, null],
      ["globe", "Website", host(c.website), c.website]
    ];
    return section("Contact", `<ul class="pf-rows">${rows.map(([i, l, v, h]) => {
      const tag = h ? `a href="${esc(h)}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}` : "div";
      return `<li><${tag}>${icon(i)}<span><small>${l}</small>${esc(v)}</span></${h ? "a" : "div"}></li>`;
    }).join("")}</ul>`);
  },
  services: (d) => section(d.servicesLabel || "Services", `<div class="pf-chips">${d.services.map((s) => `<span>${esc(s)}</span>`).join("")}</div>`),
  gallery: (d) => section(d.galleryLabel || "Highlights", `<div class="pf-gallery">${d.gallery.map((g) => `<img src="${esc(g)}" alt="" loading="lazy">`).join("")}</div>`)
};
const section = (title, body) =>
  `<details class="pf-sec" open><summary>${esc(title)}${icon("chevron")}</summary><div class="pf-body">${body}</div></details>`;

function renderProfile(d, el) {
  const c = d.contact;
  const quick = [
    ["phone", "Call", `tel:${digits(c.phone)}`],
    ["mail", "Email", `mailto:${c.email}`],
    ["whatsapp", "WhatsApp", `https://wa.me/${digits(c.whatsapp || c.phone)}`],
    ["globe", "Website", c.website]
  ];
  const socials = Object.entries(d.social).filter(([k]) => ICONS[k]);

  el.innerHTML = `<article class="pf" style="${d.accent ? `--accent:${esc(d.accent)}` : ""}">
    <div class="pf-cover"></div>
    <header class="pf-head">
      <div class="pf-avatar"><img src="${esc(d.avatar)}" alt="${esc(d.name)}"></div>
      <h3>${esc(d.name)}</h3>
      <p class="pf-role">${esc(d.title)}</p>
      <p class="pf-co">${esc(d.company)}</p>
      <p class="pf-bio">${esc(d.bio)}</p>
    </header>
    <div class="pf-actions">
      <button type="button" class="pf-save" data-act="save">${icon("user-plus")}<span>Save contact</span></button>
      <div class="pf-quick">${quick.map(([i, l, h]) => `<a href="${esc(h)}"${h.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${icon(i)}<span>${l}</span></a>`).join("")}</div>
    </div>
    <div class="pf-social">${socials.map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${k}">${icon(k)}</a>`).join("")}</div>
    ${(d.sections || Object.keys(SECTIONS)).map((s) => SECTIONS[s]?.(d) || "").join("")}
  </article>`;

  // Fallback to initials if the internet avatar fails to load
  const img = $(".pf-avatar img", el);
  img.addEventListener("error", () => { img.parentElement.textContent = initials(d.name); });

  $('[data-act="save"]', el).addEventListener("click", (e) => saveContact(d, e.currentTarget, el.parentElement));
}

/* ---------- Save contact (vCard download + success state) ---------- */
function saveContact(d, btn, phone) {
  const c = d.contact;
  const vcf = ["BEGIN:VCARD", "VERSION:3.0", `FN:${d.name}`, `ORG:${d.company}`, `TITLE:${d.title}`,
    `TEL:${c.phone}`, `EMAIL:${c.email}`, `URL:${c.website}`, "END:VCARD"].join("\r\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([vcf], { type: "text/vcard" })),
    download: `${d.name.replace(/\s+/g, "-").toLowerCase()}.vcf`
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);

  btn.classList.add("done");
  btn.querySelector("span").textContent = "Contact saved";
  btn.querySelector("svg").outerHTML = icon("check");
  toast(phone, `${d.name} added to contacts`);
  setTimeout(() => {
    btn.classList.remove("done");
    btn.querySelector("span").textContent = "Save contact";
    btn.querySelector("svg").outerHTML = icon("user-plus");
  }, 2600);
}

function toast(phone, msg) {
  $(".toast", phone)?.remove();
  const t = Object.assign(document.createElement("div"), { className: "toast", textContent: msg });
  phone.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 2200);
}

/* ---------- Generic data binding for page elements ---------- */
function bindPage(root) {
  $$("[data-bind]").forEach((el) => (el.textContent = get(root, el.dataset.bind) ?? ""));
  $$("[data-bind-src]").forEach((el) => (el.src = get(root, el.dataset.bindSrc) ?? ""));
  $$("[data-bind-href]").forEach((el) => (el.href = get(root, el.dataset.bindHref) ?? "#"));
}

/* ---------- Customization tabs ---------- */
function setupVariants() {
  const tabs = $("#tabs"), info = $("#variant-info"), target = $('[data-profile="variant"]');
  const keys = Object.keys(profileVariants);
  const names = { about: "About", contact: "Contact", services: "Services", gallery: "Gallery" };

  const show = (key) => {
    const v = profileVariants[key];
    renderProfile(v, target);
    target.scrollTop = 0;
    $$("button", tabs).forEach((b) => {
      const on = b.dataset.key === key;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
    });
    info.innerHTML = `<p>${esc(v.note)}</p>
      <div class="swatch-row"><span class="swatch" style="background:${esc(v.accent)}"></span><span>Accent ${esc(v.accent)}</span></div>
      <div class="order">${v.sections.map((s) => `<span>${names[s] || s}</span>`).join("")}</div>`;
  };

  tabs.innerHTML = keys.map((k) => `<button type="button" role="tab" data-key="${k}">${esc(profileVariants[k].label)}</button>`).join("");
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(b.dataset.key); });
  show("personal");
}

/* ---------- Tap sequence (steps + mini demo) ---------- */
function setupTapDemo() {
  const demo = $(".td"), steps = $$(".steps li");
  let i = 0;
  const tick = () => {
    demo.dataset.step = i;
    steps.forEach((s, k) => s.classList.toggle("active", k === i));
    i = (i + 1) % steps.length;
  };
  tick();
  if (!reduced) setInterval(tick, 2400);
  else { demo.dataset.step = 2; }
}

/* ---------- Scroll reveal ---------- */
function setupReveal() {
  const items = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window)) return items.forEach((e) => e.classList.add("in"));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  items.forEach((e) => io.observe(e));
}

/* ---------- Init ---------- */
(async function init() {
  const data = await loadProfile();
  $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
  bindPage({ ...data, site: siteData });
  $$('[data-profile="main"]').forEach((el) => renderProfile(data, el));
  setupVariants();
  setupTapDemo();
  setupReveal();
})();
