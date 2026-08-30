type IconProps = { size?: number; className?: string };

const baseProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export function UndoIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M9 7 4.5 11.5 9 16" />
      <path d="M5 11.5h8.2a6 6 0 1 1 0 12" transform="translate(0 -5.5)" />
    </svg>
  );
}

export function ResetIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="M4.8 8.2A8 8 0 1 1 4 14" />
      <path d="M4.8 3.8v4.4h4.4" />
    </svg>
  );
}

export function PlayIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <path d="m9 7 7 5-7 5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LockIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="5.5" y="10" width="13" height="10" rx="2.5" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </svg>
  );
}

export function UnlockIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="5.5" y="10" width="13" height="10" rx="2.5" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 6.1-2.3" />
    </svg>
  );
}

export function AgentMark({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <rect x="4" y="7" width="16" height="12" rx="4" />
      <path d="M12 4v3M8.5 12h.01M15.5 12h.01M9 16h6" />
    </svg>
  );
}

export function PersonMark({ size = 22, className }: IconProps) {
  return (
    <svg {...baseProps(size, className)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

