import { PlayIcon, ResetIcon, UndoIcon } from "./Icons";

export function Header({ onDemo, onReset, onUndo, canUndo, demoRunning, webMcpReady }: {
  onDemo: () => void;
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  demoRunning: boolean;
  webMcpReady: boolean;
}) {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand">Second Cursor<span className={webMcpReady ? "is-ready" : ""} title={webMcpReady ? "WebMCP Site tools ready" : "WebMCP is not enabled in this browser"} /></div>
        <div className="brand-rule" />
        <h1>Moving Day</h1>
        <p>You shape the life. I organize the space.</p>
      </div>
      <nav className="header-actions" aria-label="Canvas controls">
        <button type="button" className="demo-button" onClick={onDemo} disabled={demoRunning}>
          <PlayIcon />{demoRunning ? "Demo running" : "Play demo"}
        </button>
        <button type="button" onClick={onReset}><ResetIcon />Reset</button>
        <button type="button" onClick={onUndo} disabled={!canUndo}><UndoIcon />Undo</button>
      </nav>
    </header>
  );
}
