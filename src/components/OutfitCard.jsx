import React from "react";

export default function OutfitCard({ outfit, onChoose }){
  return (
    <div className="outfit-card">
      <div className="outfit-images">
        {outfit.items.map(it=>(
          <div key={it.id} className="part">
            <img src={it.img} alt={it.name} />
            <div className="pname">{it.name}</div>
          </div>
        ))}
      </div>
      <div className="outfit-info">
        <div className="score">Score: <strong>{outfit.score}</strong></div>
        <button className="choose" onClick={()=>onChoose(outfit)}>Choose</button>
      </div>
    </div>
  );
}
