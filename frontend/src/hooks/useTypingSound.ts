import { useRef } from "react";
import useSound from "use-sound";

import typeSound from "../assets/sounds/key.wav";
import errorSound from "../assets/sounds/error.wav";

export const useTypingSound = () => {
  const [playType] = useSound(typeSound, {
    volume: 0.5,
    interrupt: true,
  });

  const [playError] = useSound(errorSound, {
    volume: 0.5,
    interrupt: true,
  });



  const lastPlayRef = useRef(0);

  const playSafe = (fn: () => void) => {
    console.log("playSafe called");
    const now = Date.now();
    if (now - lastPlayRef.current > 30) {
      fn();
      lastPlayRef.current = now;
    }
  };

  const playTyping = () => playSafe(playType);
  const playTypingError = () => playSafe(playError);

  return { playTyping, playTypingError };
};