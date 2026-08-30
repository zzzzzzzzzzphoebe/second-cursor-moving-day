import { useEffect, useState } from "react";
import type { ChoiceOption, FurnitureKind } from "./types";

export type WebMcpActions = {
  inspectRoom: () => unknown;
  pointOutIssue: (itemId: FurnitureKind, message: string) => Promise<unknown>;
  moveItem: (itemId: FurnitureKind, x: number, y: number, reason: string) => Promise<unknown>;
  rotateItem: (itemId: FurnitureKind, degrees: number, reason: string) => Promise<unknown>;
  requestChoice: (title: string, message: string, options: [ChoiceOption, ChoiceOption], signal?: AbortSignal) => Promise<unknown>;
  finishLayout: (summary: string) => Promise<unknown>;
};

const itemIdSchema = {
  type: "string",
  enum: ["bed", "desk", "chair", "sofa", "lamp", "plant"],
  description: "A stable furniture ID from inspect_room.",
};

export function useWebMcp(actions: WebMcpActions) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof document.modelContext?.registerTool !== "function") {
      setReady(false);
      return;
    }

    const controller = new AbortController();
    const register = async () => {
      const tools: WebMcpTool[] = [
        {
          name: "inspect_room",
          title: "Inspect the room",
          description: "Read the current room, furniture positions, human locks, active collaboration state, and layout constraints before making changes.",
          inputSchema: { type: "object", properties: {}, additionalProperties: false },
          annotations: { readOnlyHint: true },
          execute: async () => actions.inspectRoom(),
        },
        {
          name: "point_out_issue",
          title: "Guide the human",
          description: "Move the Agent cursor to a furniture item and visibly point out one concrete layout issue without changing anything.",
          inputSchema: {
            type: "object",
            properties: {
              itemId: itemIdSchema,
              message: { type: "string", minLength: 3, maxLength: 72, description: "A concise Traditional Chinese explanation shown beside the Agent cursor." },
            },
            required: ["itemId", "message"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true },
          execute: async (input) => actions.pointOutIssue(input.itemId as FurnitureKind, String(input.message)),
        },
        {
          name: "move_item",
          title: "Move furniture",
          description: "Reliably move one unlocked furniture item on the shared room canvas. The Agent cursor visibly travels to the item first. Human-held or human-locked items are never overridden.",
          inputSchema: {
            type: "object",
            properties: {
              itemId: itemIdSchema,
              x: { type: "number", minimum: 58, maximum: 780, description: "Top-left x coordinate in the 900×620 room coordinate system." },
              y: { type: "number", minimum: 52, maximum: 515, description: "Top-left y coordinate in the 900×620 room coordinate system." },
              reason: { type: "string", minLength: 3, maxLength: 48, description: "Short visible explanation of why this move helps." },
            },
            required: ["itemId", "x", "y", "reason"],
            additionalProperties: false,
          },
          execute: async (input) => actions.moveItem(input.itemId as FurnitureKind, Number(input.x), Number(input.y), String(input.reason)),
        },
        {
          name: "rotate_item",
          title: "Rotate furniture",
          description: "Rotate one unlocked furniture item while showing the Agent's intent. Human-held or human-locked items are never overridden.",
          inputSchema: {
            type: "object",
            properties: {
              itemId: itemIdSchema,
              degrees: { type: "number", enum: [-90, 90, 180], description: "Relative clockwise rotation." },
              reason: { type: "string", minLength: 3, maxLength: 48 },
            },
            required: ["itemId", "degrees", "reason"],
            additionalProperties: false,
          },
          execute: async (input) => actions.rotateItem(input.itemId as FurnitureKind, Number(input.degrees), String(input.reason)),
        },
        {
          name: "request_choice",
          title: "Hand a decision back",
          description: "Present exactly two valid furniture placements to the human and wait for their visible choice. Use when both options satisfy constraints but require personal taste.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string", minLength: 3, maxLength: 40 },
              message: { type: "string", minLength: 3, maxLength: 100 },
              options: {
                type: "array",
                minItems: 2,
                maxItems: 2,
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", minLength: 1, maxLength: 24 },
                    label: { type: "string", minLength: 1, maxLength: 20 },
                    itemId: itemIdSchema,
                    x: { type: "number", minimum: 58, maximum: 780 },
                    y: { type: "number", minimum: 52, maximum: 515 },
                    rotation: { type: "number", minimum: -180, maximum: 180 },
                  },
                  required: ["id", "label", "itemId", "x", "y"],
                  additionalProperties: false,
                },
              },
            },
            required: ["title", "message", "options"],
            additionalProperties: false,
          },
          execute: async (input, options) => actions.requestChoice(
            String(input.title),
            String(input.message),
            input.options as [ChoiceOption, ChoiceOption],
            options?.signal,
          ),
        },
        {
          name: "finish_layout",
          title: "Finish the shared layout",
          description: "Mark the collaborative room layout as finished and display a concise summary after all requested changes are complete.",
          inputSchema: {
            type: "object",
            properties: {
              summary: { type: "string", minLength: 3, maxLength: 100 },
            },
            required: ["summary"],
            additionalProperties: false,
          },
          execute: async (input) => actions.finishLayout(String(input.summary)),
        },
      ];

      await Promise.all(tools.map((tool) => document.modelContext!.registerTool(tool, { signal: controller.signal })));
      if (!controller.signal.aborted) setReady(true);
    };

    register().catch((error) => {
      console.warn("WebMCP tools could not be registered", error);
      if (!controller.signal.aborted) setReady(false);
    });

    return () => {
      controller.abort();
      setReady(false);
    };
  }, [actions]);

  return ready;
}

