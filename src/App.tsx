import React, { useState } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState(0);

  const handleTap = () => {
    // هەر کلیکەک دێ ١٠ خالان زێدە کەت (تو دشێی بگۆڕی)
    setPoints(points + 10);
  };

  return (
    <div className="app-container">
      <h1>Onecoin 🪙</h1>
      <div className="score-board">
        <h2>{points.toLocaleString()} Points</h2>
      </div>

      <div className="coin-section">
        <button className="tap-button" onClick={handleTap}>
          <img 
            src="https://img.icons8.com/emoji/256/gold-coin-emoji.png" 
            alt="Onecoin" 
            className="coin-img"
          />
        </button>
      </div>

      <p>کلیکێ ل سەر Onecoin بکە بۆ کۆمکرنا خالان!</p>
    </div>
  );
}

export default App;
