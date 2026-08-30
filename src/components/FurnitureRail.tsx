import type { FurnitureItem, FurnitureKind } from "../types";
import { LockIcon, UnlockIcon } from "./Icons";

const miniArt: Record<FurnitureKind, React.ReactNode> = {
  bed: <><rect x="5" y="10" width="42" height="28" rx="5"/><path d="M8 21h36M17 12v9"/></>,
  desk: <><rect x="6" y="10" width="40" height="20" rx="3"/><path d="M11 30v12M41 30v12M22 17h17"/></>,
  chair: <><rect x="16" y="7" width="22" height="20" rx="6"/><rect x="12" y="25" width="30" height="15" rx="6"/><path d="M27 40v8M15 48h24"/></>,
  sofa: <><rect x="5" y="14" width="42" height="27" rx="8"/><path d="M14 15v25M38 15v25M6 28h41"/></>,
  lamp: <><path d="M14 42h26M27 41V18l12-8"/><path d="M34 7h13l-3 14H31Z"/></>,
  plant: <><path d="M18 31h20l-3 14H21Z"/><path d="M28 31V8M28 20 16 10M29 18 40 7"/></>,
};

type FurnitureRailProps = {
  items: FurnitureItem[];
  selectedId: FurnitureKind | null;
  onSelect: (id: FurnitureKind) => void;
  onToggleLock: (id: FurnitureKind) => void;
};

export function FurnitureRail({ items, selectedId, onSelect, onToggleLock }: FurnitureRailProps) {
  return (
    <aside className="furniture-rail" aria-label="Furniture list">
      <div className="rail-heading">FURNITURE</div>
      <div className="furniture-list">
        {items.map((item) => (
          <button
            className={`furniture-tile ${selectedId === item.id ? "is-selected" : ""}`}
            key={item.id}
            onClick={() => onSelect(item.id)}
            type="button"
          >
            <svg viewBox="0 0 54 54" className={`mini-furniture mini-${item.id}`} aria-hidden="true">
              {miniArt[item.id]}
            </svg>
            <span>{item.label}</span>
            <span
              className={`lock-toggle ${item.locked ? "is-locked" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={item.locked ? `Allow Agent to move ${item.label}` : `Prevent Agent from moving ${item.label}`}
              onClick={(event) => {
                event.stopPropagation();
                onToggleLock(item.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleLock(item.id);
                }
              }}
            >
              {item.locked ? <LockIcon /> : <UnlockIcon />}
            </span>
          </button>
        ))}
      </div>
      <p className="rail-help">Lock an item and the Agent will preserve your decision.</p>
    </aside>
  );
}
