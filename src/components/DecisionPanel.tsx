import type { Decision } from "../types";

type DecisionPanelProps = {
  decision: Decision | null;
  onChoose: (optionId: string) => void;
  onTakeOver: () => void;
};

export function DecisionPanel({ decision, onChoose, onTakeOver }: DecisionPanelProps) {
  return (
    <aside className={`decision-panel ${decision ? "is-visible" : ""}`} aria-live="polite" data-testid="decision-panel">
      {decision ? (
        <>
          <div className="decision-waiting"><span />Agent is waiting for you</div>
          <h2>{decision.title}</h2>
          {decision.message && <p>{decision.message}</p>}
          <div className="choice-list">
            {decision.options.map((option, index) => (
              <button key={option.id} type="button" onClick={() => onChoose(option.id)}>
                <span className="choice-preview">
                  <span className={`chair-mini chair-mini-${index + 1}`} />
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          <button className="take-over" type="button" onClick={onTakeOver}>
            I'll decide
          </button>
        </>
      ) : (
        <div className="decision-empty">
          <span className="waiting-orbit" />
          <strong>Agent at work</strong>
          <p>When a decision needs your taste, the options will appear here.</p>
        </div>
      )}
    </aside>
  );
}
