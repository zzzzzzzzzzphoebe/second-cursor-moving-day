import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

describe("Second Cursor: Moving Day", () => {
  it("renders the shared workspace and both collaborator states", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Moving Day" })).toBeInTheDocument();
    expect(screen.getByTestId("agent-cursor")).toBeInTheDocument();
    expect(screen.getByTestId("human-cursor")).toBeInTheDocument();
    expect(screen.getByText("Agent is organizing the workspace")).toBeInTheDocument();
  });

  it("lets the human resolve an Agent handoff", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "By the window" }));
    expect(screen.queryByText("Where should the chair go?")).not.toBeInTheDocument();
    expect(screen.getByText("You chose By the window")).toBeInTheDocument();
  });

  it("lets the human protect a furniture decision from the Agent", () => {
    render(<App />);
    const deskLock = screen.getByRole("button", { name: "Prevent Agent from moving Desk" });
    fireEvent.click(deskLock);
    expect(screen.getByRole("button", { name: "Allow Agent to move Desk" })).toBeInTheDocument();
  });
});
