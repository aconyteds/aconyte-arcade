import React from "react";
import ClassicCell from "./ClassicCell";

interface BoardProps {
  puzzle: number[];
  lockedIndices: Set<number>;
  suggestions: number[][];
  selectedCell: number | null;
  victory: boolean;
  selectCell: (index: number) => void;
}

export default function Board({
  puzzle,
  lockedIndices,
  suggestions,
  victory,
  selectedCell,
  selectCell,
}: BoardProps) {
  let Rows: JSX.Element[] = [];
  let currIndex = 0;
  for (let row = 0; row < 9; row++) {
    let cells: JSX.Element[] = [];
    for (let cell = 0; cell < 9; cell++) {
      const indx = row * 9 + cell;
      const value = puzzle[currIndex];
      const locked = victory || lockedIndices.has(indx);

      const handleClick = () => {
        if (locked) {
          return;
        }
        selectCell(indx);
      };

      cells.push(
        <ClassicCell
          key={currIndex}
          value={value}
          locked={locked}
          selected={selectedCell === currIndex}
          onClick={handleClick}
          suggestions={suggestions[currIndex]}
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
