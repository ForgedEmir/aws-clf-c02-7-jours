/* CLF-C02 en 7 jours : moteur du site.
   Tout est statique : les données viennent de data/*.js, la progression reste dans le navigateur (localStorage). */
(function () {
"use strict";

/* ---------- Données ---------- */
const DAYS = window.DAYS || [];
const Q = window.QUESTIONS || [];
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const CARDS = (window.CARDS || []).map(c => Object.assign({ id: slug(c.n) }, c));
const QBY = Object.fromEntries(Q.map(q => [q.id, q]));
const CBY = Object.fromEntries(CARDS.map(c => [c.id, c]));
const DOMS = { 1: "Concepts du cloud", 2: "Sécurité et conformité", 3: "Technologie et services", 4: "Facturation, prix et support" };
const WEIGHT = { 1: 24, 2: 30, 3: 34, 4: 12 };
const DAYDOM = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4 };
const INTERVAL = [0, 1, 2, 3, 5, 8];          // jours avant la prochaine révision, par boîte de Leitner
const MOCK_N = { 1: 16, 2: 19, 3: 22, 4: 8 };  // 65 questions, répartition officielle 24 / 30 / 34 / 12 %
const MOCK_MIN = 90;
const REPO = "https://github.com/ForgedEmir/aws-clf-c02-7-jours";

/* ---------- Dates ---------- */
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const today = () => iso(new Date());
function dateOf(n) { const [y, m, d] = S.start.split("-").map(Number); return new Date(y, m - 1, d + n - 1); }
function addDays(s, k) { const [y, m, d] = s.split("-").map(Number); return iso(new Date(y, m - 1, d + k)); }
function todayN() { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - dateOf(1)) / 864e5) + 1; }
const fmt = (d, o) => d.toLocaleDateString("fr-FR", o);
function touch() { const t = today(); if (!S.days.includes(t)) S.days.push(t); }

/* ---------- Progression ---------- */
const KEY = "clf-c02-7j";
/* Le jour 1 est le jour de la première visite, jamais avant la date de lancement (modifiable dans Ressources). */
const LAUNCH = "2026-11-01";
const fresh = () => ({ v: 3, start: today() > LAUNCH ? today() : LAUNCH, checks: {}, best: {}, wrong: [], mocks: [], seen: {}, cards: {}, days: [], mock: null, match: { rounds: 0, perfect: 0 } });
let S = load();
function load() {
  try {
    const r = localStorage.getItem(KEY);
    // v3 : le programme repart au 1er novembre (jour 1) pour finir le 8 ; les scores sont gardés.
    if (r) {
      const s = Object.assign(fresh(), JSON.parse(r));
      if (s.v < 3) { if (s.start < LAUNCH) s.start = LAUNCH; s.v = 3; localStorage.setItem(KEY, JSON.stringify(s)); }
      return s;
    }
  } catch (e) {}
  const s = fresh();
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  return s;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Outils ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const plural = (n, w) => n + " " + w + (n > 1 ? "s" : "");
function toast(t) { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2200); }
function scrollToBox() { const b = $("#box"); if (b) b.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }

/* ---------- État de l'interface (non sauvegardé) ---------- */
let VIEW = "programme", QZ = null, FL = null, MT = null, LASTMOCK = null, AGAIN = null;
const UI = { pDom: 0, pN: 20, pPri: "mix", fDeck: 0, fDir: "nd", mDeck: 0, confirm: false, showNav: false, resetAsk: false };

function dayDone(n) {
  const D = DAYS[n - 1];
  if (D.steps.every((_, i) => S.checks[n + "-" + i])) return true;
  if (n < 7) return (S.best[n] || 0) >= 80;
  return S.mocks.some(m => m.pct >= 80);
}
function deckCards(n) { return n ? CARDS.filter(c => c.d === n) : CARDS; }
function dueCards(n) { const t = today(); return deckCards(n).filter(c => S.cards[c.id] && S.cards[c.id].due <= t); }
function newCards(n) { return deckCards(n).filter(c => !S.cards[c.id]); }

/* ---------- Navigation ---------- */
const VIEWS = ["programme", "entrainement", "fiches", "associer", "examen", "erreurs", "progres", "ressources"];
function route() {
  closeMore();
  const h = (location.hash || "").slice(1);
  VIEW = (VIEWS.includes(h) || /^j[1-7]$/.test(h)) ? h : "programme";
  QZ = null; FL = null; MT = null; UI.confirm = false; UI.resetAsk = false;
  render();
  window.scrollTo(0, 0);
}
function link(v, label, extra, cls) { return `<a class="nv${cls ? " " + cls : ""}${VIEW === v ? " on" : ""}" href="#${v}"${VIEW === v ? ' aria-current="page"' : ""}>${label}${extra || ""}</a>`; }
const navIcon = name => {
  const paths = { programme: '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 2v4m8-4v4M4 10h16m-11 4h6m-6 3h4"/>', entrainement: '<path d="m14 2-9 12h7l-2 8 9-12h-7z"/>', fiches: '<rect x="6" y="6" width="14" height="16" rx="3"/><path d="M16 2H6a4 4 0 0 0-4 4v12m8-6h6m-6 4h4"/>', examen: '<circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6m-3 0v3"/>', plus: '<circle cx="12" cy="12" r="9"/><path d="M7 12h.01M12 12h.01M17 12h.01"/>' };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};
