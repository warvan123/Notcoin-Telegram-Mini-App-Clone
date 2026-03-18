import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [points, setPoints] = useState(() => Number(localStorage.getItem('points')) || 0);
  const [energy, setEnergy] = useState(() => Number(localStorage.getItem('energy')) || 6500);
  const [autoLevel, setAutoLevel] = useState(() => Number(localStorage.getItem('autoLevel')) || 0);
  const [isBoost, setIsBoost] = useState(false);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);

  // لیستی تاسکەکان بە لۆژیکێکی نوێوە
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: 'Join Telegram Channel', 
      reward: 5000, 
      icon: '📢', 
      link: 'https://t.me/+Q8KuyPNu_Tk2Njk6', 
      claimed: false 
    },
    { 
      id: 2, 
      title: 'Subscribe to Hariwan Crypto', 
      reward: 10000, 
      icon: '📺', 
      link: 'https://youtube.com/@hariwancrypto?si=goCN6DMH_dB5Z4ae', 
      claimed: false 
    }
  ]);

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
  }, [points, energy, autoLevel]);

  // سیستەمی ئۆتۆ-کلیک
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoLevel > 0) setPoints(prev => prev + autoLevel);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoLevel]);

  // باربوونی وزە
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, 6500));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0 || activeTab !== 'game') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(prev => prev + (isBoost ? 5 : 1));
    setEnergy(prev => Math.max(0, prev - 1));
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleTask = (id: number, reward: number, link: string) => {
    window.open(link, '_blank');
    setTasks(prev => prev.map(t => t.id === id ? { ...t, claimed: true } : t));
    setPoints(prev => prev + reward);
  };

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none text-white">
      
      {/* نیشاندانی پۆینت لە سەرەوە */}
      <div className="mt-10 text-center z-20">
        <div className="text-5xl font-bold flex items-center justify-center">
          <img src={coin} width={45} />
          <span className="ml-2 font-mono">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* --- پشکی یاری (Game) --- */}
      {activeTab === 'game' && (
        <>
          <div className="text-white/90 font-bold mt-2 flex items-center justify-center gap-2">
            <img src={trophy} width={20} />
            <span>{points > 5000 ? "Silver" : "Bronze"} Rank</span>
            {isBoost && <img src={rocket} width={22} className="animate-pulse" />}
          </div>

          <div className="flex-grow flex items-center justify-center w-full">
            <div className="relative coin-wrapper touch-none" onClick={handleClick}>
              <img src={onecoin} width={240} className="main-coin" alt="coin" />
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

      {/* --- پشکی ئەرکەکان (Tasks) --- */}
      {activeTab === 'tasks' && (
        <div className="flex-grow w-full px-6 mt-10 overflow-y-auto pb-32">
          <h2 className="text-2xl font-bold mb-6 text-center">New Tasks 💰</h2>
          <div className="flex flex-col gap-4">
            {tasks.map(task => (
              <div key={task.id} className="task-card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{task.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{task.title}</p>
                    <p className="text-xs text-blue-300">+{task.reward.toLocaleString()} Coins</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleTask(task.id, task.reward, task.link)} 
                  className={`btn-claim ${task.claimed ? 'opacity-50' : ''}`}
                  disabled={task.claimed}
                >
                  {task.claimed ? 'Done' : 'Go'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- پشکی بانگهێشت (Invite) --- */}
      {activeTab === 'invite' && (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Invite Friends! 👥</h1>
          <p className="opacity-80 mb-8">Get 5,000 coins for every friend!</p>
          <div className="invite-card p-6 w-full border border-white/20">
            <p className="text-sm opacity-60 mb-2">Your Link:</p>
            <code className="text-blue-300 block mb-4">t.me/your_bot?start=user</code>
            <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-2xl w-full">Copy Link</button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-black/40 backdrop-blur-lg flex justify-around items-center py-4 border-t border-white/10 z-50">
        <button onClick={() => setActiveTab('game')} className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`}>🎮<span className="text-[10px]">Game</span></button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}>📋<span className="text-[10px]">Tasks</span></button>
        <button onClick={() => setActiveTab('invite')} className={`nav-btn ${activeTab === 'invite' ? 'active' : ''}`}>👥<span className="text-[10px]">Invite</span></button>
        <button className="nav-btn opacity-40">💰<span className="text-[10px]">Wallet</span></button>
        <button className="nav-btn opacity-40">📊<span className="text-[10px]">Stats</span></button>
      </div>

      {/* باری وزە (تەنیا لە لاپەڕەی یاری) */}
      {activeTab === 'game' && (
        <div className="fixed bottom-24 w-full px-10">
          <div className="flex items-center mb-1 text-xs">
            <img src={highVoltage} width={15} /> <span className="ml-1 font-bold">{energy} / 6500</span>
          </div>
          <div className="w-full bg-black/30 h-2 rounded-full border border-white/10 overflow-hidden">
            <div className="bg-white h-full transition-all duration-300" style={{ width: `${(energy/6500) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
