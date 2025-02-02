import { useRef, useCallback } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());

  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  const playNote = useCallback((key: string, freq: number) => {
    if (!audioCtxRef.current) return;

    if (oscillatorsRef.current.has(key)) {
      const oldOsc = oscillatorsRef.current.get(key);
      const oldGain = gainNodesRef.current.get(key);
      if (oldOsc && oldGain) {
        oldGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        oldOsc.stop(audioCtxRef.current.currentTime + 0.1);
      }
    }

    const oscillator = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioCtxRef.current.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    oscillator.start();
    oscillatorsRef.current.set(key, oscillator);
    gainNodesRef.current.set(key, gainNode);
  }, []);

  const stopNote = useCallback((key: string) => {
    if (!audioCtxRef.current) return;

    const oscillator = oscillatorsRef.current.get(key);
    const gainNode = gainNodesRef.current.get(key);

    if (oscillator && gainNode) {
      gainNode.gain.setValueAtTime(
        gainNode.gain.value,
        audioCtxRef.current.currentTime
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtxRef.current.currentTime + 0.1
      );
      oscillator.stop(audioCtxRef.current.currentTime + 0.1);
      oscillatorsRef.current.delete(key);
      gainNodesRef.current.delete(key);
    }
  }, []);

  return { initAudioContext, playNote, stopNote };
}
