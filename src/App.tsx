import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

function App() {
  // لێرە پۆینتان ژ localStorage دئینین ئەگەر هەبن
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

  // هەر دەمێ پۆینت یان وزە گوهۆڕین، دێ هێنە پاشکەفتکرن
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
  }, [points, energy, autoLevel]);

  // سیستەمێ Auto-Clicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) {
        setPoints(prev => prev + autoLevel);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  // سیستەمێ نووکرنا وزەی (Energy Regeneration)
  useEffect(() => {
    const interval = setInterval(() => {
      if (energy < 6500) {
        setEnergy(prev => Math.min(prev + 1, 6500));
      }
    }, 2000); // هەر دوو چرکەیان ١ وزە زێدە دبیت
    return () => clearInterval(interval);
  }, [energy]);

  const handleClick = (e: React.MouseEvent) => {
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

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center">
      <div className="mt-8 text-center">
        <div className="text-5xl font-bold flex items-center justify-center text-white">
          <img src={coin} width={40} alt="coin" />
          <span className="ml-2">{points.toLocaleString()}</span>
        </div>
        <div className="text-white/80 font-bold mt-1 flex items-center justify-center">
          <img src={trophy} width={18} alt="rank" />
          <span className="ml-1">{points > 20000 ? "Gold" : points > 5000 ? "Silver" : "Bronze"} Rank</span>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center w-full relative">
        <div className="relative cursor-pointer" onClick={handleClick}>
          <img src={onecoin} width={220} className="coin-animation" alt="main" />
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

      <div className="flex gap-4 mb-24 z-10">
        <button onClick={() => points >= 100 && setAutoLevel(prev => prev + 1) && setPoints(prev => prev - 100)} className="btn-shop">
          🤖 Auto (+{autoLevel})
        </button>
        <button onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} className={`btn-shop ${isBoost ? 'bg-orange-500' : ''}`}>
          🚀 5X Boost
        </button>
      </div>

      <div className="fixed bottom-6 w-full px-8 text-white">
        <div className="flex items-center mb-2">
          <img src={highVoltage} width={25} />
          <span className="ml-2 font-bold">{energy} / 6500</span>
        </div>
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
          <div className="bg-white h-full transition-all" style={{ width: `${(energy/6500)*100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
