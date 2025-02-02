export interface Note {
  key: string;
  note: string;
  freq: number;
  type: "white" | "black";
  offset?: number;
}
