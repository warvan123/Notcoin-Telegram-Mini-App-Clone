import React, { useState } from 'react';
import './App.css';

// ئەز دێ لینکەکێ ئامادە یێ وێنەی دانم دا ئیتر کێشەیا "Image not found" نەمینیت
const coinImg = "https://static.vecteezy.com/system/resources/previews/022/636/301/original/golden-coin-ai-generative-free-png.png";

const App: React.FC = () => {
  const [score, setScore] = useState(37696);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.PointerEvent) => {
    setScore(prev => prev + 1);
    
    const id = Date.now();
    // گرتنا شوونا کلیکێ ڕێک ل سەر شاشێ
    setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);

    // لادانا +1 پشتی نیڤ چرکێ
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 600);
  };

  return (
    <div className="game-container">
      {/* بەشێ سەرێ: سکۆر */}
      <div className="header">
        <div className="score-box">
          <img src={coinImg} className="mini-coin" alt="coin" />
          <h1 className="main-score">{score.toLocaleString()}</h1>
        </div>
        <div className="rank">🏆 Bronze Rank</div>
      </div>

      {/* بەشێ ناڤەڕاستێ: کۆین (ئەڤە ناهێلیت وێنە لڤ لڤێ بکەت) */}
      <div className="coin-area" onPointerDown={handleTap}>
        <img src={coinImg} className="the-coin" alt="Main Coin" draggable="false" />
        
        {clicks.map((click) => (
          <span 
            key={click.id} 
            className="tap-effect" 
            style={{ left: click.x, top: click.y }}
          >
            +1
          </span>
        ))}
      </div>

      {/* بەشێ خوارێ: بار و بوتۆن */}
      <div className="footer">
        <div className="energy-info">⚡ 6465 / 6500</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: '95%' }}></div>
        </div>
        <div className="menu">
          <button className="menu-btn">🤖 Auto</button>
          <button className="menu-btn">🚀 Boost</button>
        </div>
      </div>
    </div>
  );
};

export default App;
