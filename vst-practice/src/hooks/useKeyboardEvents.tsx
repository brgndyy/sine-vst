import { useCallback, useEffect, useRef, useState } from "react";
import { Note } from "../types/type";

export function useKeyboardEvents(
  notes: Note[],
  playNote: (key: string, freq: number) => void,
  stopNote: (key: string) => void,
  initAudioContext: () => void
) {
  const activeKeysRef = useRef<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

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
    [initAudioContext, playNote, notes]
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

  return { activeKeys, activeKeysRef, setActiveKeys };
}
