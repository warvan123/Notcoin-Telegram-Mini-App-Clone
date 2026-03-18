import React, { useState } from 'react';
import './App.css';

// لینکێن ئامادە یێن وێنەیان دا ئیتر Error نەمینیت
const coinImg = "https://static.vecteezy.com/system/resources/previews/022/636/301/original/golden-coin-ai-generative-free-png.png";
const highVoltage = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/High_voltage_warning_symbol.svg/1024px-High_voltage_warning_symbol.svg.png";

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [energy, setEnergy] = useState(6465);
  const [score, setScore] = useState(37707);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleTap = (e: React.PointerEvent) => {
    if (activeTab !== 'game' || energy <= 0) return;

    setScore(prev => prev + 1);
    setEnergy(prev => Math.max(0, prev - 1));

    const id = Date.now();
    setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);

    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 600);
  };

  return (
    <div className="game-wrapper">
      {activeTab === 'game' && (
        <>
          <div className="score-header">
            <div className="score-container">
              <img src={coinImg} className="score-coin-img" alt="coin" />
              <span className="score-number">{score.toLocaleString()}</span>
            </div>
            <div className="rank-info">🏆 Bronze Rank</div>
          </div>

          <div className="coin-interaction-area" onPointerDown={handleTap}>
            <img src={coinImg} className="main-render-coin" alt="Coin" draggable="false" />
            {clicks.map((click) => (
              <span key={click.id} className="floating-plus" style={{ left: click.x, top: click.y }}>
                +1
              </span>
            ))}
          </div>

          <div className="energy-section">
            <div className="energy-label">
              <img src={highVoltage} width={18} alt="energy" /> 
              <span className="ml-1 font-mono">{energy} / 6500</span>
            </div>
            <div className="energy-bar-bg">
              <div className="energy-bar-fill" style={{ width: `${(energy/6500) * 100}%` }}></div>
            </div>
          </div>
        </>
      )}

      <div className="bottom-nav-bar">
        <button onClick={() => setActiveTab('game')} className={`nav-item ${activeTab === 'game' ? 'active' : ''}`}>
          🎮<span className="nav-text">Game</span>
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}>
          📋<span className="nav-text">Tasks</span>
        </button>
        <button onClick={() => setActiveTab('invite')} className={`nav-item ${activeTab === 'invite' ? 'active' : ''}`}>
          👥<span className="nav-text">Invite</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}>
          💰<span className="nav-text">Wallet</span>
        </button>
      </div>
    </div>
  );
}

export default App;
