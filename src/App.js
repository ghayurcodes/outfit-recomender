import React, { useState, useMemo } from "react";
import Header from "./components/Header.jsx";
import Controls from "./components/Controls.jsx";
import ResultsPanel from "./components/ResultsPanel.jsx";
import './App.css';
import { WARDROBE, MANDATORY_CATS } from "./data/wardrobe.js";
import { generateOutfits, rankOutfits, avg } from "./utils/outfitUtils.js";
import Galaxy from "./UIcomponents/Galaxy.jsx"

export default function App() {
  const [weather, setWeather] = useState('mild');
  const [eventType, setEventType] = useState('casual');
  const [selectedIds, setSelectedIds] = useState(new Set(WARDROBE.map(i => i.id)));
  const [scored, setScored] = useState([]);
  const [best, setBest] = useState(null);
  const [stats, setStats] = useState({ searchTime: 0, topScore: 0, avgTop5: 0 });

  const toggleItem = id => { setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };

  const runSearch = () => {
    const available = WARDROBE.filter(i => selectedIds.has(i.id));
    const t0 = performance.now();
    const results = generateOutfits(available, weather, eventType, 3000);
    const t1 = performance.now();

    const ranked = rankOutfits(results, weather, eventType);
    const topScore = ranked[0]?.score ?? 0;
    const top5 = ranked.slice(0, 5);
    const avgTop5 = top5.length ? Math.round(avg(top5.map(o => o.score)) * 10) / 10 : 0;
    
    setScored(ranked);
    setBest(ranked[0] || null);
    setStats({
      searchTime: Math.round(t1 - t0), found: results.length, topScore, avgTop5 });
  };

  const chooseBest = o => { alert("You picked: " + o.items.map(i => i.name).join(' + ')); };
  const initial = useMemo(() => ({ count: WARDROBE.length }), []);



    return (
    <>
     
      <div className="app-wrap">
        <div className="card">
          <Header />
          <div className="layout">
            <Controls
              weather={weather} setWeather={setWeather}
              eventType={eventType} setEventType={setEventType}
              selectedIds={selectedIds} toggleItem={toggleItem} run={runSearch} />
            <div className="results-area">
              <ResultsPanel scored={scored} best={best} onChooseBest={chooseBest} />
              <div className="footer-stats">
                <div>Items available: <strong>{initial.count}</strong></div>
                <div>Search time: <strong>{stats.searchTime}ms</strong></div>
                  <div>Found: <strong>{stats.found}</strong></div>
                  <div>Top score: <strong>{stats.topScore}</strong></div>
                  <div>Avg Top-5: <strong>{stats.avgTop5}</strong></div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