function closeMore() { const sheet = $("#more-sheet"); if (sheet && sheet.open) sheet.close(); }
function openMore() {
  const sheet = $("#more-sheet");
  sheet.innerHTML = `<div class="between"><h2>Toutes les rubriques</h2><button class="btn ghost" data-nav-close aria-label="Fermer les rubriques">Fermer</button></div><div class="sheet-links">${link("programme", "Programme")}${DAYS.map(d => link("j" + d.n, `Jour ${d.n} · ${d.short}`)).join("")}${[["entrainement", "S’entraîner"], ["fiches", "Fiches"], ["associer", "Associer"], ["examen", "Examen blanc"], ["erreurs", "Mes erreurs"], ["progres", "Progrès"], ["ressources", "Ressources"]].map(x => link(x[0], x[1])).join("")}</div>`;
  sheet.showModal();
}
function renderSide() {
  const t = todayN();
  const days = DAYS.map(D => {
    const st = dayDone(D.n) ? "done" : (t === D.n ? "today" : "");
    return link("j" + D.n, `<span class="dot ${st}"></span>J${D.n} · ${D.short}`, "", "dl");
  }).join("");
  const due = dueCards(0).length;
  $("#side").innerHTML = `<a class="brand" href="#programme"><span class="t">CLF-C02</span><span class="s">en 7 jours</span></a>
  <div class="navg"><span class="h">Programme</span>${link("programme", "Vue d’ensemble")}${days}</div>
  <div class="navg"><span class="h">S’entraîner</span>${link("entrainement", "Entraînement")}${link("fiches", "Fiches", due ? `<span class="c">${due}</span>` : "")}${link("associer", "Associer")}${link("examen", "Examen blanc", S.mock ? '<span class="live">en cours</span>' : "")}${link("erreurs", "Erreurs", S.wrong.length ? `<span class="c">${S.wrong.length}</span>` : "")}</div>
  <div class="navg"><span class="h">Suivi</span>${link("progres", "Progrès")}${link("ressources", "Ressources")}</div>
  <p class="foot">Questions originales, non officielles. Progression gardée dans ce navigateur.<br><a href="${REPO}" target="_blank" rel="noopener">Code source</a></p>`;
  const primary = [["programme", "Programme"], ["entrainement", "S’entraîner"], ["fiches", "Fiches"], ["examen", "Examen"]];
  $("#tabs").innerHTML = primary.map(([v, label]) => {
    const active = VIEW === v || (v === "programme" && /^j[1-7]$/.test(VIEW));
    return `<a href="#${v}"${active ? ' class="on" aria-current="page"' : ""}>${navIcon(v)}<span>${label}</span></a>`;
  }).join("") + `<button data-nav-more aria-haspopup="dialog"${primary.some(x => x[0] === VIEW) || /^j/.test(VIEW) ? "" : ' class="on"'}>${navIcon("plus")}<span>Plus</span></button>`;
}
function render() {
  renderSide();
  let h;
  if (VIEW === "programme") h = vProgramme();
  else if (/^j[1-7]$/.test(VIEW)) h = vDay(+VIEW[1]);
  else h = ({ entrainement: vPractice, fiches: vCards, associer: vMatch, examen: vExam, erreurs: vErrors, progres: vProgress, ressources: vRes })[VIEW]();
  $("#view").innerHTML = h;
  if (window.VIZ) window.VIZ.mount($("#view"));
  $$(".tbl-wrap,.dia-wrap").forEach(el => {
    if (el.scrollWidth <= el.clientWidth) return;
    el.tabIndex = 0; el.setAttribute("role", "region");
    el.setAttribute("aria-label", (el.matches(".tbl-wrap") ? "Tableau" : "Schéma") + " à faire défiler horizontalement");
  });
  if (VIEW === "examen" && S.mock) drawMock();
  if (VIEW === "fiches" && FL) drawFlash();
  if (VIEW === "associer") drawMatch();
}

/* ---------- Vue d'ensemble ---------- */
function vProgramme() {
  const t = todayN(), cur = Math.min(7, Math.max(1, t)), D = DAYS[cur - 1];
  const left = Math.max(0, 8 - t);
  const doneSteps = D.steps.filter((_, i) => S.checks[cur + "-" + i]).length;
  let now;
  if (t < 1) now = `<p class="eyebrow">Bientôt</p><h2>Le programme commence le ${fmt(dateOf(1), { weekday: "long", day: "numeric", month: "long" })}</h2>`;
  else if (t > 7) now = `<p class="eyebrow">Programme terminé</p><h2>Passe un examen blanc, puis l’examen réel</h2>`;
  else now = `<p class="eyebrow">Aujourd’hui · jour ${cur} sur 7</p><h2>${D.title}</h2><p class="muted" style="font-size:14px">${doneSteps} / ${D.steps.length} tâches faites · ${D.time}</p>`;
  const rows = DAYS.map(d => {
    const cls = dayDone(d.n) ? " done" : (t === d.n ? " today" : "");
    const info = d.n < 7 ? (S.best[d.n] != null ? "quiz " + S.best[d.n] + " %" : plural(Q.filter(q => q.d === d.n).length, "question")) : (S.mocks.length ? "meilleur " + Math.max(...S.mocks.map(m => m.pct)) + " %" : "65 questions");
    return `<a class="dayrow${cls}" href="#j${d.n}"><span class="n">J${d.n}</span><span><span class="t">${d.title}</span><br><span class="d">${fmt(dateOf(d.n), { weekday: "short", day: "numeric", month: "short" })} · ${d.time}</span></span><span class="d">${dayDone(d.n) ? "fait" : info}</span></a>`;
  }).join("");
  const domBars = [1, 2, 3, 4].map(d => `<div class="bar"><span>${DOMS[d]}</span><div class="tr"><div class="fl" style="width:${WEIGHT[d] / 34 * 100}%"></div></div><span class="v">${WEIGHT[d]} %</span></div>`).join("");
  return `<header class="head"><p class="eyebrow">AWS Certified Cloud Practitioner · CLF-C02</p><h1>Le Cloud Practitioner en 7 jours</h1>
  <p class="lede">Un domaine par jour, expliqué en schémas. Puis des quiz un peu plus durs que l’examen, des fiches à répétition espacée et un examen blanc chronométré.</p>
  <div class="facts"><span class="pill"><b>${left}</b> ${left > 1 ? "jours" : "jour"} avant l’examen conseillé (${fmt(dateOf(8), { weekday: "short", day: "numeric", month: "short" })})</span><span class="pill"><b>${Q.length}</b> questions</span><span class="pill"><b>${CARDS.length}</b> fiches</span></div></header>
  <section class="card"><div class="between"><div style="min-width:0">${now}</div>${t > 7 ? `<a class="btn" href="#examen">Examen blanc</a>` : `<a class="btn" href="#j${cur}">${t < 1 ? "Voir" : "Ouvrir"} le jour ${cur}</a>`}</div></section>
  <section class="card"><h3>Les 7 jours</h3><p class="sub">Un jour est marqué fait quand toutes ses tâches sont cochées ou que son quiz atteint 80 %.</p><div class="days">${rows}</div></section>
  <section class="card"><h3>L’examen</h3><p class="sub">65 questions dont 50 notées, 90 minutes, réussite à 700 sur 1000, 100 $. Disponible en français. Une mauvaise réponse ne retire pas de points.</p><div class="bars">${domBars}</div></section>
  <section class="card"><h3>Quatre façons de s’entraîner</h3><div class="grid" style="margin-top:12px">
   <a class="tile" href="#entrainement" style="text-decoration:none"><p class="k">entraînement</p><b>Questions au choix</b><p>Par domaine, sur tes points faibles ou sur les questions jamais vues.</p></a>
   <a class="tile" href="#fiches" style="text-decoration:none"><p class="k">fiches</p><b>Répétition espacée</b><p>Un service, une phrase. Les fiches ratées reviennent plus souvent.</p></a>
   <a class="tile" href="#associer" style="text-decoration:none"><p class="k">associer</p><b>Jeu d’association</b><p>Relie 6 services à leur rôle, le plus vite possible.</p></a>
   <a class="tile" href="#examen" style="text-decoration:none"><p class="k">examen blanc</p><b>Conditions réelles</b><p>65 questions, 90 min, corrigé à la fin, score par domaine.</p></a>
  </div></section>`;
}

