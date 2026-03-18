import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [score, setScore] = useState(37612);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  // وێنەیێ کۆینێ ژ ڤێرە بگۆڕە ئەگەر تە لینکەکێ دی هەبیت
  const coinImg = "https://static.vecteezy.com/system/resources/previews/022/636/301/original/golden-coin-ai-generative-free-png.png";

  const handleTap = (e: React.PointerEvent) => {
    setScore(score + 1);
    const id = Date.now();
    setClicks([...clicks, { id, x: e.clientX, y: e.clientY }]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 600);
  };

  return (
    <div className="main-container">
      {/* بەشێ سەرێ: سکۆر */}
      <div className="top-header">
         <div className="score-box">
            <img src={coinImg} className="score-coin" alt="coin" />
            <span className="score-val">{score.toLocaleString()}</span>
         </div>
         <div className="rank-tag">🏆 Bronze Rank</div>
      </div>

      {/* بەشێ ناڤەڕاستێ: کۆین */}
      <div className="click-area" onPointerDown={handleTap}>
        <img src={coinImg} className="big-coin" alt="Coin" draggable="false" />
        
        {clicks.map((click) => (
          <span 
            key={click.id} 
            className="plus-one" 
            style={{ left: click.x, top: click.y }}
          >
            +1
          </span>
        ))}
      </div>

      {/* بەشێ خوارێ */}
      <div className="bottom-ui">
        <div className="stats">
          <span>⚡ 6465 / 6500</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '95%' }}></div>
        </div>
        <div className="action-btns">
          <button className="btn">🤖 Auto (+10)</button>
          <button className="btn">🚀 Boost</button>
        </div>
      </div>
    </div>
  );
};

export default App;
