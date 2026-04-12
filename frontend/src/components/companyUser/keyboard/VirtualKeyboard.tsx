import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

interface VirtualKeyboardProps {
  highlightKey?: string;
}

type KeyboardLayoutType = "qwerty" | "azerty" | "dvorak";

const layouts: Record<KeyboardLayoutType, string[][]> = {
  qwerty: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
  ],
  azerty: [
    ["²", "&", "é", "\"", "'", "(", "-", "è", "_", "ç", "à", ")", "="],
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "^", "$"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "ù", "*"],
    ["W", "X", "C", "V", "B", "N", ",", ";", ":", "!"]
  ],
  dvorak: [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
    ["'", ",", ".", "P", "Y", "F", "G", "C", "R", "L", "/", "=", "\\"],
    ["A", "O", "E", "U", "I", "D", "H", "T", "N", "S", "-"],
    [";", "Q", "J", "K", "X", "B", "M", "W", "V", "Z"]
  ]
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ highlightKey }) => {
  const selectedLayout = useSelector((state: RootState) => state.auth.keyboardLayout) as KeyboardLayoutType;
  const layout = layouts[selectedLayout] || layouts.qwerty;

  const isHighlighted = (key: string) => {
    if (!highlightKey) return false;
    const normalizedKey = key.toUpperCase();
    const normalizedHighlight = highlightKey.toUpperCase();
    
    // Handle special cases like space or punctuation if needed
    if (highlightKey === " " && key.toLowerCase() === "space") return true;
    
    return normalizedKey === normalizedHighlight;
  };

  return (
    <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-orange-100/50 shadow-inner space-y-2.5 max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">Visual Guide</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{selectedLayout} layout</span>
      </div>
      
      {layout.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-2 justify-center">
          {row.map((key, keyIdx) => {
            const active = isHighlighted(key);
            return (
              <div 
                key={keyIdx} 
                className={`min-w-[48px] h-[48px] rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-200
                  ${active 
                    ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30 z-10" 
                    : "bg-white border border-gray-100 text-gray-400"}`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Space bar */}
      <div className="flex justify-center pt-2">
        <div 
          className={`w-[320px] h-[48px] rounded-xl flex items-center justify-center text-[10px] font-bold tracking-[0.3em] shadow-sm transition-all duration-200 uppercase
            ${isHighlighted(" ") 
              ? "bg-orange-500 text-white scale-105 shadow-lg shadow-orange-500/30 z-10" 
              : "bg-white border border-gray-100 text-gray-300"}`}
        >
          Space
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