/* ---------- Jour ---------- */
function vDay(n) {
  const D = DAYS[n - 1];
  const dom = D.dom ? `<span class="pill">${DOMS[D.dom]} · <b>${WEIGHT[D.dom]} %</b> de l’examen</span>` : `<span class="pill">Tous les domaines</span>`;
  const steps = D.steps.map((s, i) => `<label for="ck-${n}-${i}"><input type="checkbox" id="ck-${n}-${i}" data-ck="${n}-${i}"${S.checks[n + "-" + i] ? " checked" : ""}><span class="t">${s[0]}</span><span class="m">${s[1]}</span></label>`).join("");
  const traps = D.traps.map(t => `<li><span>${t}</span></li>`).join("");
  const nq = Q.filter(q => q.d === n).length, nc = deckCards(n).length, b = S.best[n];
  const ex = n < 7 ? `<section class="card"><h3>Exercices du jour</h3><p class="sub">Après la leçon : le quiz pour vérifier, les fiches pour mémoriser, le jeu d’association pour aller vite.</p>
   <div class="row"><button class="btn" data-act="quiz-day" data-n="${n}">Quiz du jour · ${nq}</button><button class="btn ghost" data-act="goto-fiches" data-n="${n}">Fiches du jour · ${nc}</button><button class="btn ghost" data-act="goto-match" data-n="${n}">Associer</button>${b != null ? `<span class="pill ${b >= 80 ? "ok" : "warn"}">meilleur score ${b} %</span>` : ""}</div></section>`
    : `<section class="card"><h3>Examen blanc</h3><p class="sub">Deux examens blancs aujourd’hui. Entre les deux, relis chaque erreur.</p><div class="row"><a class="btn" href="#examen">Aller à l’examen blanc</a><a class="btn ghost" href="#erreurs">Mes erreurs · ${S.wrong.length}</a></div></section>`;
  const nav = `<div class="row" style="justify-content:space-between">${n > 1 ? `<a class="btn ghost" href="#j${n - 1}">← Jour ${n - 1}</a>` : "<span></span>"}${n < 7 ? `<a class="btn ghost" href="#j${n + 1}">Jour ${n + 1} →</a>` : ""}</div>`;
  return `<header class="head"><p class="eyebrow">Jour ${n} · ${fmt(dateOf(n), { weekday: "long", day: "numeric", month: "long" })} · ${D.time}</p><h1>${D.title}</h1><p class="lede">${D.lede}</p><div class="facts">${dom}</div></header>
  <section class="card"><h3>Programme du jour</h3><p class="sub">Coche au fur et à mesure.</p><div class="plan">${steps}</div></section>
  ${ex}
  <div class="stack" id="lesson">${D.lesson}</div>
  <section class="card"><h3>Pièges de l’examen</h3><ul class="traps" style="margin-top:12px">${traps}</ul></section>
  ${n < 7 ? `<section class="card" id="box">${quizIntro(n)}</section>` : ""}
  ${nav}`;
}
function quizIntro(n) {
  const nq = Q.filter(q => q.d === n).length;
  return `<div class="between"><div><h3>Quiz du jour ${n}</h3><p class="sub" style="margin:4px 0 0">${nq} questions, un peu plus piégeuses que l’examen. Correction et explication après chaque réponse.</p></div><button class="btn" data-act="quiz-day" data-n="${n}">Lancer le quiz</button></div>`;
}

/* ---------- Quiz (jour, entraînement, erreurs) ---------- */
function startQuiz(mode, list, label, n, again) {
  if (!list.length) { toast("Aucune question à afficher"); return; }
  QZ = { mode, label, n, list: list.map(q => ({ q, ord: shuffle(q.o.map((_, i) => i)) })), i: 0, pick: [], checked: false, res: [] };
  AGAIN = again;
  drawQuiz(); scrollToBox();
}
function optsHtml(q, ord, pick, checked) {
  return ord.map((oi, k) => {
    let c = "";
    if (checked) { if (q.a.includes(oi)) c = " good"; else if (pick.includes(oi)) c = " wrong"; }
    else if (pick.includes(oi)) c = " sel";
    return `<button class="opt${c}" data-oi="${oi}"${checked ? " disabled" : ""} aria-pressed="${pick.includes(oi)}"><span class="l">${"ABCDE"[k]}</span><span>${esc(q.o[oi])}</span></button>`;
  }).join("");
}
function drawQuiz() {
  const box = $("#box"); if (!box || !QZ) return;
  const it = QZ.list[QZ.i], q = it.q, N = QZ.list.length, need = q.a.length, last = QZ.i + 1 >= N;
  let fb = "";
  if (QZ.checked) { const ok = same(QZ.pick, q.a); fb = `<div class="expl ${ok ? "ok" : "ko"}"><b>${ok ? "Bonne réponse" : "Raté"}</b>${esc(q.x)}</div>`; }
  const btn = QZ.checked
    ? `<button class="btn" data-act="next" data-primary>${last ? "Voir mon score" : "Question suivante"} <kbd>Entrée</kbd></button>`
    : `<button class="btn" data-act="check" data-primary${QZ.pick.length === need ? "" : " disabled"}>Valider <kbd>Entrée</kbd></button>`;
  box.innerHTML = `<div class="qhead"><span class="eyebrow">${esc(QZ.label)} · ${QZ.i + 1} / ${N}</span><span class="pill">${DOMS[DAYDOM[q.d]]}</span></div>
  <div class="qprog"><div style="width:${QZ.i / N * 100}%"></div></div>
  <p class="qtext">${esc(q.q)}</p>${need > 1 ? `<p class="multi">Choisis ${need} réponses</p>` : ""}
  <div class="opts">${optsHtml(q, it.ord, QZ.pick, QZ.checked)}</div>${fb}
  <div class="row">${btn}<button class="btn ghost" data-act="quit">Arrêter</button></div>`;
}
function togglePick(pick, oi, need) {
  if (need === 1) return [oi];
  if (pick.includes(oi)) return pick.filter(x => x !== oi);
  return pick.length < need ? pick.concat(oi) : pick.slice(1).concat(oi);
}
function noteAnswer(id, ok) {
  const s = S.seen[id] || { n: 0, ok: 0, last: false };
  s.n++; if (ok) s.ok++; s.last = ok; S.seen[id] = s;
  const w = new Set(S.wrong); if (ok) w.delete(id); else w.add(id); S.wrong = [...w];
  touch();
}
function checkQuiz() {
  const q = QZ.list[QZ.i].q, ok = same(QZ.pick, q.a);
  QZ.checked = true; QZ.res[QZ.i] = { id: q.id, ok, pick: QZ.pick.slice() };
  noteAnswer(q.id, ok); save(); drawQuiz(); renderSide();
}
function nextQuiz() {
  if (QZ.i + 1 >= QZ.list.length) { finishQuiz(); return; }
  QZ.i++; QZ.pick = []; QZ.checked = false; drawQuiz();
}
function reviewHtml(items) {
  return items.map(r => {
    const q = QBY[r.id];
    return `<div class="item"><p class="q">${esc(q.q)}</p><p class="you">✗ ${r.pick.length ? r.pick.map(i => esc(q.o[i])).join(" + ") : "Pas de réponse"}</p><p class="ans">✓ ${q.a.map(i => esc(q.o[i])).join(" + ")}</p><p class="x">${esc(q.x)}</p></div>`;
  }).join("");
}
function finishQuiz() {
  const Z = QZ; QZ = null;
  const res = Z.res.filter(Boolean), N = Z.list.length, good = res.filter(r => r.ok).length, p = pct(good, N);
  if (Z.mode === "day") { S.best[Z.n] = Math.max(S.best[Z.n] || 0, p); save(); }
  const pass = p >= 80, missed = res.filter(r => !r.ok);
  $("#box").innerHTML = `<div class="score"><span class="n ${pass ? "ok" : "ko"}">${p} %</span><div><h3>${good} / ${N} bonnes réponses</h3><p class="sub" style="margin:4px 0 0">${pass ? "Objectif atteint. Passe à la suite, ou consolide avec les fiches." : "En dessous de 80 %. Relis les explications, puis refais tes erreurs."}</p></div></div>
  <div class="row"><button class="btn" data-act="again">Recommencer</button>${S.wrong.length ? `<a class="btn ghost" href="#erreurs">Mes erreurs · ${S.wrong.length}</a>` : ""}${Z.mode === "day" && Z.n < 7 ? `<a class="btn ghost" href="#j${Z.n + 1}">Jour ${Z.n + 1} →</a>` : ""}</div>
  ${missed.length ? `<p class="eyebrow" style="margin-top:24px">À retenir</p><div class="rev">${reviewHtml(missed)}</div>` : ""}`;
  renderSide();
}
function quizDay(n) { startQuiz("day", shuffle(Q.filter(q => q.d === n)), "Quiz du jour " + n, n, () => quizDay(n)); }
function quizReview() { startQuiz("review", shuffle(S.wrong.map(id => QBY[id]).filter(Boolean)), "Mes erreurs", 0, quizReview); }
function quizPractice() {
  let pool = Q.filter(q => !UI.pDom || DAYDOM[q.d] === UI.pDom), list;
  const N = UI.pN || pool.length;
  if (UI.pPri === "new") { const nw = pool.filter(q => !S.seen[q.id]); list = shuffle(nw.length ? nw : pool).slice(0, N); }
  else if (UI.pPri === "weak") {
    const r = q => { const s = S.seen[q.id]; return (s ? s.ok / s.n : 0.6) + Math.random() * 0.05; };
    list = pool.slice().sort((a, b) => r(a) - r(b)).slice(0, N);
  } else list = shuffle(pool).slice(0, N);
  startQuiz("practice", shuffle(list), "Entraînement", 0, quizPractice);
}

