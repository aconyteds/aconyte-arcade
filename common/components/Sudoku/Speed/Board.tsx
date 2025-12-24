import React, { useEffect, useState } from "react";
import { useArray } from "../../../hooks";
import { getAllSuggestions } from "../engine";
import SpeedCell from "./SpeedCell";

interface BoardProps {
  puzzle: number[];
  useWasm: boolean;
  updateProgress: (board: number[]) => void;
  victory: boolean;
}

export default function Board({
  puzzle: basePuzzle,
  updateProgress,
  useWasm = true,
  victory,
}: BoardProps) {
  const {
    array: puzzle,
    set: setPuzzle,
    update: updatePuzzle,
  } = useArray<number>([]);
  const { array: suggestions, set: setSuggestions } = useArray<number[]>([]);
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Pupulate the locked indices
    const tempLockedIndices = new Set<number>();
    basePuzzle.forEach((cell, i) => {
      if (cell !== 0) {
        tempLockedIndices.add(i);
      }
    });

    setPuzzle(basePuzzle.flat());
    setLockedIndices(tempLockedIndices);
  }, [basePuzzle]);

  useEffect(() => {
    if (!puzzle.length) {
      return;
    }
    // Update the puzzle in the parent component
    updateProgress(puzzle);
    const allSuggestions = getAllSuggestions(puzzle, useWasm);
    if (!allSuggestions) {
      return;
    }
    const newSuggestions: number[][] = [];
    for (let i = 0; i < puzzle.length; i++) {
      if (lockedIndices.has(i)) {
        newSuggestions.push([]);
        continue;
      }
      newSuggestions.push(allSuggestions[i]);
    }
    setSuggestions(newSuggestions);
  }, [puzzle]);

  let Rows: JSX.Element[] = [];
  let currIndex = 0;
  for (let row = 0; row < 9; row++) {
    let cells: JSX.Element[] = [];
    for (let cell = 0; cell < 9; cell++) {
      const indx = row * 9 + cell;
      const value = puzzle[currIndex];
      const locked = victory || lockedIndices.has(indx);
      const handleChange = (value: number) => {
        updatePuzzle(indx, value);
      };

      cells.push(
        <SpeedCell
          key={currIndex}
          suggestions={suggestions[currIndex] ?? []}
          value={value}
          locked={locked}
          onChange={handleChange}
        />,
      );
      currIndex += 1;
    }
    Rows.push(
      <div key={row} className={`sudoku-row${victory ? " correct" : ""}`}>
        {cells}
      </div>,
    );
  }
  return <>{Rows}</>;
}
