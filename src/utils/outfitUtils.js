import { MANDATORY_CATS, OPTIONAL_CATS } from "../data/wardrobe.js";

// ---------------------
// Helpers
// ---------------------
export function satisfiesWeather(item, weather) {
  
  if (!item.warmth) return true;
  
  //  Special rule for shoes cus you can wear most shoes in any weather
  if (item.cat === "shoes" && weather === "cold") {
    if (item.style?.includes("sport")) return true;
  }
  if (weather === 'hot') return item.warmth === 'light';
  if (weather === 'mild') return item.warmth === 'light' || item.warmth === 'medium';
  if (weather === 'cold') return item.warmth === 'medium' || item.warmth === 'warm';
  return true;
}

export function colorFamily(color) {
  const map = {
    black: 'dark', navy: 'dark', blue: 'blue',
    white: 'neutral', beige: 'warm', brown: 'warm',
    olive: 'warm', grey: 'dark', red: 'warm'
  };
  return map[color] || 'neutral';
}

export function avg(arr) { return arr.reduce((s, x) => s + x, 0) / arr.length; }

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

// ---------------------
// Fuzzy Logic Scoring
// ---------------------

// membership: warmth suitability (0..1)
function muWarmth(weather, warmth) {
  const table = {
    hot: { light: 1.0, medium: 0.25, warm: 0.0 },
    mild: { light: 0.8, medium: 1.0, warm: 0.45 },
    cold: { light: 0.1, medium: 0.75, warm: 1.0 },
  };
  return table[weather]?.[warmth] ?? 0.6;
}

// membership: style suitability (0..1)
function muStyle(event, item) {
  const eventMap = { casual: ['casual', 'street', 'esthetic'], formal: ['smart', 'classic'], sports: ['sport'] };
  const tags = eventMap[event] || [];
  if (!tags.length) return 0.6;
  if (!item.style?.length) return 0.5;

  const hits = item.style.filter(s => tags.includes(s)).length;
  return clamp01(0.35 + 0.65 * (hits / tags.length));
}

// membership: formality fit (0..1)
function muFormality(event, items) {
  if (!items.length) return 0.6;
  const avgForm = items.reduce((s, i) => s + (i.formality || 0), 0) / items.length;
  const target = ({ casual: 0, formal: 2, sports: 0 }[event] ?? 1);
  const diff = Math.abs(avgForm - target);
  return clamp01(1 - diff / 2); // diff 0 => 1, diff 2 => 0
}

// membership: color harmony (0..1)
function muColorHarmony(items) {
  if (items.length <= 1) return 0.8;
  const fams = items.map(i => colorFamily(i.color));
  const counts = {};
  fams.forEach(f => counts[f] = (counts[f] || 0) + 1);
  const distinct = Object.keys(counts).length;

  if (distinct === 1) return 1.0;   // monochrome
  if (distinct === 2) return 0.75;  // coordinated
  if (distinct === 3) return 0.45;  // mixed
  return 0.25;                   // too many families
}

// This is the fuzzy “AI” score used for both search + ranking
export function fuzzyScoreOutfit(items, weather, event) {
  if (!items?.length) return 0;

  const weatherMatch =
    items.reduce((s, it) => s + (it.warmth ? muWarmth(weather, it.warmth) : 0.65), 0) / items.length;

  const styleMatch =
    items.reduce((s, it) => s + muStyle(event, it), 0) / items.length;

  const formalityFit = muFormality(event, items);
  const colorHarmony = muColorHarmony(items);

  // Fuzzy rule aggregation:
  // - event suitability depends on BOTH style + formality (min = fuzzy AND)
  const eventSuitability = Math.min(styleMatch, formalityFit);

  // Defuzzify (weighted average)
  const suitability =
    0.45 * weatherMatch +
    0.35 * eventSuitability +
    0.20 * colorHarmony;

  // convert to a nice 0..10-ish score
  return Math.round(suitability * 100) / 10;
}

// ---------------------
// Beam Search generator (CSP + Beam)
// ---------------------

function buildByCat(availableItems) {
  const byCat = {};
  for (const it of availableItems) {
    (byCat[it.cat] ??= []).push(it);
  }
  return byCat;
}

