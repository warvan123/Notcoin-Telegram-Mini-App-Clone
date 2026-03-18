import { useState, useEffect } from 'react';
import './App.css';
import { coin, highVoltage, onecoin, rocket, trophy } from './images';

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

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('user_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Join Telegram Channel', reward: 5000, icon: '📢', link: 'https://t.me/+Q8KuyPNu_Tk2Njk6', claimed: false },
      { id: 2, title: 'Subscribe to Hariwan Crypto', reward: 10000, icon: '📺', link: 'https://youtube.com/@hariwancrypto?si=goCN6DMH_dB5Z4ae', claimed: false }
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

  return (
    <div className="bg-gradient-main h-screen w-full overflow-hidden flex flex-col items-center select-none text-white font-sans">
      
      {/* نیشاندانی کۆینەکان لە هەموو بەشەکان */}
      <div className="mt-10 text-center z-20">
        <div className="text-5xl font-black flex items-center justify-center">
          <img src={coin} width={42} alt="coin" />
          <span className="ml-2">{points.toLocaleString()}</span>
        </div>
      </div>

      {/* --- بەشی یاری --- */}
      {activeTab === 'game' && (
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <div className="relative coin-wrapper" onClick={handleClick}>
            <img src={onecoin} width={250} className="main-coin" alt="clicker" />
            {clicks.map(c => (
              <div key={c.id} className="floating-num" style={{ left: c.x, top: c.y }} onAnimationEnd={() => setClicks(prev => prev.filter(cl => cl.id !== c.id))}>
                +{isBoost ? 5 : 1}
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-10 z-20">
            <button onClick={() => points >= 100 && (setPoints(p=>p-100), setAutoLevel(a=>a+1))} className="btn-action">🤖 Auto (+{autoLevel})</button>
            <button onClick={() => {setIsBoost(true); setTimeout(()=>setIsBoost(false), 5000)}} className={`btn-action flex items-center gap-2 ${isBoost ? 'bg-orange-500 animate-pulse' : ''}`}>
              <img src={rocket} width={20} alt="boost" /> Boost
            </button>
          </div>
        </div>
      )}

      {/* --- بەشی Wallet (نوێ) --- */}
      {activeTab === 'wallet' && (
        <div className="flex-grow w-full px-6 flex flex-col items-center justify-center text-center pb-40">
           <div className="mb-6 text-6xl">💰</div>
           <h1 className="text-4xl font-black mb-2">Wallet</h1>
           <p className="opacity-70 mb-10 text-lg">Connect your wallet to withdraw your rewards</p>
           
           <div className="bg-white/10 p-8 w-full rounded-[35px] border border-white/20 backdrop-blur-md">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                  <span className="opacity-60">Balance:</span>
                  <span className="font-bold text-yellow-400">{points.toLocaleString()} $ONE</span>
                </div>
                <button 
                  onClick={() => alert("Wallet connection coming soon! 💎")}
                  className="bg-blue-500 text-white font-black py-4 px-8 rounded-2xl w-full text-xl shadow-lg active:scale-95 transition-all"
                >
                  Connect TON Wallet
                </button>
              </div>
           </div>
        </div>
      )}

      {/* --- بەشەکانی تر (Tasks & Invite) وەک خۆیانن --- */}
      {activeTab === 'tasks' && ( /* لێرە کۆدی تاسکەکان وەک پێشوو دادەنێیت */ <div className="p-10">Tasks Section...</div> )}
      {activeTab === 'invite' && ( /* لێرە کۆدی ئینڤایت وەک پێشوو دادەنێیت */ <div className="p-10">Invite Section...</div> )}

      {/* Navigation Bar */}
      <div className="fixed bottom-0 w-full bg-black/40 backdrop-blur-xl flex justify-around items-center py-5 border-t border-white/10 z-50">
        <button onClick={() => setActiveTab('game')} className={`nav-btn ${activeTab === 'game' ? 'active text-blue-400' : 'opacity-50'}`}>🎮<span className="text-[10px] block font-bold">Game</span></button>
        <button onClick={() => setActiveTab('tasks')} className={`nav-btn ${activeTab === 'tasks' ? 'active text-blue-400' : 'opacity-50'}`}>📋<span className="text-[10px] block font-bold">Tasks</span></button>
        <button onClick={() => setActiveTab('invite')} className={`nav-btn ${activeTab === 'invite' ? 'active text-blue-400' : 'opacity-50'}`}>👥<span className="text-[10px] block font-bold">Invite</span></button>
        <button onClick={() => setActiveTab('wallet')} className={`nav-btn ${activeTab === 'wallet' ? 'active text-blue-400' : 'opacity-50'}`}>💰<span className="text-[10px] block font-bold">Wallet</span></button>
      </div>

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
