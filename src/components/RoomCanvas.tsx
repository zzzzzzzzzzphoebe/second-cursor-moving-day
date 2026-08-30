import { useRef } from "react";
import { ROOM_BOUNDS } from "../data";
import type { AgentMode, Decision, FurnitureItem, FurnitureKind, Point } from "../types";
import { AgentCursor, HumanCursor } from "./AgentCursor";
import { Furniture } from "./Furniture";

type DragState = {
  id: FurnitureKind;
  offsetX: number;
  offsetY: number;
} | null;

type RoomCanvasProps = {
  items: FurnitureItem[];
  selectedId: FurnitureKind | null;
  activeAgentItem: FurnitureKind | null;
  agentPosition: Point;
  agentMode: AgentMode;
  agentStatus: string;
  humanPosition: Point;
  humanVisible: boolean;
  issue: { message: string } | null;
  decision: Decision | null;
  onHumanPosition: (point: Point, visible: boolean) => void;
  onDragStart: (id: FurnitureKind) => void;
  onDragMove: (id: FurnitureKind, point: Point) => void;
  onDragEnd: (id: FurnitureKind) => void;
  onSelect: (id: FurnitureKind) => void;
  onRotate: (id: FurnitureKind) => void;
};

function toSvgPoint(svg: SVGSVGElement, event: React.PointerEvent<SVGSVGElement | SVGGElement>): Point {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  return matrix ? point.matrixTransform(matrix.inverse()) : { x: event.clientX, y: event.clientY };
}

export function RoomCanvas({
  items,
  selectedId,
  activeAgentItem,
  agentPosition,
  agentMode,
  agentStatus,
  humanPosition,
  humanVisible,
  issue,
  decision,
  onHumanPosition,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSelect,
  onRotate,
}: RoomCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState>(null);

  const pointerDown = (event: React.PointerEvent<SVGGElement>, item: FurnitureItem) => {
    const svg = svgRef.current;
    if (!svg) return;
    event.preventDefault();
    const point = toSvgPoint(svg, event);
    dragRef.current = { id: item.id, offsetX: point.x - item.x, offsetY: point.y - item.y };
    svg.setPointerCapture(event.pointerId);
    onSelect(item.id);
    onDragStart(item.id);
  };

  const pointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const point = toSvgPoint(svg, event);
    onHumanPosition(point, true);
    const drag = dragRef.current;
    if (!drag) return;
    onDragMove(drag.id, { x: point.x - drag.offsetX, y: point.y - drag.offsetY });
  };

  const pointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (drag) onDragEnd(drag.id);
    dragRef.current = null;
    if (svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId);
  };

  const chair = items.find((item) => item.id === "chair");

  return (
    <main className="canvas-shell" data-testid="room-canvas">
      <svg
        ref={svgRef}
        className="room-canvas"
        viewBox="0 0 900 620"
        role="application"
        aria-label="Moving Day room layout canvas"
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        onPointerEnter={(event) => {
          const svg = svgRef.current;
          if (svg) onHumanPosition(toSvgPoint(svg, event), true);
        }}
        onPointerLeave={() => {
          if (!dragRef.current) onHumanPosition(humanPosition, false);
        }}
      >
        <defs>
          <pattern id="oak-floor" width="120" height="44" patternUnits="userSpaceOnUse">
            <rect width="120" height="44" fill="#e9d7be" />
            <path d="M0 0h120M0 44h120M60 0v44" stroke="#d8bea0" strokeWidth="1" opacity=".52" />
            <path d="M9 12c22 3 45 1 72-2M76 32c15-2 28-1 41 2" stroke="#c9ae8e" strokeWidth=".7" opacity=".42" fill="none" />
          </pattern>
          <filter id="furniture-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#4c3925" floodOpacity=".18" />
          </filter>
          <filter id="cursor-shadow" x="-50%" y="-50%" width="220%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#07111f" floodOpacity=".3" />
          </filter>
          <linearGradient id="window-light" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#fffdf7" stopOpacity=".9" />
            <stop offset="1" stopColor="#f8efdc" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect x="17" y="12" width="866" height="594" rx="20" fill="#eee9df" />
        <rect x={ROOM_BOUNDS.x} y={ROOM_BOUNDS.y} width={ROOM_BOUNDS.width} height={ROOM_BOUNDS.height} rx="4" fill="url(#oak-floor)" stroke="#4b4740" strokeWidth="20" />
        <rect x="266" y="50" width="340" height="19" fill="#f8f5ed" stroke="#777069" strokeWidth="3" />
        <path d="M278 50v22M593 50v22" stroke="#615b55" strokeWidth="8" />
        <path d="M304 69v106h267V69" fill="url(#window-light)" opacity=".55" />
        <path d="M737 570h109v-114" fill="#f8f6f0" stroke="#4b4740" strokeWidth="20" />

        <g className={`door-guide ${issue ? "is-active" : ""}`}>
          <path d="M736 553V438a115 115 0 0 1 115 115" fill="rgba(20, 100, 255, .055)" stroke="#1464ff" strokeWidth="2" strokeDasharray="8 7" />
          <path d="M738 551 820 469" stroke="#8a572f" strokeWidth="17" strokeLinecap="round" />
          {issue && (
            <foreignObject x="672" y="394" width="178" height="42">
              <div className="issue-label">{issue.message}</div>
            </foreignObject>
          )}
        </g>

        <rect x="118" y="286" width="250" height="180" rx="7" fill="#cdbda8" opacity=".48" />
        <path d="M128 296h230v160H128z" fill="none" stroke="#b7a38a" strokeWidth="2" strokeDasharray="2 7" />
        <ellipse cx="405" cy="350" rx="66" ry="49" fill="#a66e42" stroke="#6e472a" strokeWidth="3" filter="url(#furniture-shadow)" />
        <circle cx="382" cy="337" r="11" fill="#789563" />
        <rect x="414" y="341" width="34" height="25" rx="2" transform="rotate(14 414 341)" fill="#eee8dc" stroke="#8d8172" />

        {decision && chair && decision.options.map((option) => (
          <g key={option.id} className="ghost-chair" transform={`translate(${option.x} ${option.y}) rotate(${option.rotation ?? 0} 36 39)`}>
            <rect x="19" y="9" width="34" height="32" rx="9" />
            <rect x="13" y="35" width="46" height="30" rx="10" />
            <path d="M36 65v9M18 75h36" />
          </g>
        ))}

        <g filter="url(#furniture-shadow)">
          {items.map((item) => (
            <Furniture
              key={item.id}
              item={item}
              selected={selectedId === item.id}
              agentActive={activeAgentItem === item.id}
              onPointerDown={pointerDown}
              onDoubleClick={(target) => onRotate(target.id)}
            />
          ))}
        </g>

        <g className="agent-trail" style={{ transform: `translate(${agentPosition.x}px, ${agentPosition.y}px)` }} pointerEvents="none">
          <circle cx="-18" cy="31" r="6" />
          <circle cx="-38" cy="45" r="5" />
          <circle cx="-58" cy="51" r="3.5" />
        </g>
        <AgentCursor position={agentPosition} mode={agentMode} status={agentStatus} />
        <HumanCursor position={humanPosition} visible={humanVisible} />
      </svg>
      <div className="canvas-caption">
        <span>Drag furniture to shape the room</span>
        <span>Double-click an item to rotate it 90°</span>
      </div>
    </main>
  );
}
