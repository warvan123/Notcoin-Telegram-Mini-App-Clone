import React, { useState } from 'react';
import './App.css';

// ئاگاداربا: ناڤێ وێنەیێ خۆ لێرە ڕاست بکە (بۆ نموونە ئەگەر د فۆڵدەرێ images دا بیت)
import coinImg from './images/notcoin.png'; 

const App: React.FC = () => {
  const [score, setScore] = useState(37696);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    // ڕێگری ل لڤینا لاپەڕی دکەت (زۆر گرنگە)
    if (e.type === 'touchstart') e.preventDefault();

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    setScore(score + 1);
    const id = Date.now();
    setClicks([...clicks, { id, x: clientX, y: clientY }]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 600);
  };

  return (
    <div className="game-container">
      {/* بەشێ سەرێ: سکۆر */}
      <div className="header">
        <div className="score-wrapper">
          <img src={coinImg} className="mini-coin" alt="coin" />
          <span className="main-score">{score.toLocaleString()}</span>
        </div>
        <div className="rank">🏆 Bronze Rank</div>
      </div>

      {/* بەشێ ناڤەڕاستێ: وێنەیێ کۆینێ */}
      <div className="coin-area" onPointerDown={handleTap}>
        <img src={coinImg} className="the-coin" alt="Main" draggable="false" />
        
        {clicks.map((click) => (
          <span 
            key={click.id} 
            className="tap-number" 
            style={{ left: click.x, top: click.y }}
          >
            +1
          </span>
        ))}
      </div>

      {/* بەشێ خوارێ: بار و بوتۆن */}
      <div className="footer">
        <div className="energy-bar-text">⚡ 6465 / 6500</div>
        <div className="energy-progress">
          <div className="energy-fill" style={{ width: '95%' }}></div>
        </div>
        <div className="bottom-nav">
          <button className="nav-item">🤖 Auto</button>
          <button className="nav-item">🚀 Boost</button>
        </div>
      </div>
    </div>
  );
};

export default App;
