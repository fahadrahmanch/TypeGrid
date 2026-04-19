import React, { useState } from "react";
import ReusableTable from "../../common/ReusableTable";

const Highscores: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ALL" | "WEEKLY" | "MONTHLY">("ALL");

  const scores = [
    {
      rank: 1,
      name: "TTRman",
      mode: "easy",
      time: "16 hours ago",
      accuracy: "98%",
      wpm: 178,
    },
    {
      rank: 2,
      name: "TheDeno",
      mode: "easy",
      time: "4 hours ago",
      accuracy: "99%",
      wpm: 172.5,
    },
    {
      rank: 3,
      name: "Badya",
      mode: "easy",
      time: "23 hours ago",
      accuracy: "98%",
      wpm: 160,
    },
    {
      rank: 4,
      name: "MikyUsdma",
      mode: "easy",
      time: "21 hours ago",
      accuracy: "99%",
      wpm: 155.67,
    },
    {
      rank: 5,
      name: "Shark87",
      mode: "easy",
      time: "23 hours ago",
      accuracy: "98%",
      wpm: 148.76,
    },
    {
      rank: 6,
      name: "Rizer",
      mode: "easy",
      time: "14 hours ago",
      accuracy: "98%",
      wpm: 145.02,
    },
    {
      rank: 7,
      name: "Internet.M",
      mode: "easy",
      time: "5 hours ago",
      accuracy: "100%",
      wpm: 138.99,
    },
    {
      rank: 8,
      name: "Ifraiw",
      mode: "hard",
      time: "18 hours ago",
      accuracy: "98%",
      wpm: 138.88,
    },
  ];

  return (
    <div className="bg-[#FFF5E0] p-6 rounded-3xl h-full shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-serif">Hiscores</h2>
      </div>

      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {(["ALL", "WEEKLY", "MONTHLY"] as const).map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-xs font-bold tracking-wider transition-colors relative ${
              activeTab === tab ? "text-blue-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></span>}
          </button>
        ))}
      </div>

        <ReusableTable
          columns={[
            {
              header: "#",
              key: "rank",
              className: "py-3 pl-2 font-bold text-gray-700",
              render: (score) => `${score.rank}.`,
              columnHeaderClassName: "font-normal",
            },
            {
              header: "Name",
              key: "name",
              className: "py-3",
              render: (score) => (
                <>
                  <div className="font-bold text-gray-800">{score.name}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    <span className={`font-bold ${score.mode === "easy" ? "text-green-600" : "text-red-500"}`}>
                      {score.mode}
                    </span>
                    , {score.time}
                  </div>
                </>
              ),
              columnHeaderClassName: "font-normal",
            },
            {
              header: "Accuracy",
              key: "accuracy",
              headerClassName: "text-right",
              className: "py-3 text-right text-gray-500 font-medium",
              columnHeaderClassName: "font-normal",
            },
            {
              header: "WPM",
              key: "wpm",
              headerClassName: "text-right",
              className: "py-3 text-right text-gray-800 font-bold",
              columnHeaderClassName: "font-normal",
            },
          ]}
          data={scores}
          rowClassName="border-b border-orange-100 last:border-0 hover:bg-orange-50/50 transition-colors"
          headerClassName="text-left text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100"
          className="text-xs"
        />
    </div>
  );
};

export default Highscores;