/* ---------- Entraînement libre ---------- */
function seg(key, opts) { return `<div class="seg" role="group">${opts.map(([v, l]) => `<button data-set="${key}" data-val="${v}" class="${String(UI[key]) === String(v) ? "on" : ""}">${l}</button>`).join("")}</div>`; }
function vPractice() {
  const seen = Q.filter(q => S.seen[q.id]).length;
  return `<header class="head"><p class="eyebrow">S’entraîner</p><h1>Entraînement</h1><p class="lede">Compose ta propre série. Correction immédiate, et chaque erreur rejoint la liste à revoir.</p></header>
  <section class="card" id="box"><div class="stack">
   <label class="field"><span>Domaine</span>${seg("pDom", [[0, "Tous"], [1, "Concepts"], [2, "Sécurité"], [3, "Technologie"], [4, "Facturation"]])}</label>
   <label class="field"><span>Nombre de questions</span>${seg("pN", [[10, "10"], [20, "20"], [40, "40"], [0, "Toutes"]])}</label>
   <label class="field"><span>Priorité</span>${seg("pPri", [["mix", "Au hasard"], ["new", "Jamais vues"], ["weak", "Mes points faibles"]])}</label>
   <div class="between"><p class="muted" style="font-size:14px">${seen} / ${Q.length} questions déjà vues</p><button class="btn" data-act="quiz-practice">Lancer la série</button></div>
  </div></section>`;
}

