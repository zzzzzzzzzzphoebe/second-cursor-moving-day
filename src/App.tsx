"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { DEFAULT_DECISION, INITIAL_ITEMS, ROOM_BOUNDS } from "./data";
import { DecisionPanel } from "./components/DecisionPanel";
import { FurnitureRail } from "./components/FurnitureRail";
import { Header } from "./components/Header";
import { RoomCanvas } from "./components/RoomCanvas";
import { StatusRail } from "./components/StatusRail";
import { StoryPanel } from "./components/StoryPanel";
import type { AgentMode, ChoiceOption, Decision, FurnitureItem, FurnitureKind, HistoryEntry, Point } from "./types";
import { useWebMcp, type WebMcpActions } from "./useWebMcp";

const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const cloneItems = (items: FurnitureItem[]) => items.map((item) => ({ ...item }));

type AgentState = {
  position: Point;
  mode: AgentMode;
  status: string;
  activeItem: FurnitureKind | null;
};

const initialAgent: AgentState = {
  position: { x: 678, y: 224 },
  mode: "working",
  status: "organizing the workspace",
  activeItem: "desk",
};

export default function App() {
  const [items, setItems] = useState(() => cloneItems(INITIAL_ITEMS));
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<FurnitureKind | null>("plant");
  const [agent, setAgent] = useState<AgentState>(initialAgent);
  const [humanPosition, setHumanPosition] = useState<Point>({ x: 228, y: 492 });
  const [humanVisible, setHumanVisible] = useState(true);
  const [issue, setIssue] = useState<{ message: string } | null>({ message: "Keep the door swing clear" });
  const [decision, setDecision] = useState<Decision | null>(DEFAULT_DECISION as Decision);
  const [humanStatus, setHumanStatus] = useState("You are shaping the rest area");
  const [agentStatus, setAgentStatus] = useState("Agent is organizing the workspace");
  const [notice, setNotice] = useState<string | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const humanDraggingRef = useRef<FurnitureKind | null>(null);
  const dragSnapshotRef = useRef<FurnitureItem[] | null>(null);
  const agentRunRef = useRef(0);
  const decisionResolverRef = useRef<((value: unknown) => void) | null>(null);
  const decisionRejecterRef = useRef<((reason?: unknown) => void) | null>(null);
  const decisionRef = useRef(decision);
  decisionRef.current = decision;

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice((current) => current === message ? null : current), 2800);
  }, []);

  const pushHistory = useCallback((snapshot: FurnitureItem[], actor: "human" | "agent", description: string) => {
    setHistory((current) => [...current, { items: cloneItems(snapshot), actor, description }].slice(-20));
  }, []);

  const itemCenter = useCallback((item: FurnitureItem): Point => ({
    x: item.x + item.width * 0.58,
    y: item.y + item.height * 0.48,
  }), []);

  const animateAgentTo = useCallback(async (point: Point, status: string, mode: AgentMode, activeItem: FurnitureKind | null, runId: number) => {
    setAgent({ position: point, status, mode, activeItem });
    setAgentStatus(`Agent ${status}`);
    await sleep(760);
    return runId === agentRunRef.current;
  }, []);

  const inspectRoom = useCallback(() => ({
    coordinateSystem: { width: 900, height: 620, roomBounds: ROOM_BOUNDS },
    furniture: itemsRef.current.map(({ id, label, x, y, width, height, rotation, locked }) => ({
      id, label, x, y, width, height, rotation, lockedByHuman: Boolean(locked),
    })),
    human: {
      currentlyDragging: humanDraggingRef.current,
      rule: "The human always has priority. Never move locked or human-held furniture.",
    },
    currentDecision: decisionRef.current?.title ?? null,
    constraints: [
      "Keep the door swing area clear.",
      "Keep furniture inside roomBounds.",
      "Respect every lockedByHuman item.",
      "Ask the human when two valid options depend on taste.",
    ],
  }), []);

  const pointOutIssue = useCallback(async (itemId: FurnitureKind, message: string) => {
    const item = itemsRef.current.find((candidate) => candidate.id === itemId);
    if (!item) return { success: false, error: `Unknown furniture: ${itemId}` };
    const runId = ++agentRunRef.current;
    setIssue({ message });
    const completed = await animateAgentTo(itemCenter(item), "is pointing out an issue", "guiding", itemId, runId);
    if (!completed) return { success: false, status: "interrupted_by_human" };
    setAgent((current) => ({ ...current, mode: "waiting", status: "waiting for your confirmation", activeItem: null }));
    setAgentStatus("Agent is waiting for your confirmation");
    return { success: true, pointedAt: itemId, message, changedRoom: false };
  }, [animateAgentTo, itemCenter]);

  const clampPosition = useCallback((item: FurnitureItem, x: number, y: number) => ({
    x: Math.max(ROOM_BOUNDS.x + 12, Math.min(x, ROOM_BOUNDS.x + ROOM_BOUNDS.width - item.width - 12)),
    y: Math.max(ROOM_BOUNDS.y + 12, Math.min(y, ROOM_BOUNDS.y + ROOM_BOUNDS.height - item.height - 12)),
  }), []);

  const moveItem = useCallback(async (itemId: FurnitureKind, x: number, y: number, reason: string) => {
    const item = itemsRef.current.find((candidate) => candidate.id === itemId);
    if (!item) return { success: false, error: `Unknown furniture: ${itemId}` };
    if (item.locked) {
      setAgent((current) => ({ ...current, mode: "waiting", status: "respecting your decision", activeItem: null }));
      return { success: false, status: "locked_by_human", message: `${item.label} is locked by the human.` };
    }
    if (humanDraggingRef.current === itemId) return { success: false, status: "human_has_priority" };

    const runId = ++agentRunRef.current;
    const snapshot = cloneItems(itemsRef.current);
    const reached = await animateAgentTo(itemCenter(item), reason, "working", itemId, runId);
    if (!reached || humanDraggingRef.current === itemId) {
      setAgent((current) => ({ ...current, mode: "waiting", status: "yielded the item", activeItem: null }));
      return { success: false, status: "interrupted_by_human" };
    }

    const next = clampPosition(item, x, y);
    pushHistory(snapshot, "agent", `${reason}: moved ${item.label}`);
    setItems((current) => current.map((candidate) => candidate.id === itemId ? { ...candidate, ...next } : candidate));
    setIssue(null);
    await sleep(360);
    setAgent((current) => ({ ...current, position: itemCenter({ ...item, ...next }), mode: "done", status: "done", activeItem: null }));
    setAgentStatus(`Agent moved ${item.label}`);
    return { success: true, itemId, position: next, reason };
  }, [animateAgentTo, clampPosition, itemCenter, pushHistory]);

  const rotateItem = useCallback(async (itemId: FurnitureKind, degrees: number, reason: string) => {
    const item = itemsRef.current.find((candidate) => candidate.id === itemId);
    if (!item) return { success: false, error: `Unknown furniture: ${itemId}` };
    if (item.locked) return { success: false, status: "locked_by_human" };
    if (humanDraggingRef.current === itemId) return { success: false, status: "human_has_priority" };
    const runId = ++agentRunRef.current;
    const snapshot = cloneItems(itemsRef.current);
    const reached = await animateAgentTo(itemCenter(item), reason, "working", itemId, runId);
    if (!reached) return { success: false, status: "interrupted_by_human" };
    pushHistory(snapshot, "agent", `${reason}: rotated ${item.label}`);
    const rotation = (item.rotation + degrees) % 360;
    setItems((current) => current.map((candidate) => candidate.id === itemId ? { ...candidate, rotation } : candidate));
    setAgent((current) => ({ ...current, mode: "done", status: "done", activeItem: null }));
    setAgentStatus(`Agent rotated ${item.label}`);
    return { success: true, itemId, rotation, reason };
  }, [animateAgentTo, itemCenter, pushHistory]);

  const requestChoice = useCallback(async (
    title: string,
    message: string,
    options: [ChoiceOption, ChoiceOption],
    signal?: AbortSignal,
  ) => {
    if (decisionResolverRef.current) return { success: false, status: "another_choice_is_pending" };
    setDecision({ title, message, options });
    const targetItem = itemsRef.current.find((item) => item.id === options[0].itemId);
    if (targetItem) {
      const runId = ++agentRunRef.current;
      await animateAgentTo(itemCenter(targetItem), "is waiting for your decision", "waiting", targetItem.id, runId);
    }
    setAgent((current) => ({ ...current, mode: "waiting", status: "waiting for your decision", activeItem: null }));
    setAgentStatus("Agent is waiting for your decision");

    return new Promise((resolve, reject) => {
      decisionResolverRef.current = resolve;
      decisionRejecterRef.current = reject;
      signal?.addEventListener("abort", () => {
        setDecision(null);
        decisionResolverRef.current = null;
        decisionRejecterRef.current = null;
        reject(signal.reason ?? new DOMException("Choice cancelled", "AbortError"));
      }, { once: true });
    });
  }, [animateAgentTo, itemCenter]);

  const finishLayout = useCallback(async (summary: string) => {
    ++agentRunRef.current;
    setAgent((current) => ({ ...current, mode: "done", status: "finished together", activeItem: null }));
    setAgentStatus("You and the Agent finished the room");
    showNotice(summary);
    return { success: true, summary, furnitureCount: itemsRef.current.length };
  }, [showNotice]);

  const actions = useMemo<WebMcpActions>(() => ({
    inspectRoom,
    pointOutIssue,
    moveItem,
    rotateItem,
    requestChoice,
    finishLayout,
  }), [finishLayout, inspectRoom, moveItem, pointOutIssue, requestChoice, rotateItem]);

  const webMcpReady = useWebMcp(actions);

  const handleDragStart = (id: FurnitureKind) => {
    humanDraggingRef.current = id;
    dragSnapshotRef.current = cloneItems(itemsRef.current);
    setHumanStatus(`You are moving ${itemsRef.current.find((item) => item.id === id)?.label ?? "furniture"}`);
    if (agent.activeItem === id) {
      ++agentRunRef.current;
      setAgent((current) => ({ ...current, mode: "waiting", status: "yielded the item", activeItem: null }));
      setAgentStatus("Agent handed control back to you");
    }
  };

  const handleDragMove = (id: FurnitureKind, point: Point) => {
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (!item) return;
    const next = clampPosition(item, point.x, point.y);
    setItems((current) => current.map((candidate) => candidate.id === id ? { ...candidate, ...next } : candidate));
  };

  const handleDragEnd = (id: FurnitureKind) => {
    humanDraggingRef.current = null;
    if (dragSnapshotRef.current) {
      const item = itemsRef.current.find((candidate) => candidate.id === id);
      pushHistory(dragSnapshotRef.current, "human", `Moved ${item?.label ?? "furniture"}`);
    }
    dragSnapshotRef.current = null;
    setHumanStatus("You are shaping the rest area");
  };

  const chooseOption = (optionId: string) => {
    if (!decision) return;
    const option = decision.options.find((candidate) => candidate.id === optionId);
    if (!option) return;
    const snapshot = cloneItems(itemsRef.current);
    pushHistory(snapshot, "human", `Chose ${option.label}`);
    setItems((current) => current.map((item) => item.id === option.itemId ? {
      ...item,
      x: option.x,
      y: option.y,
      rotation: option.rotation ?? item.rotation,
    } : item));
    setDecision(null);
    setHumanStatus(`You chose ${option.label}`);
    setAgent((current) => ({ ...current, mode: "done", status: "received your decision", activeItem: null }));
    setAgentStatus("Agent adopted your choice");
    decisionResolverRef.current?.({ success: true, selected: option });
    decisionResolverRef.current = null;
    decisionRejecterRef.current = null;
    showNotice(`Applied the “${option.label}” option`);
  };

  const takeOver = () => {
    setDecision(null);
    setSelectedId("chair");
    setAgent((current) => ({ ...current, mode: "waiting", status: "your call", activeItem: null }));
    setAgentStatus("Agent left the decision to you");
    decisionResolverRef.current?.({ success: false, status: "human_took_over" });
    decisionResolverRef.current = null;
    decisionRejecterRef.current = null;
    showNotice("The chair is yours to place");
  };

  const toggleLock = (id: FurnitureKind) => {
    const snapshot = cloneItems(itemsRef.current);
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (!item) return;
    pushHistory(snapshot, "human", `${item.locked ? "Unlocked" : "Locked"} ${item.label}`);
    setItems((current) => current.map((candidate) => candidate.id === id ? { ...candidate, locked: !candidate.locked } : candidate));
    showNotice(item.locked ? `Agent can now move ${item.label}` : `Agent will preserve ${item.label}`);
  };

  const rotateByHuman = (id: FurnitureKind) => {
    const item = itemsRef.current.find((candidate) => candidate.id === id);
    if (!item) return;
    if (agent.activeItem === id) {
      ++agentRunRef.current;
      setAgent((current) => ({ ...current, mode: "waiting", status: "yielded the item", activeItem: null }));
    }
    const snapshot = cloneItems(itemsRef.current);
    pushHistory(snapshot, "human", `Rotated ${item.label}`);
    setItems((current) => current.map((candidate) => candidate.id === id ? { ...candidate, rotation: (candidate.rotation + 90) % 360 } : candidate));
    setHumanStatus(`You rotated ${item.label}`);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    ++agentRunRef.current;
    setItems(cloneItems(previous.items));
    setHistory((current) => current.slice(0, -1));
    setAgent((current) => ({ ...current, mode: "idle", status: "undone", activeItem: null }));
    setAgentStatus(`Undid the ${previous.actor === "agent" ? "Agent's" : "your"} last action`);
  };

  const reset = useCallback((showMessage = true) => {
    ++agentRunRef.current;
    decisionResolverRef.current?.({ success: false, status: "reset" });
    decisionResolverRef.current = null;
    decisionRejecterRef.current = null;
    setItems(cloneItems(INITIAL_ITEMS));
    setHistory([]);
    setSelectedId("plant");
    setAgent(initialAgent);
    setHumanPosition({ x: 228, y: 492 });
    setHumanVisible(true);
    setIssue({ message: "Keep the door swing clear" });
    setDecision(DEFAULT_DECISION as Decision);
    setHumanStatus("You are shaping the rest area");
    setAgentStatus("Agent is organizing the workspace");
    if (showMessage) showNotice("Room reset to its starting layout");
  }, [showNotice]);

  const runDemo = async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    reset(false);
    setDecision(null);
    setIssue(null);
    await sleep(450);

    setHumanPosition({ x: 204, y: 116 });
    setSelectedId("bed");
    setHumanStatus("You decide to keep the bed here");
    await sleep(620);

    await pointOutIssue("bed", "Keep the door swing clear");
    await sleep(420);

    setAgentStatus("Agent is organizing the workspace");
    const agentMove = moveItem("desk", 548, 154, "Closer to natural light");
    const humanMove = (async () => {
      setHumanPosition({ x: 222, y: 478 });
      setSelectedId("plant");
      setHumanStatus("You are shaping the rest area");
      await sleep(520);
      const snapshot = cloneItems(itemsRef.current);
      pushHistory(snapshot, "human", "Moved the plant");
      setItems((current) => current.map((item) => item.id === "plant" ? { ...item, x: 205, y: 430 } : item));
      setHumanPosition({ x: 246, y: 458 });
    })();
    await Promise.all([agentMove, humanMove]);

    await moveItem("lamp", 698, 205, "Add task lighting");
    setHumanPosition({ x: 642, y: 314 });
    setSelectedId("chair");
    setAgent({ position: { x: 650, y: 304 }, mode: "waiting", status: "your choice", activeItem: null });
    setAgentStatus("Agent left the chair decision to you");
    await sleep(600);
    setDecision(DEFAULT_DECISION as Decision);
    setDemoRunning(false);
  };

  return (
    <div className="app-shell">
      <Header
        onStory={() => setStoryOpen(true)}
        onDemo={runDemo}
        onReset={() => reset(true)}
        onUndo={undo}
        canUndo={history.length > 0}
        demoRunning={demoRunning}
        webMcpReady={webMcpReady}
      />
      <div className="workspace">
        <FurnitureRail items={items} selectedId={selectedId} onSelect={setSelectedId} onToggleLock={toggleLock} />
        <RoomCanvas
          items={items}
          selectedId={selectedId}
          activeAgentItem={agent.activeItem}
          agentPosition={agent.position}
          agentMode={agent.mode}
          agentStatus={agent.status}
          humanPosition={humanPosition}
          humanVisible={humanVisible}
          issue={issue}
          decision={decision}
          onHumanPosition={(point, visible) => {
            setHumanPosition(point);
            setHumanVisible(visible);
          }}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          onSelect={setSelectedId}
          onRotate={rotateByHuman}
        />
        <DecisionPanel decision={decision} onChoose={chooseOption} onTakeOver={takeOver} />
      </div>
      <StatusRail humanText={humanStatus} agentText={agentStatus} agentMode={agent.mode} />
      {notice && <div className="notice" role="status">{notice}</div>}
      {storyOpen && <StoryPanel onClose={() => setStoryOpen(false)} />}
    </div>
  );
}
