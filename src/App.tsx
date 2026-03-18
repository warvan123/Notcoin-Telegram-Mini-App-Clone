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
            <button onClick={() => points >= 100 && (setPoints(p=>p-100), setAutoLevel(a=>a+1))} className="btn-action">🤖 Auto (+{autoLevel})</button>
            <button onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} className={`btn-action flex items-center gap-2 ${isBoost ? 'bg-orange-500 animate-pulse' : ''}`}>
              <img src={rocket} width={20} alt="boost" /> Boost {/* بەکارهێنان بۆ نەمانی ئیرۆرا rocket */}
            </button>
          </div>
        </>
      )}

      {/* --- پشکا تاسکان (Tasks) --- */}
      {activeTab === 'tasks' && (
        <div className="flex-grow w-full px-6 mt-10 overflow-y-auto pb-40">
          <h2 className="text-2xl font-bold mb-6 text-center">Tasks List 💰</h2>
          <div className="flex flex-col gap-4">
            {tasks.map(t => (
              <div key={t.id} className="task-card flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <p className="font-bold text-sm">{t.title}</p>
                    <p className="text-xs text-blue-300 font-mono">+{t.reward.toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => handleTask(t.id, t.reward, t.link)} disabled={t.claimed} className={`px-5 py-2 rounded-xl font-bold transition-all ${t.claimed ? 'bg-green-500/50' : 'bg-white text-blue-900 active:scale-90'}`}>
                  {t.claimed ? '✅ Done' : 'Go'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- پشکا ئینڤایت (Invite) --- */}
      {activeTab === 'invite' && (
        <div className="flex-grow w-full px-6 flex flex-col items-center justify-center text-center pb-40">
           <h1 className="text-4xl font-black mb-2">Invite Friends! 👥</h1>
           <p className="opacity-70 mb-10 text-lg text-blue-100">Invite friends and get 5,000 coins!</p>
           <div className="bg-white/10 p-8 w-full rounded-[35px] border border-white/20 backdrop-blur-md">
              <code className="block bg-black/20 p-4 rounded-2xl mb-6 text-blue-300 text-sm italic break-all font-mono">t.me/your_bot?start=user_id</code>
              <button onClick={() => {navigator.clipboard.writeText("t.me/your_bot?start=user"); alert("Link Copied!");}} className="bg-white text-blue-700 font-black py-4 px-8 rounded-2xl w-full text-xl shadow-lg active:scale-95 transition-all">Copy Link</button>
           </div>
        </div>
      )}

      {/* --- پشکا وەلێتی (Wallet) --- */}
      {activeTab === 'wallet' && (
        <div className="flex-grow w-full px-6 flex flex-col items-center justify-center text-center pb-40">
           <div className="mb-6 text-6xl animate-bounce">💎</div>
           <h1 className="text-4xl font-black mb-2">Wallet</h1>
           <p className="opacity-70 mb-10 text-lg">Connect your TON wallet to withdraw rewards</p>
           <div className="bg-white/10 p-8 w-full rounded-[35px] border border-white/20 backdrop-blur-md flex flex-col items-center shadow-2xl">
              <TonConnectButton />
              
              {userFriendlyAddress ? (
                <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl w-full">
                  <p className="text-xs opacity-60">Connected Address:</p>
                  <p className="text-sm font-mono break-all">{userFriendlyAddress}</p>
                </div>
              ) : (
                <p className="mt-6 text-sm opacity-50 italic italic">No wallet connected yet</p>
              )}
              
              <div className="mt-6 pt-4 border-t border-white/10 w-full">
                 <p className="text-sm font-bold text-yellow-400">Balance: {points.toLocaleString()} $ONE</p>
              </div>
           </div>
        </div>
      )}

      {/* Navigation Bar --- */}
      <div className="fixed bottom-0 w-full bg-black/40 backdrop-blur-xl flex justify-around items-center py-5 border-t border-white/10 z-50">
        <button onClick={() => setActiveTab('game')} className={`nav-btn ${activeTab === 'game' ? 'text-blue-400' : 'opacity-50'}`}>🎮<span className="text-[10px] block font-bold">Game</span></button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-btn ${activeTab === 'tasks' ? 'text-blue-400' : 'opacity-50'}`}>📋<span className="text-[10px] block font-bold">Tasks</span></button>
        <button onClick={() => setActiveTab('invite')} className={`nav-btn ${activeTab === 'invite' ? 'text-blue-400' : 'opacity-50'}`}>👥<span className="text-[10px] block font-bold">Invite</span></button>
        <button onClick={() => setActiveTab('wallet')} className={`nav-btn ${activeTab === 'wallet' ? 'text-blue-400' : 'opacity-50'}`}>💰<span className="text-[10px] block font-bold">Wallet</span></button>
      </div>

      {/* بارا وزەی (Energy Bar) */}
      {activeTab === 'game' && (
        <div className="fixed bottom-28 w-full px-10">
          <div className="flex items-center mb-2 text-xs font-bold">
            <img src={highVoltage} width={14} alt="energy" /> <span className="ml-1 font-mono">{energy} / 6500</span>
          </div>
          <div className="w-full bg-black/30 h-2.5 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <div className="bg-white h-full transition-all duration-300 shadow-[0_0_15px_white]" style={{ width: `${(energy/6500) * 100}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
