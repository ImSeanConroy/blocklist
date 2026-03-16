import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ListItem from "../ListItem";
import { SiteRule } from "../types";

const activeRule: SiteRule = {
  startHour: 0,
  endHour: 0,
  enabled: true,
  days: [0, 1, 2, 3, 4, 5, 6],
};

const pausedRule: SiteRule = {
  startHour: 9,
  endHour: 17,
  enabled: false,
  days: [0, 1, 2, 3, 4, 5, 6],
};

describe("ListItem component", () => {
  it("renders site text and schedule", () => {
    render(
      <ListItem
        site="example.com"
        rule={activeRule}
        onSelect={() => {}}
      />,
    );

    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText("Always blocked")).toBeInTheDocument();
  });

  it('shows "Active now" badge for an active rule and not for a paused rule', () => {
    const { rerender } = render(
      <ListItem
        site="example.com"
        rule={activeRule}
        onSelect={() => {}}
      />,
    );

    expect(screen.getByText("Active now")).toBeInTheDocument();

    rerender(
      <ListItem
        site="example.com"
        rule={pausedRule}
        onSelect={() => {}}
      />,
    );

    expect(screen.queryByText("Active now")).not.toBeInTheDocument();
    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("calls onSelect when the item is clicked", () => {
    const handleSelect = vi.fn();

    render(
      <ListItem
        site="example.com"
        rule={activeRule}
        onSelect={handleSelect}
      />,
    );

    fireEvent.click(screen.getByText("example.com").closest("li")!);

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});

