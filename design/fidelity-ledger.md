# Fidelity Ledger

Baseline: `second-cursor-moving-day-concept.png`, native size 1568 × 1003. The desktop implementation screenshot uses the same dimensions, and both were inspected at native size.

## Comparison

| Area | Concept | Implementation | Result |
| --- | --- | --- | --- |
| Three-column structure | Furniture rail, room, decision card | Same, plus a persistent collaboration rail | Pass |
| Visual language | Warm paper, wood floor, blue Agent accent | Preserved with interactive SVG furniture | Pass |
| Two-cursor story | White human cursor, blue Agent cursor | Preserved and connected to real operations | Pass |
| Human handoff | Chair question with two placements and takeover | Same three behaviors | Pass |
| Collaboration status | Human and Agent tasks shown together | Same, with live status updates | Pass |
| Room constraints | Door, swing arc, and walkway cue | Preserved and exposed through WebMCP | Pass |
| Furniture control | Selection outlines only | Added locking, dragging, rotation, and undo | Intentional extension |
| Responsive behavior | Desktop only | Added a 390 × 844 mobile layout | Intentional extension |

## Copy differences

- **Play demo** was added so judges can experience the complete interaction without a connected WebMCP agent.
- Locking guidance and direct manipulation hints were added to make the human-priority rule explicit.
- The concept card's decorative hand/loading icon became a clear text action to avoid implying automation when the human is taking control.

## Main deviation

The concept uses near-photorealistic furniture. The implementation uses one coherent SVG furniture system so every item can be accurately dragged, rotated, locked, targeted, and described. The composition, palette, information hierarchy, and core narrative remain intact.

## Interaction evidence

- A supported browser discovered all six WebMCP tools.
- `inspect_room` returned live furniture and lock state.
- A real WebMCP `move_item` call moved the Agent cursor and repositioned the floor lamp.
- The demo paused for the chair decision; choosing **By the window** closed the decision card and allowed the Agent to continue.
- Desktop 1568 × 1003, desktop 1280 × 720, and mobile 390 × 844 were checked in-browser with no console errors or warnings.