// Beam search states are partial assignments
// We keep top-B partial outfits at each category depth using fuzzyScoreOutfit
function generateOutfitsBeam(availableItems, weather, event, maxResults) {
  const byCat = buildByCat(availableItems);

  // CSP: mandatory categories must have a non-empty domain
  for (const c of MANDATORY_CATS) {
    if (!byCat[c] || byCat[c].length === 0) return [];
  }

  const order = [...MANDATORY_CATS, ...OPTIONAL_CATS];

  // beam width: make it scale with wardrobe size but keep sane bounds
  const wardrobeSize = availableItems.length;
  const beamWidth = Math.max(30, Math.min(120, Math.floor(wardrobeSize * 2)));

  let beam = [{ idx: 0, items: [] }];
  const start = performance.now();

  for (let idx = 0; idx < order.length; idx++) {
    const cat = order[idx];
    const pool = byCat[cat] || [];
    const next = [];

    for (const state of beam) {
      // optional skip branch
      if (OPTIONAL_CATS.includes(cat)) {
        next.push({ idx: idx + 1, items: state.items });
      }

      for (const it of pool) {
        // CSP pruning early for mandatory categories: weather feasibility
        if (MANDATORY_CATS.includes(cat) && it.warmth && !satisfiesWeather(it, weather)) continue;

        // prevent duplicates (rare but safe)
        if (state.items.includes(it)) continue;

        next.push({ idx: idx + 1, items: state.items.concat(it) });
      }
    }

    if (next.length === 0) return [];

    // Heuristic-guided pruning (this is the "beam search" part)
    next.sort((a, b) => fuzzyScoreOutfit(b.items, weather, event) - fuzzyScoreOutfit(a.items, weather, event));
    beam = next.slice(0, beamWidth);
  }

  // Final CSP validation + collect results
  const results = [];
  for (const state of beam) {
    if (results.length >= maxResults) break;

    const chosen = state.items;
    const catsChosen = new Set(chosen.map(i => i.cat));
    const hasAllMandatory = MANDATORY_CATS.every(c => catsChosen.has(c));
    if (!hasAllMandatory) continue;

    const mandatoryWeatherOK = chosen
      .filter(i => MANDATORY_CATS.includes(i.cat))
      .every(i => !i.warmth || satisfiesWeather(i, weather));
    if (!mandatoryWeatherOK) continue;

    results.push({ items: chosen, time: performance.now() - start });
  }

  return results;
}

// ---------------------
// Public API (UI unchanged)
// ---------------------

// Keep the same signature as before
export function generateOutfits(availableItems, weather, event, maxResults = 2000) {
  // default engine = CSP + Beam Search
  return generateOutfitsBeam(availableItems, weather, event, maxResults);
}

// Keep old crisp score available if you want it for debugging/compare (optional)
export function scoreOutfit(items, weather, event) {
  // You can remove this if you don't need it anymore,
  // but leaving it keeps compatibility with anything else importing it.
  let score = 0;

  items.forEach(it => {
    if (it.warmth) {
      if (weather === 'hot' && it.warmth === 'light') score += 1;
      if (weather === 'mild' && (it.warmth === 'light' || it.warmth === 'medium')) score += 1;
      if (weather === 'cold' && (it.warmth === 'medium' || it.warmth === 'warm')) score += 1;
    }
  });

  const eventMap = { casual: ['casual', 'street', 'esthetic'], formal: ['smart', 'classic'], sports: ['sport'] };
  const tags = eventMap[event] || [];
  let styleMatches = 0;
  items.forEach(it => {
    if (it.style) styleMatches += it.style.some(s => tags.includes(s)) ? 1 : 0.5;
  });
  score += styleMatches * 1.5;

  const fams = items.map(i => colorFamily(i.color));
  const famCounts = {};
  fams.forEach(f => famCounts[f] = (famCounts[f] || 0) + 1);
  const distinctFams = Object.keys(famCounts).length;
  if (distinctFams === 1) score += 2;
  else if (distinctFams === 2) score += 0.8;

  const avgForm = avg(items.map(i => i.formality || 0));
  const eventForm = { casual: 0, formal: 2, sports: 0 }[event] ?? 1;
  score += Math.max(0, 2 - Math.abs(avgForm - eventForm));

  if (items.every(it => !it.warmth || satisfiesWeather(it, weather))) score += 0.8;
  if (event === 'sports' && items.some(it => it.style && it.style.includes('sport'))) score += 1;

  return Math.round(score * 10) / 10;
}

// Rank now uses fuzzy score by default (no UI change)
export function rankOutfits(results, weather, event) {
  const scored = results.map(r => ({
    items: r.items,
    score: fuzzyScoreOutfit(r.items, weather, event),
    time: r.time
  }));
  scored.sort((a, b) => b.score - a.score || a.time - b.time);
  return scored;
}
