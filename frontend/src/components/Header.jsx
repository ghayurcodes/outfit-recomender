import React from "react";
import GlitchText from "../UIcomponents/Glitch";

export default function Header() {
    return (
        <header className="so-header">
           
                <GlitchText
                    speed={3}
                    enableShadows={true}
                    enableOnHover={false}
                    
                >
                    Outfit-Recommender
                </GlitchText>
           
            <p className="muted">Based on: CSP + Beam Search + Fuzzy Logic</p>
        </header>
    );
}
