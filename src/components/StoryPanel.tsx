import { useEffect } from "react";
import { CloseIcon } from "./Icons";

const pillars = [
  {
    number: "01",
    title: "Shared surface",
    body: "Human and Agent act on the same live room. No context copying, no hidden parallel workspace.",
  },
  {
    number: "02",
    title: "Visible intent",
    body: "The blue cursor reveals what the Agent targets, what it plans to change, and when it waits.",
  },
  {
    number: "03",
    title: "Human authority",
    body: "Locks, live grabs, and choice handoffs keep taste and final control with the human.",
  },
];

export function StoryPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="story-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="story-card" role="dialog" aria-modal="true" aria-labelledby="story-title">
        <button type="button" className="story-close" onClick={onClose} aria-label="Close story">
          <CloseIcon />
        </button>
        <p className="story-eyebrow">A NEW INTERACTION MODEL</p>
        <h2 id="story-title">AI should not work<br />behind the curtain.</h2>
        <p className="story-lede">
          Second Cursor turns agent behavior into visible, interruptible action. It does not expose private reasoning. It discloses what matters for trust: intent, progress, changes, and control.
        </p>
        <div className="story-pillars">
          {pillars.map((pillar) => (
            <article className="story-pillar" key={pillar.number}>
              <span>{pillar.number}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
        <div className="story-footer">
          <div className="tool-strip" aria-label="Six WebMCP capabilities">
            {['Inspect', 'Guide', 'Move', 'Rotate', 'Ask', 'Finish'].map((tool) => <span key={tool}>{tool}</span>)}
          </div>
          <button type="button" className="story-enter" onClick={onClose}>Enter the shared workspace <span aria-hidden="true">→</span></button>
        </div>
      </section>
    </div>
  );
}
