# Second Cursor: Moving Day

## One-line Summary

One workspace, two cursors: a human and an AI agent arrange a room together while the interface makes the agent's intent, actions, constraints, and handoffs visible.

## Problem

Most websites still assume a single operator and a single cursor. When an AI agent helps, its work is usually hidden behind a chat box: the user sees a request and, later, a result, but not what the agent is targeting, what it is allowed to change, why it is waiting, or when control has returned to the human.

That interaction model becomes especially fragile in shared, visual work. An agent may be able to act, but the user still needs to understand and govern those actions in real time.

## Solution

Second Cursor proposes a new interaction model for the agentic web. The human keeps the familiar white cursor. The agent receives a visible blue cursor on the same live surface.

The Moving Day scenario makes the idea concrete: a human and an agent arrange furniture together. The agent can inspect the room, point out a problem, move or rotate unlocked furniture, ask the human to choose between equally valid options, and finish with a visible summary. Every tool call is reflected in the interface.

The second cursor is not a visualization of private chain-of-thought. It is actionable disclosure: what the agent is targeting, what it intends to do, what changed, which constraints apply, when it is waiting, and when control returns to the human.

## Why This Matters

WebMCP makes web pages operable by many compatible agents, not just by one proprietary assistant integration. Second Cursor explores what the interface should become when that happens.

Instead of treating the agent as an invisible remote operator, the product gives people a shared workspace where collaboration is understandable and interruptible. The human owns taste and final decisions. The agent handles structured inspection and delegated work. Both can act on the same task without collapsing into a chat-only workflow.

The moving-room demo is intentionally simple, but the interaction model can extend to design tools, spreadsheets, dashboards, planning canvases, editors, and other software where people need to supervise agent actions without micromanaging every click.

## How We Used AI

The running application exposes six structured WebMCP tools to any compatible agent client. The agent reads live room state and constraints through `inspect_room`, communicates through a visible second cursor, performs only delegated operations, and hands subjective decisions back through `request_choice`.

The application does not expose or imitate private reasoning. It discloses product-relevant action state: target, intent, progress, constraints, changes, and handoff. Human locks and active dragging have priority over agent actions.

No proprietary server-side model is required by the demo. The intelligence comes from the visiting WebMCP-compatible agent, while the page supplies explicit capabilities, schemas, constraints, and visible feedback.

## How We Used Codex

OpenAI Codex was used as an end-to-end implementation partner: researching WebMCP and the challenge, challenging and refining the product concept, translating the interaction model into a React and TypeScript prototype, defining the six WebMCP schemas, implementing human-priority controls, writing automated tests, running browser and visual QA, preparing the ChatGPT Sites deployment, producing the English demo script and subtitle package, and assembling the Devpost materials.

Codex also verified the public build rather than relying on local assumptions: it ran the test suite and production build, checked the public Git commit, confirmed the live site and video URLs, and invoked `inspect_room` from ChatGPT's in-app browser against the deployed site.

## Key Features

- **Two live cursors:** a white human cursor and a blue agent cursor share one visual workspace.
- **Visible agent intent:** the agent cursor travels to its target and explains why an action is happening.
- **Six real WebMCP tools:** `inspect_room`, `point_out_issue`, `move_item`, `rotate_item`, `request_choice`, and `finish_layout`.
- **Human priority:** human-held and human-locked furniture cannot be overridden by the agent.
- **Taste-aware handoff:** when two valid placements depend on preference, the agent waits for the human instead of guessing.
- **Direct manipulation:** people can drag, rotate, lock, and undo furniture changes themselves.
- **Agent-free fallback:** the Play demo flow lets judges understand the complete collaboration even without a connected agent.
- **Responsive presentation:** the shared-room experience works across desktop and mobile layouts.

## Architecture

- React 19 and TypeScript for the interactive product interface.
- Vinext and Vite for the application and production build.
- ChatGPT Sites hosting for the public live URL.
- `document.modelContext.registerTool(...)` for six WebMCP tool registrations.
- JSON-schema inputs with stable furniture IDs, bounded room coordinates, explicit required fields, and read-only annotations where appropriate.
- React state and action handlers synchronize furniture, locks, human dragging, decisions, agent cursor movement, status messages, and completion state.
- Abort signals remove tool registrations on teardown and allow waiting handoffs to stop safely.
- Vitest and Testing Library cover shared-cursor rendering, human decision handoff, and human locking behavior.

## Testing Instructions

