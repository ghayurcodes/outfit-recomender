import { MANDATORY_CATS, OPTIONAL_CATS } from "../data/wardrobe.js";

export function colorFamily(color) {
  const map = { black:'dark', navy:'dark', blue:'blue', white:'neutral', beige:'warm', brown:'warm', olive:'warm', grey:'dark', red:'warm' };
  return map[color] || 'neutral';
}

export function avg(arr){ return arr.reduce((s,x)=>s+x,0)/arr.length; }

// ---------------------
// Generate outfits (DFS / backtracking)
// ---------------------
export function generateOutfits(availableItems, weather, event, maxResults = 2000){
  const byCat = {};
  availableItems.forEach(it=>{
    byCat[it.cat] = byCat[it.cat]||[];
    byCat[it.cat].push(it);
  });

  // If any mandatory category is missing, return empty
  for(const c of MANDATORY_CATS) if(!byCat[c] || byCat[c].length===0) return [];

  const order = [...MANDATORY_CATS, ...OPTIONAL_CATS];
  const results = [];
  const start = performance.now();

  function satisfiesWeather(item, weather){
    if(!item.warmth) return true;
    if(weather==='hot') return item.warmth==='light';
    if(weather==='mild') return item.warmth==='light'||item.warmth==='medium';
    if(weather==='cold') return item.warmth==='medium'||item.warmth==='warm';
    return true;
  }

  // Relaxed event scoring: partial credit for modern/sport/esthetic items
  function eventMatchScore(item, event){
    if(!item.style) return 1; // neutral
    const map = { casual:['casual','street','esthetic'], formal:['smart','classic'], sports:['sport'] };
    const tags = map[event] || [];
    const match = item.style.some(s => tags.includes(s));
    return match ? 1 : 0.5; // partial credit
  }

  function dfs(idx, current){
    if(results.length >= maxResults) return;
    if(idx >= order.length){
      const chosen = current.slice();
      const mandatory = chosen.filter(i=>MANDATORY_CATS.includes(i.cat));
      const weatherOK = mandatory.filter(i=>satisfiesWeather(i,weather)).length >= Math.ceil(mandatory.length/2);
      if(!weatherOK) return;

      results.push({items: chosen, time: performance.now()-start});
      return;
    }

    const cat = order[idx];
    const pool = byCat[cat] || [];

    // Optional items: try skipping first
    if(OPTIONAL_CATS.includes(cat)) dfs(idx+1, current);

    for(const it of pool){
      current.push(it);
      dfs(idx+1, current);
      current.pop();
      if(results.length >= maxResults) break;
    }
  }

  dfs(0, []);
  return results;
}

// ---------------------
// Heuristic scoring (updated for modern/sport items)
// ---------------------
export function scoreOutfit(items, weather, event){
  let score = 0;

  // Weather match
  items.forEach(it=>{
    if(it.warmth){
      if(weather==='hot' && it.warmth==='light') score+=1;
      if(weather==='mild' && (it.warmth==='light'||it.warmth==='medium')) score+=1;
      if(weather==='cold' && (it.warmth==='medium'||it.warmth==='warm')) score+=1;
    }
  });

  // Event/style match with partial credit for modern/esthetic/sport items
  const eventMap = { 
    casual:['casual','street','esthetic'], 
    formal:['smart','classic'], 
    sports:['sport'] 
  };
  const eventTags = eventMap[event] || [];
  let styleMatches = 0;
  items.forEach(it=>{
    if(it.style){
      const match = it.style.some(s=>eventTags.includes(s));
      styleMatches += match ? 1 : 0.5;
    }
  });
  score += styleMatches * 1.5;

  // Color family cohesion
  const fams = items.map(i=>colorFamily(i.color));
  const famCounts = {};
  fams.forEach(f => famCounts[f] = (famCounts[f]||0)+1);
  const distinctFams = Object.keys(famCounts).length;
  if(distinctFams===1) score+=2.0;
  else if(distinctFams===2) score+=0.8;

  // Formality closeness
  const eventForm = { casual:0, formal:2, sports:0 }[event] ?? 1;
  const avgForm = avg(items.map(i=>i.formality||0));
  score += Math.max(0, 2 - Math.abs(avgForm - eventForm));

  // Bonus if all items support weather
  if(items.every(it=>{
    if(!it.warmth) return true;
    if(weather==='hot') return it.warmth==='light';
    if(weather==='mild') return it.warmth==='light'||it.warmth==='medium';
    if(weather==='cold') return it.warmth==='medium'||it.warmth==='warm';
  })) score += 0.8;

  // Additional bonus for sports outfits if event is sports
  if(event==='sports' && items.some(it=>it.style && it.style.includes('sport'))) score += 1.0;

  return Math.round(score*10)/10;
}

// ---------------------
// Ranking
// ---------------------
export function rankOutfits(results, weather, event){
  const scored = results.map(r => ({ items: r.items, score: scoreOutfit(r.items, weather, event), time: r.time }));
  scored.sort((a,b) => b.score - a.score || a.time - b.time);
  return scored;
}
