import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./App.module.css";

const notes = [
  { key: "a", note: "C4", freq: 261.63, type: "white" },
  { key: "w", note: "C#4", freq: 277.18, type: "black", offset: -10 },
  { key: "s", note: "D4", freq: 293.66, type: "white" },
  { key: "e", note: "D#4", freq: 311.13, type: "black", offset: -10 },
  { key: "d", note: "E4", freq: 329.63, type: "white" },
  { key: "f", note: "F4", freq: 349.23, type: "white" },
  { key: "t", note: "F#4", freq: 369.99, type: "black", offset: -10 },
  { key: "g", note: "G4", freq: 392.0, type: "white" },
  { key: "y", note: "G#4", freq: 415.3, type: "black", offset: -10 },
  { key: "h", note: "A4", freq: 440.0, type: "white" },
  { key: "u", note: "A#4", freq: 466.16, type: "black", offset: -10 },
  { key: "j", note: "B4", freq: 493.88, type: "white" },
];

export default function App() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const gainNodesRef = useRef<Map<string, GainNode>>(new Map());
  const activeKeysRef = useRef<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const initAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (audioCtxRef.current.state) {
      console.log("AudioContext state: ", audioCtxRef.current.state);
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

    console.log(gainNode);

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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const mappedKey = event.code.replace("Key", "").toLowerCase();

      const noteObj = notes.find((n) => n.key === mappedKey);
      if (noteObj && !activeKeysRef.current.has(event.key)) {
        initAudioContext();
        playNote(event.key, noteObj.freq);

        activeKeysRef.current.add(mappedKey);
        setActiveKeys(new Set(activeKeysRef.current));
      }
    },
    [initAudioContext, playNote]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const mappedKey = event.code.replace("Key", "").toLowerCase();

      if (activeKeysRef.current.has(mappedKey)) {
        stopNote(event.key);
        activeKeysRef.current.delete(mappedKey);
        setActiveKeys(new Set(activeKeysRef.current));
      }
    },
    [stopNote]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      activeKeysRef.current.forEach((key) => stopNote(key));
    };
  }, [handleKeyDown, handleKeyUp, stopNote]);

  const getKeyPosition = (index: number, type: string, offset?: number) => {
    const baseWidth = 50;
    let position = 0;

    if (type === "white") {
      position = index * baseWidth;
    } else if (type === "black" && offset !== undefined) {
      const whiteKeyIndex = notes.filter(
        (n, i) => i < index && n.type === "white"
      ).length;
      position = whiteKeyIndex * baseWidth + offset;
    }

    return position;
  };

  return (
    <div className={styles.piano}>
      {notes
        .filter((note) => note.type === "white")
        .map((note, index) => (
          <div
            key={note.note}
            className={`${styles.key} ${styles.whiteKey} ${
              activeKeys.has(note.key) ? styles.active : ""
            }`}
            style={{
              left: `${getKeyPosition(index, "white")}px`,
              position: "absolute",
              width: "50px",
            }}
            onMouseDown={() => {
              initAudioContext();
              playNote(note.key, note.freq);
              activeKeysRef.current.add(note.key);
              setActiveKeys(new Set(activeKeysRef.current));
            }}
            onMouseUp={() => {
              stopNote(note.key);
              activeKeysRef.current.delete(note.key);
              setActiveKeys(new Set(activeKeysRef.current));
            }}
            onMouseLeave={() => {
              if (activeKeysRef.current.has(note.key)) {
                stopNote(note.key);
                activeKeysRef.current.delete(note.key);
                setActiveKeys(new Set(activeKeysRef.current));
              }
            }}
          >
            {note.note}
          </div>
        ))}
      {notes
        .filter((note) => note.type === "black")
        .map((note) => (
          <div
            key={note.note}
            className={`${styles.key} ${styles.blackKey} ${
              activeKeys.has(note.key) ? styles.active : ""
            }`}
            style={{
              left: `${getKeyPosition(
                notes.indexOf(note),
                "black",
                note.offset
              )}px`,
              position: "absolute",
              width: "30px",
            }}
            onMouseDown={() => {
              initAudioContext();
              playNote(note.key, note.freq);
              activeKeysRef.current.add(note.key);
              setActiveKeys(new Set(activeKeysRef.current));
            }}
            onMouseUp={() => {
              stopNote(note.key);
              activeKeysRef.current.delete(note.key);
              setActiveKeys(new Set(activeKeysRef.current));
            }}
            onMouseLeave={() => {
              if (activeKeysRef.current.has(note.key)) {
                stopNote(note.key);
                activeKeysRef.current.delete(note.key);
                setActiveKeys(new Set(activeKeysRef.current));
              }
            }}
          >
            {note.note}
          </div>
        ))}
    </div>
  );
}
