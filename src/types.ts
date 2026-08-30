export type FurnitureKind = "bed" | "desk" | "chair" | "sofa" | "lamp" | "plant";

export type FurnitureItem = {
  id: FurnitureKind;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked?: boolean;
};

export type Point = { x: number; y: number };

export type AgentMode = "idle" | "observing" | "guiding" | "working" | "waiting" | "done";

export type ChoiceOption = {
  id: string;
  label: string;
  itemId: FurnitureKind;
  x: number;
  y: number;
  rotation?: number;
};

export type Decision = {
  title: string;
  message?: string;
  options: [ChoiceOption, ChoiceOption];
};

export type HistoryEntry = {
  items: FurnitureItem[];
  actor: "human" | "agent";
  description: string;
};