1. Open the public demo URL in ChatGPT's in-app browser or Google Chrome with WebMCP enabled.
2. Confirm that the client discovers these tools: `inspect_room`, `point_out_issue`, `move_item`, `rotate_item`, `request_choice`, and `finish_layout`.
3. Give the agent this prompt:

   > Inspect the room first. Preserve the bed and plant I locked, organize the workspace, and keep the entrance clear. If the chair has two equally valid placements, let me choose instead of deciding for me. When you finish, summarize what you changed.

4. Watch the blue cursor move to each target and display the current intent.
5. Verify that locked items are preserved.
6. During a move, drag the same item and verify that the agent yields to the human.
7. Answer the chair placement question and verify that the agent continues only after the choice.
8. If WebMCP is not available in the current browser, click **Play demo** to replay the complete collaborative flow.

No account or testing credentials are required.

Verified on August 30, 2026:

- ChatGPT in-app browser discovered all six tools on the public site.
- A live `inspect_room` invocation returned current furniture positions, human locks, room bounds, and layout constraints.
- Automated tests: 3 passed.
- Production build: passed.
- Public site: HTTP 200.
- Application and video release commit: `1e69669f7a3220645a75822849ef8a2d7e5e4c87`.

## Public Demo Link

https://second-cursor-moving-day.zzzzzzzzzz-phoebe.chatgpt.site

## Public Repository Link

https://github.com/zzzzzzzzzzphoebe/second-cursor-moving-day

The repository is public and includes the MIT license, source code, assets, setup instructions, tests, design evidence, and the final demo-video package.

## Demo Video

https://youtu.be/uYb1tT41l8g

Public YouTube video, 68.3 seconds, 1920 x 1080, English voice-over, and burned-in English captions. It demonstrates the product in the first seconds, explains the WebMCP implementation, and closes on the core message: **One workspace. Two cursors.**

## Screenshot Shot List

1. **Hero / shared workspace** — `public/og.png`; clearly shows the human and agent cursors together.
2. **Desktop product view** — `design/implementation-desktop.png`; shows the furniture rail, live room, status rail, and decision panel.
3. **Human decision handoff** — capture the chair choice card with the agent waiting for input.
4. **Visible action and control** — capture the blue cursor targeting furniture while the human lock indicators remain visible.
5. **Mobile adaptation** — `design/implementation-mobile.png`; demonstrates that the interaction model remains legible on a narrow viewport.

## Submission Readiness Notes

- The project was created during the challenge submission period; proposed official answer: `App Status: New`.
- All submission materials are in English.
- The live site requires no authentication and is free to access.
- The repository is public and includes a detectable MIT license.
- The demo video is public, under three minutes, includes audio, and uses no background music.
- The app has no third-party data integration and stores no user data.
- The current Devpost participant is registered as an individual.

## Known Limitations

- Browser support depends on the client exposing the current WebMCP API.
- The prototype demonstrates one shared-room scenario rather than a multi-user networked workspace.
- Collaboration state is local to the current page session and is not persisted to a backend.
- The agent cursor communicates actionable intent and state, not private model reasoning.
- The demo fallback is scripted; it exists for reviewers whose browser does not expose WebMCP.

## TODO Official Form Fields

Proposed exact answers for the live Devpost form:

- **Submitter Type (28249):** `Individual`
- **Country of residence of yourself and team members if applicable (28250):** `Taiwan`
- **Organization name (28251):** leave blank; not applicable
- **App Status (28252):** `New`
- **Existing-project update explanation (28253):** leave blank; not applicable
- **Live URL (28254):** `https://second-cursor-moving-day.zzzzzzzzzz-phoebe.chatgpt.site`
- **Testing instructions (28255):** Use the testing instructions above; no credentials are required.
- **Public code repository (28256):** `https://github.com/zzzzzzzzzzphoebe/second-cursor-moving-day`
- **Agents or clients tested (28257):** `ChatGPT in-app browser with WebMCP. On August 30, 2026, it discovered all six tools from the public deployment and successfully invoked inspect_room against live page state.`
- **AI tools leveraged (28258):** `OpenAI Codex for research, product framing, React/TypeScript implementation, WebMCP schema design, automated testing, browser QA, deployment support, demo scripting and production, and submission packaging. ChatGPT's in-app browser was used for live WebMCP client testing.`
- **Learning level (28259):** `Significant`
- **Career AI value (28260):** `Yes`

No Codex session ID is requested by the current official form.
