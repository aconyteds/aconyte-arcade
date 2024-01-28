import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ItemContainer from "./ItemContainer";
import { ILogicGameContext, useLogicGameContext } from "./context";
import { ItemContainerProps } from "./models";

jest.mock("./context");

describe("LogicGame -> ItemContainer", () => {
  const mockProps: ItemContainerProps = {
    items: ["otter", "fish", "dragon"],
    indx: 0,
  };

  let fakeContext!: Partial<ILogicGameContext>;
  beforeEach(() => {
    fakeContext = {
      selectedContainer: null,
      containerLimit: 3,
      selectContainer: jest.fn(),
    };
    (useLogicGameContext as jest.Mock).mockImplementation(
      jest.fn(() => fakeContext)
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders the component correctly", () => {
    const { getByTestId } = render(<ItemContainer {...mockProps} />);

    const container = getByTestId("item-container");
    expect(container).toBeInTheDocument();

    const items = container.querySelectorAll(".logic-game-item");
    expect(items).toHaveLength(3);
  });

  it("calls selectContainer when clicked", () => {
    const { getByTestId } = render(<ItemContainer {...mockProps} />);

    const container = getByTestId("item-container");
    fireEvent.click(container);

    expect(fakeContext.selectContainer).toHaveBeenCalledWith(mockProps);
  });

  it("applies the 'complete' class when items are complete", () => {
    const { getByTestId } = render(
      <ItemContainer {...mockProps} items={["otter", "otter", "otter"]} />
    );

    const container = getByTestId("item-container");
    expect(container).toHaveClass("complete");
  });

  it("applies the 'selected' class when selectedContainer matches indx", () => {
    (useLogicGameContext as jest.Mock).mockReturnValue({
      ...fakeContext,
      selectedContainer: { indx: 0 },
    });

    const { getByTestId } = render(<ItemContainer {...mockProps} />);

    const container = getByTestId("item-container");
    expect(container).toHaveClass("selected");
  });

  it("Does not call selectContainer when items are complete", () => {
    const { getByTestId } = render(
      <ItemContainer {...mockProps} items={["otter", "otter", "otter"]} />
    );

    const container = getByTestId("item-container");
    fireEvent.click(container);

    expect(fakeContext.selectContainer).not.toHaveBeenCalled();
  });

  it("Properly updates the height when the container is resized", () => {
    const { getByTestId } = render(<ItemContainer {...mockProps} />);
    const container = getByTestId("item-container");
    const items = container.querySelectorAll(".logic-game-item");
    expect(items[0]).toHaveStyle("height: -0.5px");

    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 100,
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 100,
    });
    fireEvent(window, new Event("resize"));

    expect(items[0]).toHaveStyle("height: 32.5px");
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 30,
    });
    fireEvent(window, new Event("resize"));

    expect(items[0]).toHaveStyle("height: 21.5px");
  });
});
