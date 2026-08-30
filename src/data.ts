import type { FurnitureItem } from "./types";

export const ROOM_BOUNDS = { x: 54, y: 48, width: 792, height: 524 };

export const INITIAL_ITEMS: FurnitureItem[] = [
  { id: "bed", label: "Bed", x: 88, y: 78, width: 250, height: 132, rotation: 0, locked: true },
  { id: "desk", label: "Desk", x: 566, y: 174, width: 164, height: 88, rotation: 0 },
  { id: "chair", label: "Chair", x: 604, y: 284, width: 72, height: 78, rotation: 0 },
  { id: "sofa", label: "Sofa", x: 130, y: 296, width: 176, height: 112, rotation: 90 },
  { id: "lamp", label: "Floor lamp", x: 372, y: 412, width: 54, height: 58, rotation: 0 },
  { id: "plant", label: "Plant", x: 176, y: 442, width: 64, height: 72, rotation: 0, locked: true },
];

export const FURNITURE_LABELS = INITIAL_ITEMS.map(({ id, label }) => ({ id, label }));

export const DEFAULT_DECISION = {
  title: "Where should the chair go?",
  message: "Both placements keep the walkway clear. You decide how the room should feel.",
  options: [
    { id: "window", label: "By the window", itemId: "chair", x: 510, y: 260, rotation: -12 },
    { id: "wall", label: "Along the wall", itemId: "chair", x: 690, y: 294, rotation: 0 },
  ],
} as const;
