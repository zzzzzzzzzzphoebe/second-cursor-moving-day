# Second Cursor: Moving Day

An interactive WebMCP prototype about a simple but profound shift in how we use the web: one cursor is yours; the second belongs to an AI agent that can guide you, help you, or work alongside you.

**One workspace. Two cursors.** Second Cursor makes agent collaboration legible without exposing private reasoning. The interface discloses what the Agent is targeting, what it intends to do, what changed, when it is waiting, and when control returns to the human.

**Challenge status:** completed and published for The WebMCP Challenge. [View the Devpost submission](https://devpost.com/software/second-cursor-moving-day) or read the [project completion record](docs/PROJECT_RECORD.md).

In this moving-day scenario:

- The human owns taste, personal preferences, and final decisions.
- The Agent reads constraints, points out problems, and performs delegated moves.
- A furniture item held or locked by the human can never be overridden by the Agent.
- When multiple valid options depend on taste, the Agent must hand the choice back.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev -- --port 4173
```

Open `http://localhost:4173/`. If your browser does not expose WebMCP to an agent, select **Play demo** to watch the complete collaborative flow.

```bash
npm test
npm run build
npm run preview -- --port 4173
```

## WebMCP tools

The page registers six tools through `document.modelContext.registerTool(...)`:

| Tool | Purpose |
| --- | --- |
| `inspect_room` | Read furniture, coordinates, human locks, and layout constraints |
| `point_out_issue` | Guide the human without changing the room |
| `move_item` | Move one unlocked, human-free furniture item |
| `rotate_item` | Rotate one unlocked item |
| `request_choice` | Present two valid options and wait for the human |
| `finish_layout` | Finish the collaboration with a concise summary |

Suggested agent prompt:

> Inspect the room first. Preserve the bed and plant I locked, organize the workspace, and keep the entrance clear. If the chair has two equally valid placements, let me choose instead of deciding for me. When you finish, summarize what you changed.

## Core interaction

1. The human can drag or double-click furniture and lock decisions in the left rail.
2. When an Agent calls a tool, the blue second cursor visibly travels to its target, explains its intent, and acts.
3. If the human grabs the same item, the Agent operation is interrupted and yields control.
4. Taste-based decisions appear in the decision card; the tool waits until the human answers.

## Design and QA evidence

- [Visual concept](design/second-cursor-moving-day-concept.png)
- [Desktop implementation](design/implementation-desktop.png)
- [Mobile implementation](design/implementation-mobile.png)
- [Fidelity ledger](design/fidelity-ledger.md)

## Hosted demo

[Open Second Cursor: Moving Day on ChatGPT Sites](https://second-cursor-moving-day.zzzzzzzzzz-phoebe.chatgpt.site)

## Demo video

[Watch the 68-second English demo on YouTube](https://youtu.be/uYb1tT41l8g)

## Project record

[Read the complete project record](docs/PROJECT_RECORD.md) for the product thesis, architecture, verification evidence, Devpost submission facts, decisions, limitations, and future directions.

## License

[MIT](LICENSE)
