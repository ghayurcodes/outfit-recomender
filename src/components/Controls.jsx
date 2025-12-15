import React from "react";
import { WARDROBE } from "../data/wardrobe.js";

export default function Controls({ weather, setWeather, eventType, setEventType, selectedIds, toggleItem, run }){
  return (
    <div className="controls">
      <div className="control-row">
        <label>Weather</label>
        <select className="styled-select" value={weather} onChange={e=>setWeather(e.target.value)}>
          <option value="hot">Hot</option>
          <option value="mild">Mild</option>
          <option value="cold">Cold</option>
        </select>
      </div>
      <div className="control-row">
        <label>Event</label>
        <select className="styled-select" value={eventType} onChange={e=>setEventType(e.target.value)}>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      <button className="run-btn" onClick={run}>Find Best Outfit</button>


      <div className="wardrobe-chooser">
        <div className="wardrobe-title">Available Clothes</div>
        <div className="wardrobe-grid">
          {WARDROBE.map(item=>(
            <label key={item.id} className={`wardrobe-item ${selectedIds.has(item.id)?'active':''}`}>
              <input type="checkbox" checked={selectedIds.has(item.id)} onChange={()=>toggleItem(item.id)}  className="chkbox"/>
              <img src={item.img} alt={item.name} />
              <div className="meta">
                <div className="name">{item.name}</div>
                <div className="small">{item.cat} • {item.color}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
