import { useEffect, useRef } from "react";
import * as Tone from "tone";

export const useTypingSound = () => {
  const clickSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const errorSynthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    // EdClub-style Click: A high-pitched, short "pop" or "tick"
    clickSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.001,
      octaves: 1,
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.001,
        decay: 0.015,
        sustain: 0,
        release: 0.01
      }
    }).toDestination();
    clickSynthRef.current.volume.value = -12;

    // EdClub-style Error: A blunt, low-frequency buzzer
    errorSynthRef.current = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    errorSynthRef.current.volume.value = 12;

    // Aggressive compression and limiting for maximum perceived loudness
    const compressor = new Tone.Compressor({
      threshold: -30,
      ratio: 12,
      attack: 0.003,
      release: 0.1
    }).toDestination();
    const limiter = new Tone.Limiter(-0.1).toDestination();

    clickSynthRef.current.connect(compressor);
    errorSynthRef.current.connect(compressor);
    compressor.connect(limiter);

    const initAudio = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
    };

    window.addEventListener("mousedown", initAudio);
    window.addEventListener("keydown", initAudio);

    return () => {
      window.removeEventListener("mousedown", initAudio);
      window.removeEventListener("keydown", initAudio);
      clickSynthRef.current?.dispose();
      errorSynthRef.current?.dispose();
    };
  }, []);

  const playTyping = async () => {
    if (Tone.context.state !== "running") await Tone.start();
    // EdClub style: high-pitched short burst (1200Hz)
    clickSynthRef.current?.triggerAttackRelease(1200, "32n");
  };

  const playTypingError = async () => {
    if (Tone.context.state !== "running") await Tone.start();
    // EdClub style: blunt low thud (G1)
    errorSynthRef.current?.triggerAttackRelease("G1", "16n");
  };

  return { playTyping, playTypingError };
};