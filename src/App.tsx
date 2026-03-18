import React, { useState, useEffect } from 'react';
import './App.css';

// ئەگەر وێنەیێ کۆینێ تە یێ ل فۆڵدەرێ images بیت:
import coinMain from './images/notcoin.png'; 

function App() {
  const [score, setScore] = useState(37696);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setScore((prev) => prev + 1);

    // دروستکرنا +1 ل وێ خالێ کو تە دەست لێدای
    const id = Date.now();
    setClicks((prev) => [...prev, { id, x: clientX, y: clientY }]);

    // لادانا +1 پشتی 0.8 چرکێ دا مۆبایل گران نەبیت
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
    }, 800);
  };

  return (
    <div className="App">
      {/* بەشێ نیشاندانا پارەی (ل سەری) */}
      <div className="header-section">
        <div className="score-container">
          <img src={coinMain} alt="coin-icon" className="score-coin-icon" />
          <h1 className="score-text">{score.toLocaleString()}</h1>
        </div>
        <div className="rank-text">🏆 Bronze Rank</div>
      </div>

      {/* بەشێ کۆینێ (ل ناڤەڕاستێ) */}
      <div className="coin-wrapper" onPointerDown={handlePointerDown}>
        <img 
          src={coinMain} 
          alt="Main Coin" 
          className="main-coin-img" 
          draggable="false"
        />
        
        {/* ئەڤ بەشە ناهێلیت وێنە بچیتە سەری، چونکی +1 ل سەر وێنەی دەردکەڤن */}
        {clicks.map((click) => (
          <div
            key={click.id}
            className="plus-one-float"
            style={{ left: click.x, top: click.y }}
          >
            +1
          </div>
        ))}
      </div>

      {/* بەشێ بارێ خوارێ (Progress Bar) */}
      <div className="footer-section">
        <div className="energy-info">
          ⚡ 6465 / 6500
        </div>
        <div className="progress-bg">
          <div className="progress-fill" style={{ width: '95%' }}></div>
        </div>
        
        <div className="menu-buttons">
          <button className="menu-btn">🤖 Auto (+10)</button>
          <button className="menu-btn">🚀 Boost</button>
        </div>
      </div>
    </div>
  );
}

export default App;
