import React, { useEffect, useState, useMemo } from "react";
import Cell from "./cell";
import { useArray } from "../../hooks";

interface PuzzleProps {
  puzzle: number[];
  useWasm: boolean;
  updateProgress: (board: number[]) => void;
}

export default function Puzzle({
  puzzle: basePuzzle,
  updateProgress,
  useWasm = true,
}: PuzzleProps) {
  const {
    array: puzzle,
    set: setPuzzle,
    update: updatePuzzle,
  } = useArray<number>([]);
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

  const onChange = (indx: number, value: number) => {
    updatePuzzle(indx, value);
  };

  useEffect(() => {
    // Update the puzzle in the parent component
    updateProgress(puzzle);
  }, [puzzle]);

  const Rows = useMemo(() => {
    let rows: JSX.Element[] = [];
    for (let row = 0; row < 9; row++) {
      let cells: JSX.Element[] = [];
      for (let cell = 0; cell < 9; cell++) {
        const indx = row * 9 + cell;
        const value = puzzle[indx];
        const locked = lockedIndices.has(`${row}-${cell}`);
        const handleChange = (value: number) => {
          onChange(indx, value);
        };
        cells.push(
          <Cell
            key={indx}
            indx={indx}
            puzzle={puzzle}
            value={value}
            locked={locked}
            onChange={handleChange}
            useWasm={useWasm}
          />
        );
      }
      rows.push(
        <div key={row} className="sudoku-row">
          {cells}
        </div>
      );
    }
    return rows;
  }, [puzzle]);

  return <>{Rows}</>;
}
