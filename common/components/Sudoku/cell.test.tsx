import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cell, { CellProps } from "./cell";

describe("Sudoku -> Cell", () => {
  const defaultProps: CellProps = {
    value: 5,
    locked: false,
    suggestions: [],
    onClick: jest.fn(),
  };

  test("renders without error", () => {
    render(<Cell {...defaultProps} />);
    const cellElement = screen.getByText("5");
    expect(cellElement).toBeDefined();
  });

  test("renders empty cell", () => {
    render(<Cell {...defaultProps} value={0} />);
    const cellElement = screen.getByTestId("value");
    expect(cellElement).toBeInTheDocument();
    expect(cellElement).toHaveClass("no-value");
  });

  test("renders highlighted cell", () => {
    render(<Cell {...defaultProps} suggestions={[3]} />);
    const cellElement = screen.getByText("3");
    expect(cellElement).toHaveClass("candidates");
  });

  test("calls onClick handler when clicked with suggestions", async () => {
    const onClickMock = jest.fn();
    render(<Cell {...defaultProps} onClick={onClickMock} suggestions={[3]} />);
    const cellElement = screen.getByText("5");
    await userEvent.click(cellElement);
    expect(onClickMock).toHaveBeenCalled();
  });

  test("Does not render suggestions when locked", () => {
    render(<Cell {...defaultProps} locked={true} suggestions={[3]} />);
    const cellElement = screen.getByText("5");
    expect(cellElement).toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });
});
