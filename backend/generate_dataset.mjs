import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_FILE = path.join(__dirname, 'dataset.csv');

// --- WARDROBE DATA (Copied from src/data/wardrobe.js) ---
const WARDROBE = [
    { id: "t1", cat: "top", name: "White Tee", color: "white", style: ["casual", "street"], warmth: "light", formality: 0 },
    { id: "t2", cat: "top", name: "Formal Shirt", color: "white", style: ["smart", "classic"], warmth: "light", formality: 2 },
    { id: "t3", cat: "top", name: "Winter Sweater", color: "navy", style: ["casual", "smart"], warmth: "warm", formality: 1 },
    { id: "t4", cat: "top", name: "Minimalist Hoodie", color: "grey", style: ["casual", "street"], warmth: "medium", formality: 0 },
    { id: "t5", cat: "top", name: "Crop Tee", color: "white", style: ["casual", "esthetic"], warmth: "light", formality: 0 },
    { id: "t6", cat: "top", name: "Sports Jersey", color: "red", style: ["sport", "casual"], warmth: "light", formality: 0 },
    { id: "t7", cat: "top", name: "Polo Shirt", color: "navy", style: ["smart", "casual"], warmth: "light", formality: 1 },
    { id: "t8", cat: "top", name: "Denim Jacket Shirt", color: "blue", style: ["street", "casual"], warmth: "medium", formality: 0 },
    { id: "t9", cat: "top", name: "Turtleneck", color: "black", style: ["smart", "classic"], warmth: "warm", formality: 1 },
    { id: "t10", cat: "top", name: "Blazer", color: "navy", style: ["smart", "classic"], warmth: "medium", formality: 2 },
    { id: "b1", cat: "bottom", name: "Blue Jeans", color: "blue", style: ["casual", "street"], warmth: "medium", formality: 0 },
    { id: "b2", cat: "bottom", name: "Chinos", color: "beige", style: ["smart", "casual"], warmth: "medium", formality: 1 },
    { id: "b3", cat: "bottom", name: "Dark Trousers", color: "black", style: ["smart", "classic"], warmth: "medium", formality: 2 },
    { id: "b4", cat: "bottom", name: "Ripped Jeans", color: "blue", style: ["casual", "street"], warmth: "medium", formality: 0 },
    { id: "b5", cat: "bottom", name: "Cargo Pants", color: "olive", style: ["casual", "street", "esthetic", "outdoor"], warmth: "medium", formality: 0 },
    { id: "b6", cat: "bottom", name: "Track Pants", color: "black", style: ["sport", "casual"], warmth: "light", formality: 0 },
    { id: "b7", cat: "bottom", name: "Grey Dress Pants", color: "grey", style: ["smart", "classic"], warmth: "medium", formality: 2 },
    { id: "b8", cat: "bottom", name: "Black Shorts", color: "black", style: ["casual", "sport"], warmth: "light", formality: 0 },
    { id: "s1", cat: "shoes", name: "White Sneakers", color: "white", style: ["casual", "street"], warmth: "light", formality: 0 },
    { id: "s2", cat: "shoes", name: "Brown Oxfords", color: "brown", style: ["smart", "classic"], warmth: "medium", formality: 2 },
    { id: "s3", cat: "shoes", name: "Boots", color: "brown", style: ["casual", "outdoor"], warmth: "warm", formality: 1 },
    { id: "s4", cat: "shoes", name: "Running Sneakers", color: "white", style: ["sport", "casual"], warmth: "light", formality: 0 },
    { id: "s5", cat: "shoes", name: "High-top Sneakers", color: "black", style: ["casual", "street", "esthetic"], warmth: "light", formality: 0 },
    { id: "s6", cat: "shoes", name: "Football Cleats", color: "black", style: ["sport", "outdoor"], warmth: "light", formality: 0 },
    { id: "s7", cat: "shoes", name: "Black Loafers", color: "black", style: ["smart", "classic"], warmth: "medium", formality: 2 },
    { id: "s8", cat: "shoes", name: "Slides / Sandals", color: "black", style: ["casual", "sport", "street", "outdoor"], warmth: "light", formality: 0 },
    { id: "o1", cat: "outer", name: "Light Jacket", color: "olive", style: ["casual", "smart"], warmth: "medium", formality: 1 },
    { id: "o2", cat: "outer", name: "Overcoat", color: "black", style: ["smart", "classic"], warmth: "warm", formality: 2 },
    { id: "o3", cat: "outer", name: "Bomber Jacket", color: "black", style: ["casual", "street", "esthetic"], warmth: "medium", formality: 0 },
    { id: "o4", cat: "outer", name: "Windbreaker", color: "blue", style: ["sport", "casual", "outdoor"], warmth: "warm", formality: 0 },
    { id: "o5", cat: "outer", name: "Denim Jacket", color: "blue", style: ["street", "casual"], warmth: "medium", formality: 0 },
    { id: "o6", cat: "outer", name: "Puffer Jacket", color: "black", style: ["casual", "street"], warmth: "warm", formality: 0 }
];

