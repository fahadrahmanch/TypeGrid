import { useRef } from "react";
import useSound from "use-sound";

export const useTypingSound = () => {
 const [playType] = useSound("https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/sound/click1/click1_1.wav", {
  volume: 1,
  interrupt: true,
});

const [playError] = useSound("https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/sound/error1/error1_1.wav", {
  volume: 1,
  interrupt: true,
});

  const lastPlayRef = useRef(0);

  const playSafe = (fn: () => void) => {

    const now = Date.now();

    if (now - lastPlayRef.current > 30) {
      fn();
      lastPlayRef.current = now;
    }
  };

  const playTyping = () => {
    playSafe(playType);
  };

  const playTypingError = () => {
    playSafe(playError);
  };

  return {
    playTyping,
    playTypingError,
  };
};