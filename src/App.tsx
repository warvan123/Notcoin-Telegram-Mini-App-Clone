import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

function App() {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('points');
    return saved ? parseInt(saved) : 0;
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('energy');
    return saved ? parseInt(saved) : 6500;
  });

  const [autoLevel, setAutoLevel] = useState(() => {
    const saved = localStorage.getItem('autoLevel');
    return saved ? parseInt(saved) : 0;
  });

  const [isBoost, setIsBoost] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

  // بۆ پاشکەوتکردنی زانیارییەکان
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
  }, [points, energy, autoLevel]);

  // سیستەمی ئۆتۆ-کلیک
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) {
        setPoints(prev => prev + autoLevel);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  // نوێکردنەوەی وزە
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, 6500));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(prev => prev + (isBoost ? 5 : 1));
    setEnergy(prev => prev - 1);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const removeClick = (id: number) => {
    setClicks(prev => prev.filter(click => click.id !== id));
  };

  const buyAuto = () => {
    if (points >= 100) {
      setPoints(prev => prev - 100);
      setAutoLevel(prev => prev + 1);
    }
  };

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none">
      {/* پۆینتەکان */}
      <div className="mt-10 text-center z-20">
        <div className="text-5xl font-bold flex items-center justify-center text-white">
          <img src={coin} width={45} alt="coin" />
          <span className="ml-2 font-mono">{points.toLocaleString()}</span>
        </div>
        <div className="text-white/90 font-bold mt-2 flex items-center justify-center gap-2">
          <img src={trophy} width={20} alt="rank" />
          <span>{points > 20000 ? "Gold" : points > 5000 ? "Silver" : "Bronze"} Rank</span>
          {isBoost && <img src={rocket} width={22} className="animate-bounce" alt="boost" />}
        </div>
      </div>

      {/* دراوەکە - جێگیر لە شوێنی خۆی */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="relative coin-wrapper touch-none" onClick={handleClick}>
          <img src={onecoin} width={240} className="main-coin" alt="clicker" />
          {clicks.map(click => (
            <div
              key={click.id}
              className="floating-num"
              style={{ left: click.x, top: click.y }}
              onAnimationEnd={() => removeClick(click.id)}
            >
              +{isBoost ? 5 : 1}
            </div>
          ))}
        </div>
      </div>

      {/* دوگمەکانی خوارەوە */}
      <div className="flex gap-6 mb-28 z-20">
        <button onClick={buyAuto} className="btn-action">
          🤖 Auto (+{autoLevel})
        </button>
        <button 
          onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} 
          className={`btn-action ${isBoost ? 'bg-orange-600' : ''}`}
        >
          🚀 5X Boost
        </button>
      </div>

      {/* باربوونی وزە */}
      <div className="fixed bottom-8 w-full px-10 text-white z-20">
        <div className="flex items-center mb-2 justify-between">
          <div className="flex items-center">
            <img src={highVoltage} width={25} alt="energy" />
            <span className="ml-2 font-bold">{energy} / 6500</span>
          </div>
          <span className="text-sm opacity-70">⚡ Charging...</span>
        </div>
        <div className="w-full bg-black/30 h-4 rounded-full border border-white/20 overflow-hidden">
          <div className="bg-white h-full transition-all duration-300 shadow-[0_0_10px_white]" style={{ width: `${(energy/6500) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
