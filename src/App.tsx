import { useEffect, useState } from 'react';
import './App.css'
import { coin, highVoltage, onecoin, rocket, trophy } from './images';
function App() {
  const [points, setPoints] = useState(0);
  const [energy, setEnergy] = useState(6500);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(points + pointsToAdd);
    setEnergy(energy - 1);
    setClicks([...clicks, { id: Date.now(), x, y }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="mt-12 text-5xl font-bold flex items-center z-10">
        <img src={coin} width={44} height={44} alt="Coin" />
        <span className="ml-2">{points.toLocaleString()}</span>
      </div>
      <div className="text-[#ffd334] font-medium flex items-center z-10">
        <img src={trophy} width={24} height={24} alt="Trophy" />
        <span className="ml-1">Gold <img src={rocket} width={24} height={24} alt="Rocket" /></span>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="relative mt-4" onClick={handleClick}>
          <img src={onecoin} width={256} height={256} alt="Onecoin" />
          {clicks.map((click) => (
            <div key={click.id} className="absolute text-5xl font-bold opacity-0" style={{ top: `${click.y - 42}px`, left: `${click.x - 28}px`, animation: `float 1s ease-out` }} onAnimationEnd={() => handleAnimationEnd(click.id)}>
              +{pointsToAdd}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src={highVoltage} width={44} height={44} alt="Energy" />
            <div className="ml-2 text-left">
              <span className="text-white text-2xl font-bold block">{energy}</span>
              <span className="text-white text-secondary opacity-75">/ 6500</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-[#fad258] rounded-full mt-4 border-2 border-[#43433b]">
          <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default App;
