import type { AgentMode, Point } from "../types";

type AgentCursorProps = {
  position: Point;
  mode: AgentMode;
  status: string;
};

export function AgentCursor({ position, mode, status }: AgentCursorProps) {
  return (
    <g
      className={`agent-cursor mode-${mode}`}
      data-testid="agent-cursor"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      pointerEvents="none"
    >
      <circle className="agent-pulse" cx="0" cy="0" r="14" />
      <path className="agent-pointer-shadow" d="M0 0 4 33 13 24 22 42 29 38 20 21 34 19Z" />
      <path className="agent-pointer" d="M0 0 4 33 13 24 22 42 29 38 20 21 34 19Z" />
      <foreignObject x="30" y="21" width="150" height="38">
        <div className="agent-label">{status}</div>
      </foreignObject>
    </g>
  );
}

export function HumanCursor({ position, visible }: { position: Point; visible: boolean }) {
  return (
    <g
      className={`human-cursor ${visible ? "is-visible" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      pointerEvents="none"
      data-testid="human-cursor"
    >
      <path className="human-pointer-shadow" d="M0 0 4 33 13 24 22 42 29 38 20 21 34 19Z" />
      <path className="human-pointer" d="M0 0 4 33 13 24 22 42 29 38 20 21 34 19Z" />
    </g>
  );
}

