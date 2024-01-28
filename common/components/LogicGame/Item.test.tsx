import React from "react";
import { render } from "@testing-library/react";
import Item from "./Item";
import { ITEM_ICONS, ItemType } from "./models";
import { faPoop } from "@fortawesome/free-solid-svg-icons";

describe("LogicGame -> Item", () => {
  const item: ItemType = "otter";
  const height = "50px";

  it("Renders the item component with the correct icon", () => {
    const { container } = render(<Item item={item} height={height} />);
    const iconElement = container.querySelector(".logic-game-item svg");

    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.getAttribute("data-icon")).toBe(
      ITEM_ICONS.get(item)?.iconName
    );
  });

  it("Renders the item component with the default icon when item is not found", () => {
    const unknownItem: ItemType = "unknown" as unknown as ItemType;
    const { container } = render(<Item item={unknownItem} height={height} />);
    const iconElement = container.querySelector(".logic-game-item svg");

    expect(iconElement).toBeInTheDocument();
    expect(iconElement?.getAttribute("data-icon")).toBe(faPoop.iconName);
  });

  it("Renders the item component with the correct height", () => {
    const { container } = render(<Item item={item} height={height} />);
    const itemElement = container.querySelector(".logic-game-item");

    expect(itemElement).toBeInTheDocument();
    expect((itemElement as HTMLElement)?.style.height).toBe(height);
  });
});
