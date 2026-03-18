import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

function App() {
  const [activeTab, setActiveTab] = useState('game'); // بۆ گوهۆڕینا لاپەڕان
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [energy, setEnergy] = useState(() => Number(localStorage.getItem('energy')) || 6500);
  const [autoLevel, setAutoLevel] = useState(() => Number(localStorage.getItem('autoLevel')) || 0);
  const [isBoost, setIsBoost] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
  }, [points, energy, autoLevel]);

  // سیستەمێ ئۆتۆ-کلیک
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) setPoints(prev => prev + autoLevel);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0 || activeTab !== 'game') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints(prev => prev + (isBoost ? 5 : 1));
    setEnergy(prev => Math.max(0, prev - 1));
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none text-white">
      
      {/* --- پشکا سەرەکی یا یاریێ --- */}
      {activeTab === 'game' && (
        <>
          <div className="mt-10 text-center z-20">
            <div className="text-5xl font-bold flex items-center justify-center">
              <img src={coin} width={45} alt="coin" />
              <span className="ml-2 font-mono">{points.toLocaleString()}</span>
            </div>
            <div className="text-white/90 font-bold mt-2 flex items-center justify-center gap-2">
              <img src={trophy} width={20} alt="rank" />
              <span>{points > 5000 ? "Silver" : "Bronze"} Rank</span>
              {isBoost && <img src={rocket} width={22} className="animate-bounce" />}
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center w-full">
            <div className="relative coin-wrapper touch-none" onClick={handleClick}>
              <img src={onecoin} width={240} className="main-coin" alt="clicker" />
              {clicks.map(click => (
                <div key={click.id} className="floating-num" style={{ left: click.x, top: click.y }} onAnimationEnd={() => setClicks(prev => prev.filter(c => c.id !== click.id))}>
                  +{isBoost ? 5 : 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mb-32 z-20">
            <button onClick={() => points >= 100 && (setPoints(p=>p-100), setAutoLevel(a=>a+1))} className="btn-action">🤖 Auto (+{autoLevel})</button>
            <button onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} className={`btn-action ${isBoost ? 'bg-orange-600' : ''}`}>🚀 5X Boost</button>
          </div>
        </>
      )}

      {/* --- پشکا Invite (بەشێ نوی) --- */}
      {activeTab === 'invite' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Invite Friends! 👥</h1>
          <p className="opacity-80 mb-8">Invite your friends and get 5,000 coins for each one!</p>
          <div className="bg-white/10 p-6 rounded-3xl w-full border border-white/20">
            <p className="text-sm opacity-60 mb-2">Your Invite Link:</p>
            <code className="bg-black/20 p-2 rounded block mb-4">t.me/your_bot?start=123</code>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-2xl w-full">Copy Link</button>
          </div>
        </div>
      )}

      {/* --- Navigation Bar (پێنج بەش ل خوارێ) --- */}
      <div className="fixed bottom-0 w-full bg-black/40 backdrop-blur-lg flex justify-around items-center py-4 border-t border-white/10 z-50">
        <button onClick={() => setActiveTab('game')} className={`flex flex-col items-center ${activeTab === 'game' ? 'text-blue-400' : 'opacity-50'}`}>
          <span className="text-xl">🎮</span><span className="text-xs">Game</span>
        </button>
        <button onClick={() => setActiveTab('tasks')} className="flex flex-col items-center opacity-50">
          <span className="text-xl">📋</span><span className="text-xs">Tasks</span>
        </button>
        <button onClick={() => setActiveTab('invite')} className={`flex flex-col items-center ${activeTab === 'invite' ? 'text-blue-400' : 'opacity-50'}`}>
          <span className="text-xl">👥</span><span className="text-xs">Invite</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className="flex flex-col items-center opacity-50">
          <span className="text-xl">💰</span><span className="text-xs">Wallet</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className="flex flex-col items-center opacity-50">
          <span className="text-xl">📊</span><span className="text-xs">Stats</span>
        </button>
      </div>

      {/* بارا وزەی (تەنێ د لاپەڕێ یاریێ دا) */}
      {activeTab === 'game' && (
        <div className="fixed bottom-24 w-full px-10">
          <div className="flex items-center mb-1 text-xs">
            <img src={highVoltage} width={15} /> <span className="ml-1">{energy} / 6500</span>
          </div>
          <div className="w-full bg-black/30 h-2 rounded-full border border-white/10 overflow-hidden">
            <div className="bg-white h-full transition-all" style={{ width: `${(energy/6500) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
