import React, { useEffect, useState } from "react";
import Cell from "./cell";
import { useArray } from "../../../hooks";
import { getSuggestions } from "../engine";

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
  const [lockedIndices, setLockedIndices] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Pupulate the locked indices
    const lockedIndices = new Set<string>();
    basePuzzle.forEach((cell, i) => {
      if (cell !== 0) {
        lockedIndices.add(`${Math.floor(i / 9)}-${i % 9}`);
      }
    });

    setPuzzle(basePuzzle.flat());
    setLockedIndices(lockedIndices);
  }, [basePuzzle]);

  useEffect(() => {
    if (!puzzle.length) {
      return;
    }
    // Update the puzzle in the parent component
    updateProgress(puzzle);
    const calculateSuggestions = async () => {
      const newSuggestions: number[][] = [];
      for (let row = 0; row < 9; row++) {
        for (let cell = 0; cell < 9; cell++) {
          if (lockedIndices.has(`${row}-${cell}`)) {
            newSuggestions.push([]);
            continue;
          }
          const currSuggestions =
            (await getSuggestions(puzzle, row, cell, useWasm)) ?? [];
          newSuggestions.push(currSuggestions);
        }
      }
      setSuggestions(newSuggestions);
    };
    calculateSuggestions();
  }, [puzzle]);

  let Rows: JSX.Element[] = [];
  let currIndex = 0;
  for (let row = 0; row < 9; row++) {
    let cells: JSX.Element[] = [];
    for (let cell = 0; cell < 9; cell++) {
      const indx = row * 9 + cell;
      const value = puzzle[currIndex];
      const locked = victory || lockedIndices.has(`${row}-${cell}`);
      const handleChange = (value: number) => {
        updatePuzzle(indx, value);
      };

      cells.push(
        <Cell
          key={currIndex}
          suggestions={suggestions[currIndex] ?? []}
          value={value}
          locked={locked}
          onChange={handleChange}
        />
      );
      currIndex += 1;
    }
    Rows.push(
      <div key={row} className={`sudoku-row${victory ? " correct" : ""}`}>
        {cells}
      </div>
    );
  }
  return <>{Rows}</>;
}
