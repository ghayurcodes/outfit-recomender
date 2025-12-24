import React, { useState, useEffect } from "react";
import OutfitCard from "./OutfitCard.jsx";
import { colorFamily, avg, fetchAIScore } from "../utils/outfitUtils.js";

export default function ResultsPanel({ scored, best, onChooseBest, weather, eventType }) {
  const [aiScore, setAiScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset AI score when the recommended outfit changes
  useEffect(() => {
    setAiScore(null);
    setLoading(false);
  }, [best]);

  const handleAskAI = async () => {
    if (!best) return;
    setLoading(true);
    setAiScore(null);
    const score = await fetchAIScore(best.items, weather, eventType);
    setAiScore(score);
    setLoading(false);
  };

  return (
    <div className="results-panel">
      <h3>Recommended</h3>
      {best ? (
        <div className="best">
          <div className="best-top">
            <div className="best-images">
              {best.items.map(it => (
                <div key={it.id}><img src={it.img} alt={it.name} /><div className="small">{it.name}</div></div>
              ))}
            </div>
            <div className="best-meta">
              <div className="big-score">
                <div>
                  <span style={{ fontSize: '0.6em', color: '#888' }}>Alg:</span> {best.score}
                </div>

                {loading && <div style={{ fontSize: '14px', color: '#d946ef', marginTop: '8px' }}>Thinking...</div>}

                {aiScore !== null && (
                  <div style={{ margin: '10px 0px',  display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ color: '#d946ef', fontSize: '24px' }}>
                      <span style={{ fontSize: '0.5em', color: '#d946ef', marginRight: '4px' }}>AI:</span>
                      {aiScore}
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1', maxWidth: '200px', textAlign: 'left', lineHeight: '1.4', marginTop: '4px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '8px' }}>
                      0-10 suitability score based on AI analysis of style patterns & harmony.
                    </div>
                  </div>
                )}

                {!loading && aiScore === null && (
                  <button onClick={handleAskAI} className="ask-ai">
                    Ask AI Estimate
                  </button>
                )}
              </div>
              <button className="choose" onClick={() => onChooseBest(best)}>Use Outfit</button>
            </div>
          </div>
          <div className="explain">
            Formality avg: {Math.round(avg(best.items.map(i => i.formality || 0)) * 10) / 10} ·
            Colors: {Array.from(new Set(best.items.map(i => colorFamily(i.color)))).join(', ')}
          </div>
        </div>
      ) : <div className="small muted">No recommendation yet — run the search.</div>}

      <h4 style={{ marginTop: 18 }}>Top Results</h4>
      <div className="top-list">
        {scored.slice(0, 8).map((o, idx) => (<OutfitCard key={idx} outfit={o} onChoose={() => onChooseBest(o)} />))}
      </div>
    </div>
  );
}
