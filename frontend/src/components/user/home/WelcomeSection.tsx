import React from 'react';
import WelcomeIllustration from './../../../assets/images/cartoonMan.png';

const WelcomeSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 mb-12">
      <div className="flex-1 bg-[#FFF5E0] rounded-3xl p-8 md:p-12 min-h-[300px] flex items-center">
        <p className="text-gray-900 text-lg md:text-xl font-normal leading-relaxed md:leading-loose text-left font-serif">
          Welcome to TypeGrid, the place where typing meets fun and
          challenge. Improve your speed, test your accuracy,
          and compete with friends in quick play, solo play, or group
          play. Whether you're here to practice or to play,
          TypeGrid makes learning fast and exciting.
        </p>
      </div>
      <div className="flex-1 flex justify-center md:justify-end relative">
          {/* Floating letters effect could be enhanced with CSS animations if desired */}
        <img 
          src={WelcomeIllustration} 
          alt="Welcome to TypeGrid" 
          className="w-full max-w-[400px] h-auto object-contain transform hover:scale-105 transition-transform duration-300 drop-shadow-xl"
        />
      </div>
    </div>
  );
};

export default WelcomeSection;
