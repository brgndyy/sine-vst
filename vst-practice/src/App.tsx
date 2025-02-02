import { NOTES } from "./constants/note";
import { useAudio } from "./hooks/useAudio";
import { useKeyboardEvents } from "./hooks/useKeyboardEvents";
import { PianoKey } from "./components/PianoKey";
import { getKeyPosition } from "./utils/pianoUtil";
import styles from "./App.module.css";
import { Note } from "./types/type";

export default function App() {
  const { initAudioContext, playNote, stopNote } = useAudio();
  const { activeKeys, activeKeysRef, setActiveKeys } = useKeyboardEvents(
    NOTES,
    playNote,
    stopNote,
    initAudioContext
  );

  const handleNoteStart = (note: Note) => {
    initAudioContext();
    playNote(note.key, note.freq);
    activeKeysRef.current.add(note.key);
    setActiveKeys(new Set(activeKeysRef.current));
  };

  const handleNoteStop = (note: Note) => {
    stopNote(note.key);
    activeKeysRef.current.delete(note.key);
    setActiveKeys(new Set(activeKeysRef.current));
  };

  return (
    <div className={styles.piano}>
      {NOTES.filter((note) => note.type === "white").map((note, index) => (
        <PianoKey
          key={note.note}
          note={note}
          isActive={activeKeys.has(note.key)}
          position={getKeyPosition(NOTES, index, "white")}
          onStart={() => handleNoteStart(note)}
          onStop={() => handleNoteStop(note)}
        />
      ))}
      {NOTES.filter((note) => note.type === "black").map((note) => (
        <PianoKey
          key={note.note}
          note={note}
          isActive={activeKeys.has(note.key)}
          position={getKeyPosition(
            NOTES,
            NOTES.indexOf(note),
            "black",
            note.offset
          )}
          onStart={() => handleNoteStart(note)}
          onStop={() => handleNoteStop(note)}
        />
      ))}
    </div>
  );
}
