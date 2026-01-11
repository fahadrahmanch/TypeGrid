import React from 'react';
import { ArrowRight } from 'lucide-react';
import GroupImg from '../../../assets/images/game-mode-group.png';
import QuickImg from '../../../assets/images/game-mode-quick.png';
import SoloImg from '../../../assets/images/game-mode-solo.png';
import PracticeImg from '../../../assets/images/game-mode-practice.png';

interface GameModeProps {
  title: string;
  description: string;
  image: string;
  bg : string;
  mode: string;
  onClick: (mode: string) => void;
}

const GameModeCard: React.FC<GameModeProps> = ({ title, description, image,  mode, onClick }) => (
  <div onClick={() => onClick(mode)}
 className={`p-6 rounded-3xl bg-[#FFF5E0] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-[180px] relative overflow-hidden`}>
    <div className="z-10 relative">
        <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:no-underline font-serif">{title}</h3>
            <ArrowRight size={20} className="text-gray-900 group-hover:translate-x-1 transition-transform" />
        </div>
        <p className="text-xs text-gray-800 text-start font-medium font-serif">{description}</p>
    </div>
    <div className="absolute bottom-0 right-0 w-32 h-32 md:w-36 md:h-36">
        <img src={image} alt={title} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm origin-bottom-right" />
    </div>
  </div>
);

const GameModes: React.FC<{onGameModeClick: (mode: string) => void}> = ({ onGameModeClick }) => {
  const modes = [
    {
      title: 'Group play',
      description: 'Play against friends',
      image: GroupImg,
      bg: 'bg-[#FFF8E7]', // Beige
      mode: "group",
    },
    {
      title: 'Quick play',
      description: 'Play against others',
      image: QuickImg,
      bg: 'bg-[#FFF8E7]' ,// Beige
      mode: "quick",
    },
    {
      title: 'Solo play',
      description: 'Play on your own',
      image: SoloImg,
      bg: 'bg-[#FFF8E7]', // Beige
      mode: "solo",
    },
    {
        title: 'Practice mode',
        description: 'Practice Typing',
        image: PracticeImg,
        bg: 'bg-[#FFF8E7]', // Beige
        mode: "practice",
      },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {modes.map((mode, index) => (
        <GameModeCard key={index} {...mode} onClick={onGameModeClick} />
      ))}
    </div>
  );
};

export default GameModes;
