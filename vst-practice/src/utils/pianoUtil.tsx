import { Note } from "../types/type";

export function getKeyPosition(
  notes: Note[],
  index: number,
  type: string,
  offset?: number
) {
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
}
