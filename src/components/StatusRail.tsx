import type { AgentMode } from "../types";
import { AgentMark, PersonMark } from "./Icons";

export function StatusRail({ humanText, agentText, agentMode }: { humanText: string; agentText: string; agentMode: AgentMode }) {
  return (
    <footer className="status-rail" aria-label="Collaboration status">
      <div className="actor-status human-status">
        <span className="actor-icon"><PersonMark /></span>
        <span className="status-dot" />
        <span>{humanText}</span>
      </div>
      <div className="status-divider" />
      <div className={`actor-status agent-status status-${agentMode}`}>
        <span className="actor-icon"><AgentMark /></span>
        <span className="status-dot" />
        <span>{agentText}</span>
      </div>
    </footer>
  );
}
