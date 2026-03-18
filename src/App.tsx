import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

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

  // بارکردنی تاسکەکان بە شێوەیەک کە وێنەی 'rocket' بەکاربهێنێت بۆ ئەوەی ئیرۆر نەیەت
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('user_tasks');
    if (saved) return JSON.parse(saved);
    return [
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('points', points.toString());
    localStorage.setItem('energy', energy.toString());
    localStorage.setItem('autoLevel', autoLevel.toString());
    localStorage.setItem('user_tasks', JSON.stringify(tasks));
  }, [points, energy, autoLevel, tasks]);

  useEffect(() => {
    const intv = setInterval(() => {
      if (autoLevel > 0) setPoints(p => p + autoLevel);
      setEnergy(e => Math.min(e + 1, 6500));
    }, 1000);
    return () => clearInterval(intv);
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

  const copyLink = () => {
    navigator.clipboard.writeText("https://t.me/your_bot?start=user");
    alert("Link Copied! 🚀");
  };

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none text-white font-sans">
      
      {/* پۆینت لە سەرەوە */}
      <div className="mt-10 text-center z-20">
        <div className="text-5xl font-black flex items-center justify-center">
          <img src={coin} width={42} alt="coin" />
          <span className="ml-2">{points.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 opacity-80">
          <img src={trophy} width={18} alt="rank" />
          <span className="font-bold">Bronze Rank</span>
        </div>
      </div>

      {/* --- بەشی یاری --- */}
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
            <button onClick={() => points >= 100 && (setPoints(p=>p-100), setAutoLevel(a=>a+1))} className="btn-action">🤖 Auto (+{autoLevel})</button>
            {/* لێرە وێنەی rocket بەکاردەهێنین بۆ ئەوەی ئیرۆر نەیەت */}
            <button onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} className={`btn-action flex items-center gap-2 ${isBoost ? 'bg-orange-500 animate-pulse' : ''}`}>
              <img src={rocket} width={20} alt="boost" /> Boost
            </button>
          </div>
        </>
      )}

      {/* --- بەشی ئەرکەکان --- */}
      {activeTab === 'tasks' && (
        <div className="flex-grow w-full px-6 mt-10 overflow-y-auto pb-40">
          <h2 className="text-2xl font-bold mb-6 text-center">Tasks List 💰</h2>
          <div className="flex flex-col gap-4">
            {tasks.map(t => (
              <div key={t.id} className="task-card flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{t.title}</p>
                    <p className="text-xs text-blue-300">+{t.reward.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => handleTask(t.id, t.reward, t.link)} disabled={t.claimed} className={`px-5 py-2 rounded-xl font-bold ${t.claimed ? 'bg-green-500/50 text-white' : 'bg-white text-blue-900'}`}>
                  {t.claimed ? '✅ Done' : 'Go'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- بەشی بانگهێشت --- */}
      {activeTab === 'invite' && (
        <div className="flex-grow w-full px-6 flex flex-col items-center justify-center text-center pb-40">
           <h1 className="text-4xl font-black mb-2">Invite Friends! 👥</h1>
           <p className="opacity-70 mb-10 text-lg">Get 5,000 coins for each friend!</p>
           <div className="bg-white/10 p-8 w-full rounded-[35px] border border-white/20 backdrop-blur-md">
              <code className="block bg-black/20 p-4 rounded-2xl mb-6 text-blue-300 text-sm">t.me/your_bot?start=user</code>
              <button onClick={copyLink} className="bg-white text-blue-700 font-black py-4 px-8 rounded-2xl w-full text-xl shadow-lg active:scale-95 transition-all">Copy Link</button>
           </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-black/40 backdrop-blur-xl flex justify-around items-center py-5 border-t border-white/10 z-50">
        <button onClick={() => setActiveTab('game')} className={`nav-btn ${activeTab === 'game' ? 'active text-blue-400' : 'opacity-50'}`}>🎮<span className="text-[10px] block font-bold">Game</span></button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-btn ${activeTab === 'tasks' ? 'active text-blue-400' : 'opacity-50'}`}>📋<span className="text-[10px] block font-bold">Tasks</span></button>
        <button onClick={() => setActiveTab('invite')} className={`nav-btn ${activeTab === 'invite' ? 'active text-blue-400' : 'opacity-50'}`}>👥<span className="text-[10px] block font-bold">Invite</span></button>
        <button className="nav-btn opacity-30 text-xs">💰Wallet</button>
        <button className="nav-btn opacity-30 text-xs">📊Stats</button>
      </div>

      {/* باری وزە */}
      {activeTab === 'game' && (
        <div className="fixed bottom-28 w-full px-10">
          <div className="flex items-center mb-2 text-xs font-bold">
            <img src={highVoltage} width={14} alt="energy" /> <span className="ml-1">{energy} / 6500</span>
          </div>
          <div className="w-full bg-black/30 h-2.5 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <div className="bg-white h-full transition-all duration-300" style={{ width: `${(energy/6500) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
