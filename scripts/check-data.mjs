// Vérifie la banque de questions et les fiches : identifiants uniques, réponses valides, pas de tiret cadratin.
// Usage : node scripts/check-data.mjs
import { readFileSync } from "node:fs";
import vm from "node:vm";

const ctx = { window: {} };
for (const f of ["data/days.js", "data/questions.js", "data/cards.js"]) vm.runInNewContext(readFileSync(f, "utf8"), ctx, { filename: f });
const { DAYS, QUESTIONS, CARDS } = ctx.window;
const errors = [];

const ids = new Set();
for (const q of QUESTIONS) {
  if (ids.has(q.id)) errors.push(`id en double : ${q.id}`);
  ids.add(q.id);
  if (!(q.d >= 1 && q.d <= 6)) errors.push(`${q.id} : jour invalide`);
  if (!Array.isArray(q.o) || q.o.length < 3 || q.o.length > 5) errors.push(`${q.id} : il faut 3 à 5 options`);
  if (!q.a.length || q.a.some(i => i < 0 || i >= q.o.length)) errors.push(`${q.id} : index de réponse invalide`);
  if (new Set(q.a).size !== q.a.length) errors.push(`${q.id} : réponse en double`);
  if (!q.x) errors.push(`${q.id} : explication manquante`);
}
const names = new Set();
for (const c of CARDS) { if (names.has(c.n)) errors.push(`fiche en double : ${c.n}`); names.add(c.n); }
const perDom = { 1: 0, 2: 0, 3: 0, 4: 0 }, map = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4 };
QUESTIONS.forEach(q => perDom[map[q.d]]++);
const need = { 1: 16, 2: 19, 3: 22, 4: 8 };
for (const d in need) if (perDom[d] < need[d]) errors.push(`domaine ${d} : ${perDom[d]} questions, il en faut ${need[d]} pour l'examen blanc`);
for (const f of ["data/days.js", "data/questions.js", "data/cards.js", "index.html", "assets/app.js", "README.md"]) {
  if (/[—–]/.test(readFileSync(f, "utf8"))) errors.push(`${f} : contient un tiret cadratin ou demi-cadratin`);
}
if (DAYS.length !== 7) errors.push("il faut 7 jours");

console.log(`${QUESTIONS.length} questions, ${CARDS.length} fiches, par domaine : ${JSON.stringify(perDom)}`);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("OK");