// --- LOGIC (Copied/Adapted from src/utils/outfitUtils.js) ---

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

function colorFamily(color) {
    const map = {
        black: 'dark', navy: 'dark', blue: 'blue',
        white: 'neutral', beige: 'warm', brown: 'warm',
        olive: 'warm', grey: 'dark', red: 'warm'
    };
    return map[color] || 'neutral';
}

function muWarmth(weather, warmth) {
    const table = {
        hot: { light: 1.0, medium: 0.25, warm: 0.0 },
        mild: { light: 0.8, medium: 1.0, warm: 0.45 },
        cold: { light: 0.1, medium: 0.75, warm: 1.0 },
    };
    return table[weather]?.[warmth] ?? 0.6;
}

function muStyle(event, item) {
    const eventMap = {
        casual: ['casual', 'street', 'esthetic', 'outdoor'],
        formal: ['smart', 'classic'],
        sports: ['sport']
    };
    const tags = eventMap[event] || [];
    if (!tags.length) return 0.6;
    if (!item.style?.length) return 0.5;

    const hits = item.style.filter(s => tags.includes(s)).length;

    // STRICT MODE for sports
    if (event === 'sports') {
        if (!item.style.includes('sport')) {
            return 0.1;
        }
        return 1.0;
    }

    return clamp01(0.35 + 0.65 * (hits / tags.length));
}

function muFormality(event, items) {
    if (!items.length) return 0.6;
    const avgForm = items.reduce((s, i) => s + (i.formality || 0), 0) / items.length;
    const target = ({ casual: 0, formal: 2, sports: 0 }[event] ?? 1);
    const diff = Math.abs(avgForm - target);
    return clamp01(1 - diff / 2);
}

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

function fuzzyScoreOutfit(items, weather, event) {
    if (!items?.length) return 0;

    const weatherMatch =
        items.reduce((s, it) => s + (it.warmth ? muWarmth(weather, it.warmth) : 0.65), 0) / items.length;

    const styleMatch =
        items.reduce((s, it) => s + muStyle(event, it), 0) / items.length;

    const formalityFit = muFormality(event, items);
    const colorHarmony = muColorHarmony(items);

    const eventSuitability = Math.min(styleMatch, formalityFit);

    const suitability =
        0.45 * weatherMatch +
        0.35 * eventSuitability +
        0.20 * colorHarmony;

    return Math.round(suitability * 100) / 10;
}

// --- GENERATOR ---

const WEATHERS = ['hot', 'mild', 'cold'];
const EVENTS = ['casual', 'formal', 'sports'];
const NUM_SAMPLES = 5000;

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getItemsByCategory(cat) {
    return WARDROBE.filter(i => i.cat === cat);
}

function getStyle(item) {
    return item && item.style && item.style.length > 0 ? item.style[0] : 'none';
}

function generate() {
    console.log(`Generating ${NUM_SAMPLES} samples...`);

    // Headers matching Python expectation
    const headers = [
        'weather', 'event',
        'top_color', 'top_substyle', 'top_warmth', 'top_formality',
        'bottom_color', 'bottom_substyle', 'bottom_warmth', 'bottom_formality',
        'shoes_color', 'shoes_substyle', 'shoes_warmth', 'shoes_formality',
        'outer_color', 'outer_substyle', 'outer_warmth', 'outer_formality',
        'score'
    ];

    const lines = [headers.join(',')];

    for (let i = 0; i < NUM_SAMPLES; i++) {
        const weather = getRandomItem(WEATHERS);
        const event = getRandomItem(EVENTS);

        const top = getRandomItem(getItemsByCategory('top'));
        const bottom = getRandomItem(getItemsByCategory('bottom'));
        const shoes = getRandomItem(getItemsByCategory('shoes'));
        const hasOuter = Math.random() > 0.5;
        const outer = hasOuter ? getRandomItem(getItemsByCategory('outer')) : null;

        const items = [top, bottom, shoes];
        if (outer) items.push(outer);

        const score = fuzzyScoreOutfit(items, weather, event);

        const row = [
            weather, event,
            top.color, getStyle(top), top.warmth || 'none', top.formality || 0,
            bottom.color, getStyle(bottom), bottom.warmth || 'none', bottom.formality || 0,
            shoes.color, getStyle(shoes), shoes.warmth || 'none', shoes.formality || 0,
            outer ? outer.color : 'none', outer ? getStyle(outer) : 'none', outer ? outer.warmth : 'none', outer ? outer.formality : 0,
            score
        ];
        lines.push(row.join(','));
    }

    fs.writeFileSync(OUTPUT_FILE, lines.join('\n'));
    console.log(`Done. Saved to ${OUTPUT_FILE}`);
}

generate();