/* ---------- Examen blanc ---------- */
function vExam() {
  const head = `<header class="head"><p class="eyebrow">Conditions réelles</p><h1>Examen blanc</h1><p class="lede">65 questions tirées selon la répartition officielle des domaines, 90 minutes. Tu peux revenir en arrière et marquer des questions. Le chrono continue même si tu quittes la page.</p></header>`;
  if (S.mock) return head + `<section class="card" id="box"></section>`;
  if (LASTMOCK) return head + `<section class="card" id="box">${mockResult(LASTMOCK)}</section>`;
  const h = S.mocks.slice(-12).map(m => `<div class="${m.pct >= 80 ? "ok" : ""}" style="height:${Math.max(4, m.pct * .8)}px" title="${m.at} · ${m.pct} %"><span>${m.pct}</span></div>`).join("");
  return head + `<section class="card" id="box"><div class="between"><div class="facts"><span class="pill"><b>65</b> questions</span><span class="pill"><b>90</b> min</span><span class="pill">objectif <b>80 %</b></span></div><button class="btn" data-act="mock-start">Commencer l’examen</button></div>
  ${S.mocks.length ? `<p class="eyebrow" style="margin-top:24px">Tes examens blancs, en %</p><div class="hist">${h}</div>` : `<p class="empty" style="margin-top:20px">Tes scores apparaîtront ici. Vise 80 % deux fois de suite avant l’examen réel.</p>`}
  <p class="note" style="margin-top:16px">Raccourcis : 1 à 5 pour répondre, ← → pour naviguer, F pour marquer une question.</p></section>`;
}
function startMock() {
  const ids = [];
  for (const d of [1, 2, 3, 4]) ids.push(...shuffle(Q.filter(q => DAYDOM[q.d] === d)).slice(0, MOCK_N[d]).map(q => q.id));
  const list = shuffle(ids);
  S.mock = { ids: list, ord: Object.fromEntries(list.map(id => [id, shuffle(QBY[id].o.map((_, i) => i))])), ans: {}, flag: {}, i: 0, end: Date.now() + MOCK_MIN * 60e3 };
  LASTMOCK = null; UI.confirm = false; UI.showNav = false;
  save(); render(); scrollToBox();
}
function mmss(ms) { const m = Math.floor(ms / 60e3), s = Math.floor(ms % 60e3 / 1e3); return m + ":" + String(s).padStart(2, "0"); }
function drawMock() {
  const M = S.mock, box = $("#box"); if (!M || !box) return;
  const id = M.ids[M.i], q = QBY[id], N = M.ids.length, need = q.a.length, pick = M.ans[id] || [];
  const answered = M.ids.filter(x => (M.ans[x] || []).length).length, flagged = M.ids.filter(x => M.flag[x]).length;
  const grid = UI.showNav ? `<div class="navgrid">${M.ids.map((x, k) => `<button data-act="mock-goto" data-i="${k}" class="${(M.ans[x] || []).length ? "ans" : ""}${M.flag[x] ? " fl" : ""}${k === M.i ? " cur" : ""}">${k + 1}</button>`).join("")}</div>` : "";
  const conf = UI.confirm ? `<div class="confirm"><p style="margin-bottom:12px">${N - answered ? plural(N - answered, "question") + " sans réponse" : "Toutes les questions ont une réponse"}${flagged ? ", " + plural(flagged, "question") + " marquée" + (flagged > 1 ? "s" : "") : ""}. Une fois terminé, tu ne pourras plus modifier tes réponses.</p><div class="row"><button class="btn" data-act="mock-submit">Terminer maintenant</button><button class="btn ghost" data-act="mock-cancel">Continuer l’examen</button></div></div>` : "";
  const last = M.i + 1 >= N;
  box.innerHTML = `<div class="qhead"><span class="eyebrow">Question ${M.i + 1} / ${N} · ${plural(answered, "répondue")}</span><span class="row"><button class="flag${M.flag[id] ? " on" : ""}" data-act="mock-flag">${M.flag[id] ? "marquée" : "marquer"}</button><span class="timer" id="mtimer">${mmss(Math.max(0, M.end - Date.now()))}</span></span></div>
  <div class="qprog"><div style="width:${answered / N * 100}%"></div></div>
  <p class="qtext">${esc(q.q)}</p>${need > 1 ? `<p class="multi">Choisis ${need} réponses</p>` : ""}
  <div class="opts">${optsHtml(q, M.ord[id], pick, false)}</div>
  <div class="row"><button class="btn ghost" data-act="mock-prev"${M.i ? "" : " disabled"}>← Précédente</button>${last ? `<button class="btn" data-act="mock-ask" data-primary>Revoir et terminer</button>` : `<button class="btn" data-act="mock-next" data-primary>Suivante → <kbd>Entrée</kbd></button>`}<button class="btn ghost" data-act="mock-nav">${UI.showNav ? "Masquer la grille" : "Vue d’ensemble"}</button><button class="btn ghost" data-act="mock-ask" style="margin-left:auto">Terminer</button></div>
  ${grid}${conf}`;
  tick();
}
function mockGo(k) { const M = S.mock; if (!M) return; const i = Math.min(M.ids.length - 1, Math.max(0, M.i + k)); if (i !== M.i) { M.i = i; save(); drawMock(); } }
function submitMock() {
  const M = S.mock; if (!M) return;
  const res = M.ids.map(id => { const pick = M.ans[id] || []; return { id, pick, ok: same(pick, QBY[id].a) }; });
  res.forEach(r => { if (r.pick.length) noteAnswer(r.id, r.ok); });   // les questions sans réponse comptent faux mais ne faussent pas les stats
  const good = res.filter(r => r.ok).length, p = pct(good, res.length), byDom = {};
  [1, 2, 3, 4].forEach(d => { const rs = res.filter(r => DAYDOM[QBY[r.id].d] === d); byDom[d] = pct(rs.filter(r => r.ok).length, rs.length); });
  S.mocks.push({ at: today(), pct: p, good, n: res.length, byDom });
  S.mock = null; LASTMOCK = { res, good, p, byDom }; UI.confirm = false;
  save();
  if (VIEW === "examen") { render(); scrollToBox(); } else { renderSide(); toast("Temps écoulé : ton examen blanc a été corrigé"); }
}
function mockResult(L) {
  const scaled = Math.round(100 + 900 * L.good / L.res.length), pass = L.p >= 80;
  const bars = [1, 2, 3, 4].map(d => `<div class="bar"><span>${DOMS[d]}</span><div class="tr"><div class="fl${L.byDom[d] >= 80 ? " g" : L.byDom[d] < 70 ? " b" : " w"}" style="width:${L.byDom[d]}%"></div></div><span class="v">${L.byDom[d]} %</span></div>`).join("");
  const missed = L.res.filter(r => !r.ok);
  return `<div class="score"><span class="n ${pass ? "ok" : "ko"}">${L.p} %</span><div><h3>${L.good} / ${L.res.length} bonnes réponses</h3><p class="sub" style="margin:4px 0 0">Soit environ ${scaled} / 1000 sur l’échelle AWS (réussite à 700). Les questions d’ici sont plus dures : à 80 %, tu as de la marge.</p></div></div>
  <p class="eyebrow">Par domaine</p><div class="bars" style="margin-top:8px">${bars}</div>
  <div class="row" style="margin-top:20px"><button class="btn" data-act="mock-start">Nouvel examen blanc</button>${S.wrong.length ? `<a class="btn ghost" href="#erreurs">Mes erreurs · ${S.wrong.length}</a>` : ""}<button class="btn ghost" data-act="mock-close">Historique</button></div>
  ${missed.length ? `<p class="eyebrow" style="margin-top:24px">Corrigé des ${missed.length} erreurs</p><div class="rev">${reviewHtml(missed)}</div>` : ""}`;
}
function tick() {
  const M = S.mock; if (!M) return;
  const ms = M.end - Date.now();
  if (ms <= 0) { submitMock(); return; }
  const el = $("#mtimer"); if (el) { el.textContent = mmss(ms); el.classList.toggle("low", ms < 10 * 60e3); }
}

