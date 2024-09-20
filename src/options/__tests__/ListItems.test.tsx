import { render, screen, fireEvent } from '@testing-library/react'
import ListItem from "../ListItem";

describe("ListItem component", () => {
  it("renders item text correctly", () => {
    render(
      <ListItem
        index={0}
        item="example.com"
        selectedItem={null}
        onClick={() => {}}
      />
    );
    expect(screen.getByText("example.com")).toBeInTheDocument();
  });

  it('applies "selected" class when selectedItem matches item', () => {
    render(
      <ListItem
        index={0}
        item="example.com"
        selectedItem="example.com"
        onClick={() => {}}
      />
    );
    const listItem = screen.getByText("example.com").closest("li");
    expect(listItem).toHaveClass("selected");
  });

  it("executes onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(
      <ListItem
        index={0}
        item="example.com"
        selectedItem={null}
        onClick={handleClick}
      />
    );
    const listItem = screen.getByText("example.com").closest("li");
    if (!listItem) {
      
      throw new Error('List item not found');
    } 

    fireEvent.click(listItem);
    expect(handleClick).toHaveBeenCalledTimes(1);
    
  });
});

