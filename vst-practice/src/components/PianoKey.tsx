import { Note } from "../types/type";
import styles from "../App.module.css";

interface PianoKeyProps {
  note: Note;
  isActive: boolean;
  position: number;
  onStart: () => void;
  onStop: () => void;
}

export function PianoKey({
  note,
  isActive,
  position,
  onStart,
  onStop,
}: PianoKeyProps) {
  const isWhite = note.type === "white";
  const width = isWhite ? 50 : 30;

  return (
    <div
      className={`${styles.key} ${
        isWhite ? styles.whiteKey : styles.blackKey
      } ${isActive ? styles.active : ""}`}
      style={{
        left: `${position}px`,
        position: "absolute",
        width: `${width}px`,
      }}
      onMouseDown={onStart}
      onMouseUp={onStop}
      onMouseLeave={onStop}
    >
      {note.note}
    </div>
  );
}
