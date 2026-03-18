import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';

// پێناسا جۆرێ تاسکان
interface Task {
  id: number;
  title: string;
  reward: number;
  icon: string;
  link: string;
  claimed: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [energy, setEnergy] = useState(() => Number(localStorage.getItem('energy')) || 6500);
  const [autoLevel, setAutoLevel] = useState(() => Number(localStorage.getItem('autoLevel')) || 0);
  const [isBoost, setIsBoost] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  
  // بۆ ناسینا ناڤنیشانێ وەلێتی
  const userFriendlyAddress = useTonAddress();

  // لیستا تاسکان ب شێوەیەکێ کو ل "Local Storage" بمینن
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('user_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Join Telegram Channel', reward: 5000, icon: '📢', link: 'https://t.me/your_channel', claimed: false },
      { id: 2, title: 'Subscribe to YouTube', reward: 10000, icon: '📺', link: 'https://youtube.com/@your_channel', claimed: false }
    ];
  });

  // پاشکەوتکرنا هەمی داتایان
  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
    localStorage.setItem('user_tasks', JSON.stringify(tasks));
  }, [points, energy, autoLevel, tasks]);

  // ئۆتۆ-کلیک و نووکرنا وزەی (Energy)
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) setPoints(p => p + autoLevel);
      setEnergy(e => Math.min(e + 1, 6500));
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0 || activeTab !== 'game') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(p => p + (isBoost ? 5 : 1));
    setEnergy(e => Math.max(0, e - 1));
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleTask = (id: number, reward: number, link: string) => {
    window.open(link, '_blank');
    setTasks(prev => prev.map(t => t.id === id ? { ...t, claimed: true } : t));
    setPoints(p => p + reward);
  };

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none text-white font-sans">
      
      {/* پۆینت و ڕەنک ل سەرێ لاپەڕی */}
      <div className="mt-10 text-center z-20">
        <div className="text-5xl font-black flex items-center justify-center tracking-tighter">
          <img src={coin} width={42} alt="coin" />
          <span className="ml-2 font-mono">{points.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 opacity-80">
          <img src={trophy} width={18} alt="rank" /> {/* بەکارهێنان بۆ نەمانی ئیرۆرا trophy */}
          <span className="font-bold">Bronze Rank</span>
        </div>
      </div>

      {/* --- پشکا یاریێ (Game) --- */}
      {activeTab === 'game' && (
        <>
          <div className="flex-grow flex items-center justify-center w-full relative">
            <div className="coin-wrapper" onClick={handleClick}>
              <img src={onecoin} width={250} className="main-coin" alt="clicker" />
              {clicks.map(c => (
                <div key={c.id} className="floating-num" style={{ left: c.x, top: c.y }} onAnimationEnd={() => setClicks(prev => prev.filter(cl => cl.id !== c.id))}>
                  +{isBoost ? 5 : 1}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mb-36 z-20">
