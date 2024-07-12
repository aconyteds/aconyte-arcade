import React from "react";
import Cell from "../cell";

type CellProps = {
  value: number;
  locked: boolean;
  selected: boolean;
  suggestions: number[];
  onClick: () => void;
};

const ClassicCell: React.FC<CellProps> = ({
  value,
  locked,
  suggestions = [],
  selected,
  onClick,
}) => {
  const handleClick = () => {
    if (locked) {
      return;
    }
    onClick();
  };

  return (
    <Cell
      cellType="classic"
      suggestions={suggestions}
      value={value}
      locked={locked}
      onClick={handleClick}
      selected={selected}
    />
  );
};

export default ClassicCell;
