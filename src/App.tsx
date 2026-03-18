import React, { useState } from 'react';
import './App.css';

// لینکێن وێنەیان دا Error نەیێت
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
          <div className="score-section">
            <div className="score-flex">
              <img src={coinImg} className="mini-coin" alt="coin" />
              <span className="main-number">{score.toLocaleString()}</span>
            </div>
            <div className="rank-text">🏆 Bronze Rank</div>
          </div>

          <div className="coin-tap-area" onPointerDown={handleTap}>
            <img src={coinImg} className="big-coin-render" alt="Coin" draggable="false" />
            {clicks.map((click) => (
              <span key={click.id} className="plus-animation" style={{ left: click.x, top: click.y }}>
                +1
              </span>
            ))}
          </div>

          <div className="energy-container">
            <div className="energy-info">
              <img src={highVoltage} width={16} alt="energy" /> 
              <span className="energy-val">{energy} / 6500</span>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${(energy/6500) * 100}%` }}></div>
            </div>
          </div>
        </>
      )}

      <div className="nav-bar">
        <button onClick={() => setActiveTab('game')} className={`nav-item ${activeTab === 'game' ? 'active' : ''}`}>🎮<span>Game</span></button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}>📋<span>Tasks</span></button>
        <button onClick={() => setActiveTab('invite')} className={`nav-item ${activeTab === 'invite' ? 'active' : ''}`}>👥<span>Invite</span></button>
        <button onClick={() => setActiveTab('wallet')} className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}>💰<span>Wallet</span></button>
      </div>
    </div>
  );
}

export default App;
