import { Note } from "../types/type";

export const NOTES: Note[] = [
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