/* ---------- Fiches (répétition espacée, boîtes de Leitner) ---------- */
function vCards() {
  const n = UI.fDeck, deck = deckCards(n), due = dueCards(n).length, nw = newCards(n).length;
  const box = [0, 1, 2, 3, 4, 5].map(b => deck.filter(c => (S.cards[c.id] ? S.cards[c.id].b : 0) === b).length);
  const labels = ["nouvelles", "boîte 1", "boîte 2", "boîte 3", "boîte 4", "maîtrisées"];
  return `<header class="head"><p class="eyebrow">Mémoriser</p><h1>Fiches</h1><p class="lede">Un service, une phrase. Une fiche connue passe dans la boîte suivante et revient plus tard. Une fiche ratée retourne en boîte 1 et revient aujourd’hui.</p></header>
  <section class="card"><div class="stack">
   <label class="field"><span>Paquet</span>${seg("fDeck", [[0, "Tout"], [1, "J1"], [2, "J2"], [3, "J3"], [4, "J4"], [5, "J5"], [6, "J6"]])}</label>
   <label class="field"><span>Sens</span>${seg("fDir", [["nd", "Nom → définition"], ["dn", "Définition → nom"]])}</label>
   <div class="boxes">${box.map((c, i) => `<div><div class="n">${c}</div><div class="l">${labels[i]}</div></div>`).join("")}</div>
  </div></section>
  <section class="card" id="box"><div class="between"><p class="muted" style="font-size:14px">${due} à revoir aujourd’hui · ${nw} nouvelles (20 maximum par séance)</p><div class="row">${due || nw ? `<button class="btn" data-act="fl-start">Commencer la séance</button>` : `<button class="btn ghost" data-act="fl-cram">Réviser 20 fiches au hasard</button>`}</div></div>
  <p class="note" style="margin-top:16px">Raccourcis : Espace pour retourner, 1 = à revoir, 2 = je savais.</p></section>`;
}
function startFlash(cram) {
  const n = UI.fDeck;
  const ids = cram ? shuffle(deckCards(n)).slice(0, 20).map(c => c.id) : shuffle(dueCards(n)).map(c => c.id).concat(shuffle(newCards(n)).slice(0, 20).map(c => c.id));
  if (!ids.length) return;
  FL = { q: ids, i: 0, flip: false, known: 0, again: 0, back: new Set() };
  drawFlash(); scrollToBox();
}
function drawFlash() {
  const box = $("#box"); if (!box || !FL) return;
  if (FL.i >= FL.q.length) {
    box.innerHTML = `<div class="score"><span class="n ok">${FL.known}</span><div><h3>Séance terminée</h3><p class="sub" style="margin:4px 0 0">${plural(FL.known, "fiche")} connue${FL.known > 1 ? "s" : ""}, ${FL.again} à revoir. Les prochaines reviendront aux dates prévues par leur boîte.</p></div></div><div class="row"><button class="btn" data-act="fl-done">Retour aux paquets</button><button class="btn ghost" data-act="goto-match" data-n="${UI.fDeck}">Jouer à Associer</button></div>`;
    FL = null; renderSide(); return;
  }
  const c = CBY[FL.q[FL.i]], nd = UI.fDir === "nd", st = S.cards[c.id];
  const front = nd ? `<p class="front">${esc(c.n)}</p>` : `<p class="front long">${esc(c.t)}</p>`;
  const back = FL.flip ? (nd ? `<p class="back">${esc(c.t)}</p>` : `<p class="back name">${esc(c.n)}</p>`) : `<p class="mono muted" style="font-size:11px">touche Espace ou clic pour retourner</p>`;
  box.innerHTML = `<div class="qhead"><span class="eyebrow">Fiche ${FL.i + 1} / ${FL.q.length} · jour ${c.d}</span><span class="pill">${st ? (st.b >= 5 ? "maîtrisée" : "boîte " + st.b) : "nouvelle"}</span></div>
  <div class="qprog"><div style="width:${FL.i / FL.q.length * 100}%"></div></div>
  <div class="flash" data-act="fl-flip">${front}${back}</div>
  <div class="row" style="margin-top:16px">${FL.flip ? `<button class="btn ghost" data-act="fl-again">À revoir <kbd>1</kbd></button><button class="btn" data-act="fl-know" data-primary>Je savais <kbd>2</kbd></button>` : `<button class="btn" data-act="fl-flip" data-primary>Retourner <kbd>Espace</kbd></button>`}<button class="btn ghost" data-act="fl-done" style="margin-left:auto">Arrêter</button></div>`;
}
function flAnswer(know) {
  const id = FL.q[FL.i], c = S.cards[id] || { b: 0, due: today() };
  if (know) { c.b = Math.min(5, c.b + 1); c.due = addDays(today(), INTERVAL[c.b]); FL.known++; }
  else { c.b = 1; c.due = today(); FL.again++; if (!FL.back.has(id)) { FL.back.add(id); FL.q.push(id); } }
  S.cards[id] = c; touch(); save();
  FL.i++; FL.flip = false; drawFlash();
}

/* ---------- Associer ---------- */
function vMatch() {
  return `<header class="head"><p class="eyebrow">Aller vite</p><h1>Associer</h1><p class="lede">Clique un service, puis la phrase qui le décrit. Six paires par manche. Le chrono et les erreurs s’affichent à la fin.</p></header>
  <section class="card"><label class="field"><span>Paquet</span>${seg("mDeck", [[0, "Tout"], [1, "J1"], [2, "J2"], [3, "J3"], [4, "J4"], [5, "J5"], [6, "J6"]])}</label></section>
  <section class="card" id="box"></section>
  <p class="note">${S.match.rounds} manche${S.match.rounds > 1 ? "s" : ""} jouée${S.match.rounds > 1 ? "s" : ""}, dont ${S.match.perfect} sans erreur.</p>`;
}
function newMatch() {
  const pairs = shuffle(deckCards(UI.mDeck)).slice(0, 6).map(c => c.id);
  MT = { pairs, left: shuffle(pairs), right: shuffle(pairs), done: [], selL: null, selR: null, err: 0, bad: [], t0: Date.now(), t1: 0 };
}
function drawMatch() {
  const box = $("#box"); if (!box) return;
  if (!MT) newMatch();
  if (MT.t1) {
    const s = Math.round((MT.t1 - MT.t0) / 1000);
    box.innerHTML = `<div class="score"><span class="n ${MT.err ? "ko" : "ok"}">${s} s</span><div><h3>${MT.err ? plural(MT.err, "erreur") : "Sans erreur"}</h3><p class="sub" style="margin:4px 0 0">Six paires trouvées. Une nouvelle manche tire d’autres services.</p></div></div><div class="row"><button class="btn" data-act="mt-new" data-primary>Nouvelle manche <kbd>Entrée</kbd></button></div>`;
    return;
  }
  const L = MT.left.map(id => `<button class="mt name${MT.done.includes(id) ? " done" : ""}${MT.selL === id ? " sel" : ""}${MT.bad.includes("l" + id) ? " err" : ""}" data-act="mt-l" data-id="${id}"${MT.done.includes(id) ? " disabled" : ""}>${esc(CBY[id].n)}</button>`).join("");
  const R = MT.right.map(id => `<button class="mt${MT.done.includes(id) ? " done" : ""}${MT.selR === id ? " sel" : ""}${MT.bad.includes("r" + id) ? " err" : ""}" data-act="mt-r" data-id="${id}"${MT.done.includes(id) ? " disabled" : ""}>${esc(CBY[id].t)}</button>`).join("");
  box.innerHTML = `<div class="qhead"><span class="eyebrow">${MT.done.length} / 6 paires · ${plural(MT.err, "erreur")}</span><button class="btn ghost" data-act="mt-new">Nouvelle manche</button></div><div class="match"><div class="colm">${L}</div><div class="colm">${R}</div></div>`;
}
function matchPick(side, id) {
  if (!MT || MT.t1 || MT.done.includes(id)) return;
  if (side === "l") MT.selL = MT.selL === id ? null : id; else MT.selR = MT.selR === id ? null : id;
  if (MT.selL && MT.selR) {
    if (MT.selL === MT.selR) { MT.done.push(MT.selL); }
    else { MT.err++; MT.bad = ["l" + MT.selL, "r" + MT.selR]; setTimeout(() => { if (MT) { MT.bad = []; drawMatch(); } }, 600); }
    MT.selL = MT.selR = null;
    if (MT.done.length === MT.pairs.length) { MT.t1 = Date.now(); S.match.rounds++; if (!MT.err) S.match.perfect++; touch(); save(); }
  }
  drawMatch();
}

