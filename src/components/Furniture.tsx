import type { FurnitureItem } from "../types";
import { LockIcon } from "./Icons";

type FurnitureProps = {
  item: FurnitureItem;
  selected: boolean;
  agentActive: boolean;
  onPointerDown: (event: React.PointerEvent<SVGGElement>, item: FurnitureItem) => void;
  onDoubleClick: (item: FurnitureItem) => void;
};

function Bed() {
  return (
    <>
      <rect width="250" height="132" rx="10" fill="#c59a6c" />
      <rect x="7" y="7" width="236" height="118" rx="8" fill="#f4eee5" stroke="#8d755e" strokeWidth="2" />
      <rect x="16" y="14" width="54" height="46" rx="8" fill="#fffaf3" stroke="#d8cab9" />
      <rect x="78" y="14" width="54" height="46" rx="8" fill="#fffaf3" stroke="#d8cab9" />
      <rect x="145" y="7" width="74" height="118" fill="#ba6c4d" opacity=".92" />
      <line x1="8" y1="68" x2="242" y2="68" stroke="#d8cab9" />
    </>
  );
}

function Desk() {
  return (
    <>
      <rect x="5" y="7" width="154" height="72" rx="7" fill="#a87243" stroke="#704927" strokeWidth="2" />
      <rect x="61" y="21" width="60" height="38" rx="4" fill="#3e4547" />
      <rect x="66" y="25" width="50" height="26" rx="2" fill="#7c9799" />
      <path d="M67 58h49M19 79v9M145 79v9" stroke="#704927" strokeWidth="5" strokeLinecap="round" />
      <circle cx="30" cy="31" r="10" fill="#789563" />
      <circle cx="25" cy="27" r="5" fill="#9dbb83" />
    </>
  );
}

function Chair() {
  return (
    <>
      <rect x="19" y="9" width="34" height="32" rx="9" fill="#68735a" stroke="#3f4937" strokeWidth="2" />
      <rect x="13" y="35" width="46" height="30" rx="10" fill="#7f8b70" stroke="#3f4937" strokeWidth="2" />
      <path d="M36 65v9M18 75h36M17 74l-7 4M55 74l7 4" stroke="#3f4937" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 42H7M59 42h6" stroke="#3f4937" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function Sofa() {
  return (
    <>
      <rect x="4" y="7" width="168" height="98" rx="18" fill="#e4d7c6" stroke="#907f6a" strokeWidth="2" />
      <rect x="20" y="14" width="136" height="35" rx="12" fill="#f2e9de" stroke="#b4a491" />
      <rect x="20" y="55" width="64" height="42" rx="10" fill="#eee3d5" stroke="#b4a491" />
      <rect x="90" y="55" width="66" height="42" rx="10" fill="#eee3d5" stroke="#b4a491" />
      <rect x="4" y="26" width="17" height="64" rx="8" fill="#d0bfa9" />
      <rect x="155" y="26" width="17" height="64" rx="8" fill="#d0bfa9" />
    </>
  );
}

function Lamp() {
  return (
    <>
      <ellipse cx="27" cy="49" rx="21" ry="7" fill="#555d44" />
      <path d="M26 45V18M26 20 42 9" stroke="#444a38" strokeWidth="5" strokeLinecap="round" />
      <path d="M35 6h17l-3 18H32Z" fill="#788263" stroke="#444a38" strokeWidth="2" />
      <circle cx="26" cy="46" r="5" fill="#667052" />
    </>
  );
}

function Plant() {
  return (
    <>
      <path d="M20 50h30l-4 20H24Z" fill="#b56b47" stroke="#7f432d" strokeWidth="2" />
      <path d="M35 52c-1-22 0-31 1-43M35 36c-10-5-17-14-19-22M36 30c9-7 14-14 16-23" stroke="#47633c" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="20" cy="21" rx="10" ry="18" transform="rotate(-42 20 21)" fill="#6f8b59" />
      <ellipse cx="48" cy="15" rx="9" ry="18" transform="rotate(35 48 15)" fill="#789b5e" />
      <ellipse cx="34" cy="15" rx="9" ry="17" fill="#8dab6f" />
      <ellipse cx="19" cy="39" rx="9" ry="16" transform="rotate(-70 19 39)" fill="#597a49" />
      <ellipse cx="49" cy="38" rx="9" ry="16" transform="rotate(70 49 38)" fill="#678a51" />
    </>
  );
}

const art = {
  bed: Bed,
  desk: Desk,
  chair: Chair,
  sofa: Sofa,
  lamp: Lamp,
  plant: Plant,
};

export function Furniture({ item, selected, agentActive, onPointerDown, onDoubleClick }: FurnitureProps) {
  const Art = art[item.id];
  return (
    <g
      data-testid={`furniture-${item.id}`}
      className={`furniture ${selected ? "is-selected" : ""} ${agentActive ? "is-agent-active" : ""}`}
      transform={`translate(${item.x} ${item.y}) rotate(${item.rotation} ${item.width / 2} ${item.height / 2})`}
      onPointerDown={(event) => onPointerDown(event, item)}
      onDoubleClick={() => onDoubleClick(item)}
      role="button"
      aria-label={`${item.label}${item.locked ? ", locked from Agent" : ""}`}
      tabIndex={0}
    >
      <rect className="furniture-hitbox" width={item.width} height={item.height} rx="12" />
      <Art />
      {item.locked && (
        <foreignObject x={item.width - 25} y="5" width="22" height="22" pointerEvents="none">
          <span className="lock-badge"><LockIcon size={13} /></span>
        </foreignObject>
      )}
    </g>
  );
}
