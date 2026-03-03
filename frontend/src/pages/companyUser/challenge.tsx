import React, { useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import ChallengeArena from "../../components/companyUser/challengeArena/ChallengeArena";
import MyChallenges from "../../components/companyUser/challengeArena/MyChallenges";

const Challenge: React.FC = () => {
    const [currentView, setCurrentView] = useState<'arena' | 'my-challenges'>('arena');

    return (
        <div className="min-h-screen bg-[#FFF8EA] text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <CompanyUserNavbar />
            <main className="pt-24 px-8 pb-12 w-full max-w-[1600px] mx-auto min-h-[calc(100vh-80px)]">
                {currentView === 'arena' ? (
                    <ChallengeArena setView={setCurrentView} />
                ) : (
                    <MyChallenges setView={setCurrentView} />
                )}
            </main>
        </div>
    );
};

export default Challenge;