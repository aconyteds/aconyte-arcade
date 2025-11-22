import React, { useMemo } from "react";

export interface CellProps {
  cellType?: "classic" | "speed";
  value: number;
  locked: boolean;
  suggestions: number[];
  selected?: boolean;
  onClick: () => void;
}

export default function Cell({
  cellType = "speed",
  value,
  locked,
  suggestions,
  selected = false,
  onClick,
}: CellProps) {
  const className = useMemo(() => {
    let name = "cell";
    name += locked ? " locked bg-dark text-success" : " text-white";
    if (locked) {
      return name;
    }
    if (cellType === "speed" && suggestions.length === 0) {
      name += " border-danger";
    }
    if (selected) {
      name += " border-primary";
    }
    return name;
  }, [locked, suggestions]);

  const clickHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (locked) {
      return;
    }
    onClick();
  };

  return (
    <div className={className} onClick={clickHandler}>
      <span
        data-testid="value"
        className={`fs-1 cell-value${value === 0 ? " no-value" : ""}`}
      >
        {value}
      </span>
      {locked ? null : (
        <small data-testid="suggestion" className="candidates text-info">
          {suggestions.join(" ")}
        </small>
      )}
    </div>
  );
}