/* ---------- Erreurs ---------- */
function vErrors() {
  const list = S.wrong.map(id => QBY[id]).filter(Boolean);
  const items = list.map(q => `<div class="item"><p class="q">${esc(q.q)}</p><p class="ans">✓ ${q.a.map(i => esc(q.o[i])).join(" + ")}</p><p class="x">${esc(q.x)}</p></div>`).join("");
  return `<header class="head"><p class="eyebrow">Révision ciblée</p><h1>Mes erreurs</h1><p class="lede">Chaque question ratée arrive ici, quel que soit l’exercice. Elle disparaît dès que tu y réponds juste.</p></header>
  <section class="card" id="box"><div class="between"><h3>${plural(list.length, "question")} à revoir</h3><button class="btn" data-act="quiz-review"${list.length ? "" : " disabled"}>Refaire mes erreurs</button></div>
  ${list.length ? `<div class="rev" style="margin-top:16px">${items}</div>` : `<p class="empty" style="margin-top:16px">Aucune erreur pour l’instant. Lance un quiz pour commencer.</p>`}</section>`;
}

/* ---------- Progrès ---------- */
function vProgress() {
  const seenIds = Object.keys(S.seen).filter(id => QBY[id]);
  const tot = seenIds.reduce((a, id) => a + S.seen[id].n, 0), ok = seenIds.reduce((a, id) => a + S.seen[id].ok, 0);
  const mastered = CARDS.filter(c => S.cards[c.id] && S.cards[c.id].b >= 4).length;
  const dom = [1, 2, 3, 4].map(d => {
    const ids = seenIds.filter(id => DAYDOM[QBY[id].d] === d), n = ids.reduce((a, id) => a + S.seen[id].n, 0), k = ids.reduce((a, id) => a + S.seen[id].ok, 0), p = pct(k, n);
    return `<div class="bar"><span>${DOMS[d]}</span><div class="tr"><div class="fl${n ? (p >= 80 ? " g" : p < 70 ? " b" : " w") : ""}" style="width:${p}%"></div></div><span class="v">${n ? p + " % · " + n : "pas encore"}</span></div>`;
  }).join("");
  const days = DAYS.slice(0, 6).map(D => { const b = S.best[D.n]; return `<div class="bar"><span>J${D.n} · ${D.short}</span><div class="tr"><div class="fl${b >= 80 ? " g" : ""}" style="width:${b || 0}%"></div></div><span class="v">${b != null ? b + " %" : "pas fait"}</span></div>`; }).join("");
  const h = S.mocks.slice(-12).map(m => `<div class="${m.pct >= 80 ? "ok" : ""}" style="height:${Math.max(4, m.pct * .8)}px" title="${m.at} · ${m.pct} %"><span>${m.pct}</span></div>`).join("");
  return `<header class="head"><p class="eyebrow">Suivi</p><h1>Progrès</h1><p class="lede">Où tu en es, domaine par domaine. Vise 80 % partout avant l’examen.</p></header>
  <div class="kpis"><div class="kpi"><div class="n">${seenIds.length}<span class="muted" style="font-size:14px"> / ${Q.length}</span></div><div class="l">questions vues</div></div><div class="kpi"><div class="n">${tot ? pct(ok, tot) + " %" : "-"}</div><div class="l">réussite globale</div></div><div class="kpi"><div class="n">${mastered}<span class="muted" style="font-size:14px"> / ${CARDS.length}</span></div><div class="l">fiches en boîte 4 ou 5</div></div><div class="kpi"><div class="n">${S.days.length}</div><div class="l">jours d’activité</div></div></div>
  <section class="card"><h3>Réussite par domaine</h3><p class="sub">Toutes tes réponses, tous exercices confondus. Le chiffre après le pourcentage est le nombre de réponses.</p><div class="bars">${dom}</div></section>
  <section class="card"><h3>Meilleur score aux quiz du jour</h3><div class="bars" style="margin-top:12px">${days}</div></section>
  <section class="card"><h3>Examens blancs</h3>${S.mocks.length ? `<div class="hist">${h}</div>` : `<p class="empty" style="margin-top:12px">Aucun examen blanc pour l’instant.</p>`}</section>
  <section class="card"><h3>Sauvegarde</h3><p class="sub">Ta progression reste dans ce navigateur. Exporte-la pour la garder ou la passer sur un autre appareil.</p>
   <div class="row"><button class="btn ghost" data-act="export">Exporter ma progression</button><label class="btn ghost" for="imp">Importer un fichier</label><input type="file" id="imp" accept="application/json,.json" hidden>${UI.resetAsk ? `<span class="row"><span class="muted" style="font-size:14px">Tout effacer ?</span><button class="btn danger" data-act="reset-yes">Oui, effacer</button><button class="btn ghost" data-act="reset-no">Annuler</button></span>` : `<button class="btn danger" data-act="reset-ask">Tout effacer</button>`}</div></section>`;
}
function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "clf-c02-progression-" + today() + ".json";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function importData(file) {
  const r = new FileReader();
  r.onload = () => {
    try { const o = JSON.parse(r.result); if (!o || typeof o !== "object" || !("checks" in o)) throw 0; S = Object.assign(fresh(), o); save(); render(); toast("Progression importée"); }
    catch (e) { toast("Ce fichier n’est pas une sauvegarde valide"); }
  };
  r.readAsText(file);
}

