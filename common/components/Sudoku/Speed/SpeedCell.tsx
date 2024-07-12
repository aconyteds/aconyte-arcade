import React from "react";
import Cell from "../cell";

type SpeedCellProps = {
  value: number;
  locked: boolean;
  suggestions: number[];
  onChange: (newValue: number) => void;
};

const SpeedCell: React.FC<SpeedCellProps> = ({
  value,
  locked,
  suggestions,
  onChange,
}) => {
  const handleChange = () => {
    if (locked || suggestions.length === 0) {
      return;
    }
    if (value === 0) {
      onChange(suggestions[0]);
      return;
    }
    // get the next suggestion
    const index = suggestions.indexOf(value);
    if (index === -1) {
      // guard, should never happen
      onChange(suggestions[0]);
      return;
    } else if (index === suggestions.length - 1) {
      onChange(0);
      return;
    }
    onChange(suggestions[index + 1]);
  };

  return (
    <Cell
      suggestions={suggestions}
      value={value}
      locked={locked}
      onClick={handleChange}
    />
  );
};

export default SpeedCell;
