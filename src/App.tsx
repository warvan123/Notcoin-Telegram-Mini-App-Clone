{import { useState, useEffect } from 'react';
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

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
  }, [points, energy, autoLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) {
        setPoints(prev => prev + autoLevel);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (energy < 6500) {
        setEnergy(prev => Math.min(prev + 1, 6500));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [energy]);

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
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center">
      <div className="mt-8 text-center z-20">
        <div className="text-5xl font-bold flex items-center justify-center text-white">
          <img src={coin} width={40} alt="coin" />
          <span className="ml-2">{points.toLocaleString()}</span>
        </div>
        <div className="text-white/80 font-bold mt-1 flex items-center justify-center">
          <img src={trophy} width={18} alt="rank" />
          <span className="ml-1">
            {points > 20000 ? "Gold" : points > 5000 ? "Silver" : "Bronze"} Rank
            {isBoost && <img src={rocket} width={18} className="inline ml-2" alt="rocket" />}
          </span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full relative">
        <div className="relative cursor-pointer touch-none" onClick={handleClick}>
          <img src={onecoin} width={220} className="coin-animation select-none" alt="main" />
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

      <div className="flex gap-4 mb-24 z-20">
        <button onClick={buyAuto} className="btn-shop">
          🤖 Auto (+{autoLevel})
        </button>
        <button 
          onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} 
          className={`btn-shop ${isBoost ? 'bg-orange-500 animate-pulse' : ''}`}
        >
          🚀 5X Boost
        </button>
      </div>

      <div className="fixed bottom-6 w-full px-8 text-white z-20">
        <div className="flex items-center mb-2">
          <img src={highVoltage} width={25} alt="energy" />
          <span className="ml-2 font-bold">{energy} / 6500</span>
        </div>
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
          <div className="bg-white h-full transition-all" style={{ width: `${(energy/6500) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