/* ---------- Ressources ---------- */
function vRes() {
  const L = [
    ["https://skillbuilder.aws/learn/FU5WCYVGKY/aws-cloud-quest-cloud-practitioner/MKTEWB6FBP", "AWS Cloud Quest : Cloud Practitioner", "Le jeu de rôle d’AWS : une ville en 3D, des missions dans une vraie console. Gratuit. Une mission par jour du programme."],
    ["https://skillbuilder.aws/", "AWS Skill Builder : questions officielles", "Cherche « Official Practice Question Set CLF-C02 » : 20 questions officielles gratuites, au format réel."],
    ["https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html", "Guide officiel de l’examen CLF-C02", "La liste exacte des domaines, tâches et services couverts."],
    ["https://github.com/j-mahapatra/aws-certified-cloud-practitioner-clf-c02", "Synthèse GitHub CLF-C02", "Notes résumées par domaine, à lire en complément de la leçon du jour."],
    ["https://towardsthecloud.com/blog/aws-cloud-practitioner-exam-guide", "Guide et erreurs fréquentes", "Conseils de préparation et causes d’échec classiques."],
    ["https://aws.amazon.com/certification/certified-cloud-practitioner/", "Réserver l’examen", "Inscription en ligne ou en centre Pearson VUE, langue française disponible."]
  ];
  return `<header class="head"><p class="eyebrow">À côté du programme</p><h1>Ressources</h1></header>
  <section class="card"><div class="links">${L.map(l => `<a href="${l[0]}" target="_blank" rel="noopener"><b>${l[1]} ↗</b><p>${l[2]}</p><span class="u">${l[0].replace(/^https:\/\//, "").split("/")[0]}</span></a>`).join("")}</div>
  <p class="note" style="margin-top:16px">Les sites qui publient de « vraies » questions d’examen (dumps) vont contre l’accord de certification AWS, qui peut annuler une certification pour ça. Les questions de ce site sont originales et écrites à partir du guide officiel.</p></section>
  <section class="card"><h3>Date de début</h3><p class="sub">Le jour 1 est fixé au ${fmt(dateOf(1), { weekday: "long", day: "numeric", month: "long" })}. Tu peux le déplacer sans perdre tes scores.</p><div class="row"><button class="btn ghost" data-act="start-at" data-n="0">Aujourd’hui</button><button class="btn ghost" data-act="start-at" data-n="1">Demain</button><input class="date" type="date" id="start-date" value="${S.start}" aria-label="Date du jour 1"></div></section>
  <section class="card"><h3>Installer l’application</h3><p class="sub">Le site fonctionne hors ligne après une première visite. Sur téléphone : menu du navigateur, « Ajouter à l’écran d’accueil ». Sur ordinateur : icône d’installation dans la barre d’adresse de Chrome ou Edge.</p></section>`;
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  if (e.target.closest(".skip")) { e.preventDefault(); $("#view").focus(); window.scrollTo(0, 0); }
  if (e.target.closest("[data-nav-more]")) openMore();
  if (e.target.closest("[data-nav-close],#more-sheet a")) closeMore();
  if (e.target === $("#more-sheet")) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeMore(); }
});
document.addEventListener("click", e => {
  const t = e.target.closest("[data-act],[data-set],[data-oi]");
  if (!t) return;
  if (t.dataset.set) { const k = t.dataset.set, v = t.dataset.val; UI[k] = /^\d+$/.test(v) ? +v : v; if (k === "mDeck") MT = null; if (k === "fDeck" || k === "fDir") FL = null; render(); return; }
  if (t.dataset.oi != null) {
    const oi = +t.dataset.oi;
    if (VIEW === "examen" && S.mock) { const id = S.mock.ids[S.mock.i]; S.mock.ans[id] = togglePick(S.mock.ans[id] || [], oi, QBY[id].a.length); save(); drawMock(); }
    else if (QZ && !QZ.checked) { QZ.pick = togglePick(QZ.pick, oi, QZ.list[QZ.i].q.a.length); drawQuiz(); }
    return;
  }
  const a = t.dataset.act, n = +t.dataset.n || 0;
  switch (a) {
    case "quiz-day": quizDay(n); break;
    case "quiz-practice": quizPractice(); break;
    case "quiz-review": quizReview(); break;
    case "check": if (QZ) checkQuiz(); break;
    case "next": if (QZ) nextQuiz(); break;
    case "again": if (AGAIN) AGAIN(); break;
    case "quit": QZ = null; render(); scrollToBox(); break;
    case "mock-start": startMock(); break;
    case "mock-prev": mockGo(-1); break;
    case "mock-next": mockGo(1); break;
    case "mock-goto": if (S.mock) { S.mock.i = +t.dataset.i; save(); drawMock(); } break;
    case "mock-flag": if (S.mock) { const id = S.mock.ids[S.mock.i]; if (S.mock.flag[id]) delete S.mock.flag[id]; else S.mock.flag[id] = true; save(); drawMock(); } break;
    case "mock-nav": UI.showNav = !UI.showNav; drawMock(); break;
    case "mock-ask": UI.confirm = true; UI.showNav = true; drawMock(); break;
    case "mock-cancel": UI.confirm = false; drawMock(); break;
    case "mock-submit": submitMock(); break;
    case "mock-close": LASTMOCK = null; render(); break;
    case "goto-fiches": UI.fDeck = n; FL = null; location.hash = "#fiches"; break;
    case "goto-match": UI.mDeck = n; MT = null; location.hash = "#associer"; break;
    case "fl-start": startFlash(false); break;
    case "fl-cram": startFlash(true); break;
    case "fl-flip": if (FL && !FL.flip) { FL.flip = true; drawFlash(); } break;
    case "fl-know": if (FL) flAnswer(true); break;
    case "fl-again": if (FL) flAnswer(false); break;
    case "fl-done": FL = null; render(); break;
    case "mt-new": newMatch(); drawMatch(); break;
    case "mt-l": matchPick("l", t.dataset.id); break;
    case "mt-r": matchPick("r", t.dataset.id); break;
    case "export": exportData(); break;
    case "reset-ask": UI.resetAsk = true; render(); break;
    case "reset-no": UI.resetAsk = false; render(); break;
    case "reset-yes": S = fresh(); save(); UI.resetAsk = false; render(); toast("Progression effacée"); break;
    case "start-at": setStart(addDays(today(), n)); break;
  }
});
function setStart(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
  S.start = d; save(); render();
  toast("Jour 1 : " + fmt(dateOf(1), { weekday: "long", day: "numeric", month: "long" }));
}
document.addEventListener("change", e => {
  if (e.target.id === "start-date") { setStart(e.target.value); return; }
  const c = e.target.closest("[data-ck]");
  if (c) { if (c.checked) S.checks[c.dataset.ck] = true; else delete S.checks[c.dataset.ck]; touch(); save(); renderSide(); return; }
  if (e.target.id === "imp" && e.target.files[0]) importData(e.target.files[0]);
});
document.addEventListener("keydown", e => {
  const el = e.target;
  if ((el && el.closest && el.closest("input,textarea,select")) || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  if (VIEW === "fiches" && FL && FL.i < FL.q.length) {
    if (k === " " || (k === "Enter" && !FL.flip)) { e.preventDefault(); if (!FL.flip) { FL.flip = true; drawFlash(); } return; }
    if (FL.flip && (k === "1" || k === "2")) { flAnswer(k === "2"); return; }
    if (FL.flip && k === "Enter") { e.preventDefault(); flAnswer(true); return; }
    return;
  }
  const mock = VIEW === "examen" && S.mock;
  if (!mock && !QZ && !(VIEW === "associer" && MT && MT.t1)) return;
  if (k.length === 1) {
    let idx = "12345".indexOf(k); if (idx < 0) idx = "abcde".indexOf(k.toLowerCase());
    if (idx >= 0) {
      if (mock) { const id = S.mock.ids[S.mock.i], ord = S.mock.ord[id]; if (idx < ord.length) { S.mock.ans[id] = togglePick(S.mock.ans[id] || [], ord[idx], QBY[id].a.length); save(); drawMock(); } }
      else if (QZ && !QZ.checked) { const ord = QZ.list[QZ.i].ord; if (idx < ord.length) { QZ.pick = togglePick(QZ.pick, ord[idx], QZ.list[QZ.i].q.a.length); drawQuiz(); } }
      return;
    }
    if (mock && (k === "f" || k === "F")) { const id = S.mock.ids[S.mock.i]; if (S.mock.flag[id]) delete S.mock.flag[id]; else S.mock.flag[id] = true; save(); drawMock(); return; }
  }
  if (mock && k === "ArrowRight") { mockGo(1); return; }
  if (mock && k === "ArrowLeft") { mockGo(-1); return; }
  if (k === "Enter") { const b = $("#box [data-primary]"); if (b && !b.disabled) { e.preventDefault(); b.click(); } }
});
window.addEventListener("hashchange", route);

/* ---------- Démarrage ---------- */
if (S.mock && S.mock.ids.some(id => !QBY[id])) S.mock = null;   // banque modifiée depuis : examen en cours abandonné
route();
setInterval(tick, 1000);
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
