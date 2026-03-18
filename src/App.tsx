import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

function App() {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(6500);
  const [autoLevel, setAutoLevel] = useState(0);
  const [isBoost, setIsBoost] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

  // 1. سیستەمێ Auto-Clicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) {
        setPoints(prevPoints => prevPoints + autoLevel);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  // 2. سیستەمێ ئاست و ناڤان (Level System)
  const getRank = () => {
    if (points < 5000) return { name: "Bronze", color: "#cd7f32" };
    if (points < 20000) return { name: "Silver", color: "#c0c0c0" };
    return { name: "Gold", color: "#ffd700" };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (energy <= 0) return;
    
    const pointsToAdd = isBoost ? 5 : 1;
    setPoints(points + pointsToAdd);
    setEnergy(energy - 1);

    // 4. ئەنیمەیشنا ژماران (Floating Points)
    setClicks([...clicks, { id: Date.now(), x: e.clientX, y: e.clientY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  return (
    <div className="bg-gradient-main">
      <div className="mt-12 text-center">
        <div className="text-5xl font-bold flex items-center justify-center">
          <img src={coin} width={45} alt="coin" />
          <span className="ml-2 text-white">{points.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-center mt-2" style={{ color: getRank().color }}>
          <img src={trophy} width={20} alt="trophy" />
          <span className="ml-2 font-bold">{getRank().name} Rank</span>
          {isBoost && <img src={rocket} width={20} className="ml-2" alt="rocket" />}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center relative">
        <div className="relative" onClick={handleClick}>
          <img 
            src={onecoin} 
            width={260} 
            className="coin-animation select-none cursor-pointer"
            alt="main-coin"
          />
          {clicks.map(c => (
            <span 
              key={c.id} 
              className="floating-point" 
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              onAnimationEnd={() => handleAnimationEnd(c.id)}
            >
              +{isBoost ? 5 : 1}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-32 z-20">
        <button 
          onClick={() => { if(points >= 100) { setPoints(prev => prev - 100); setAutoLevel(prev => prev + 1); }}}
          className="bg-white/10 p-3 rounded-xl border border-white/20 text-white"
        >
          🤖 Auto (+{autoLevel}/s)
        </button>
        <button 
          onClick={() => { setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000); }}
          className={`p-3 rounded-xl border text-white ${isBoost ? 'bg-orange-500 animate-pulse' : 'bg-white/10'}`}
        >
          🚀 5X Boost
        </button>
      </div>

      <div className="fixed bottom-8 w-full px-8 text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img src={highVoltage} width={30} alt="energy" />
            <span className="ml-2 font-bold">{energy} / 6500</span>
          </div>
        </div>
        <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
          <div className="bg-white h-full transition-all" style={{ width: `${(energy/6500)*100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
