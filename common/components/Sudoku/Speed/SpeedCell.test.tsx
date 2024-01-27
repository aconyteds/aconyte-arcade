import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeedCell from "./SpeedCell";

describe("Sudoku -> SpeedSudoku -> SpeedCell", () => {
  const defaultProps = {
    value: 5,
    locked: false,
    suggestions: [1, 2, 3],
    onChange: jest.fn(),
  };

  test("renders without error", () => {
    render(<SpeedCell {...defaultProps} />);
    const cellElement = screen.getByText("5");
    expect(cellElement).toBeDefined();
  });

  test("calls onChange handler when clicked on an unlocked cell with suggestions", async () => {
    const onChangeMock = jest.fn();
    render(<SpeedCell {...defaultProps} onChange={onChangeMock} />);
    const cellElement = screen.getByText("5");
    await userEvent.click(cellElement);
    expect(onChangeMock).toHaveBeenCalled();
  });

  test("does not call onChange handler when clicked on a locked cell", async () => {
    const onChangeMock = jest.fn();
    render(
      <SpeedCell {...defaultProps} locked={true} onChange={onChangeMock} />
    );
    const cellElement = screen.getByText("5");
    await userEvent.click(cellElement);
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  test("does not call onChange handler when clicked on a cell with no suggestions", async () => {
    const onChangeMock = jest.fn();
    render(
      <SpeedCell {...defaultProps} suggestions={[]} onChange={onChangeMock} />
    );
    const cellElement = screen.getByText("5");
    await userEvent.click(cellElement);
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  test("calls onChange handler with the next suggestion when clicked on a cell with a value", async () => {
    const onChangeMock = jest.fn();
    render(<SpeedCell {...defaultProps} value={2} onChange={onChangeMock} />);
    const cellElement = screen.getByText("2");
    await userEvent.click(cellElement);
    expect(onChangeMock).toHaveBeenCalledWith(3);
  });

  test("calls onChange handler with the first suggestion when clicked on a cell with a value that is not in the suggestions", async () => {
    const onChangeMock = jest.fn();
    render(<SpeedCell {...defaultProps} value={4} onChange={onChangeMock} />);
    const cellElement = screen.getByText("4");
    await userEvent.click(cellElement);
    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  test("calls onChange handler with 0 when clicked on a cell with the last suggestion", async () => {
    const onChangeMock = jest.fn();
    render(<SpeedCell {...defaultProps} value={3} onChange={onChangeMock} />);
    const cellElement = screen.getByText("3");
    await userEvent.click(cellElement);
    expect(onChangeMock).toHaveBeenCalledWith(0);
  });
});
