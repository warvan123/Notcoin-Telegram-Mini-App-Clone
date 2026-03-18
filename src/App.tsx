import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [score, setScore] = useState(37696);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  // ئەڤە لینکەکێ ئامادە یێ وێنەیێ کۆینێ یە دا ئیتر Error نەیێت
  const coinImg = "https://static.vecteezy.com/system/resources/previews/022/636/301/original/golden-coin-ai-generative-free-png.png";

  const handleTap = (e: React.PointerEvent) => {
    setScore(score + 1);
    
    // گرتنا شوونا دەستی ڕێک ل سەر شاشێ
    const id = Date.now();
    setClicks([...clicks, { id, x: e.clientX, y: e.clientY }]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== id));
    }, 600);
  };

  return (
    <div className="game-screen">
      <div className="top-bar">
        <div className="score-area">
          <img src={coinImg} className="small-coin" alt="icon" />
          <span className="number">{score.toLocaleString()}</span>
        </div>
        <div className="rank">🏆 Bronze Rank</div>
      </div>

      <div className="coin-area" onPointerDown={handleTap}>
        {/* وێنەیێ سەرەکی */}
        <img src={coinImg} className="main-coin" alt="Coin" draggable="false" />
        
        {/* ئەڤ بەشە ناهێلیت وێنە ب لڤیت چونکی Position یێ وێ Fixed ئە */}
        {clicks.map((click) => (
          <span 
            key={click.id} 
            className="plus-one-animation" 
            style={{ left: click.x, top: click.y }}
          >
            +1
          </span>
        ))}
      </div>

      <div className="bottom-bar">
        <div className="energy-text">⚡ 6465 / 6500</div>
        <div className="energy-bg">
          <div className="energy-fill" style={{ width: '95%' }}></div>
        </div>
        <div className="btns">
          <button className="btn">🤖 Auto</button>
          <button className="btn">🚀 Boost</button>
        </div>
      </div>
    </div>
  );
};

export default App;
