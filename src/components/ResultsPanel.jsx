import React from "react";
import OutfitCard from "./OutfitCard.jsx";
import { colorFamily } from "../utils/outfitUtils.js";
import { avg } from "../utils/outfitUtils.js";

export default function ResultsPanel({ scored, best, onChooseBest }){
  return (
    <div className="results-panel">
      <h3>Recommended</h3>
      {best?(
        <div className="best">
          <div className="best-top">
            <div className="best-images">
              {best.items.map(it=>(
                <div key={it.id}><img src={it.img} alt={it.name} /><div className="small">{it.name}</div></div>
              ))}
            </div>
            <div className="best-meta">
              <div className="big-score">{best.score}</div>
              <button className="choose" onClick={()=>onChooseBest(best)}>Use Outfit</button>
            </div>
          </div>
          <div className="explain">
            Formality avg: {Math.round(avg(best.items.map(i=>i.formality||0))*10)/10} · 
            Colors: {Array.from(new Set(best.items.map(i=>colorFamily(i.color)))).join(', ')}
          </div>
        </div>
      ): <div className="small muted">No recommendation yet — run the search.</div>}

      <h4 style={{marginTop:18}}>Top Results</h4>
      <div className="top-list">
        {scored.splice(0,8).map((o,idx)=>(<OutfitCard key={idx} outfit={o} onChoose={()=>onChooseBest(o)} />))}
      </div>
    </div>
  );
}
