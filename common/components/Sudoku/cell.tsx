import React, { useMemo } from "react";

export interface CellProps {
  value: number;
  locked: boolean;
  suggestions: number[];
  onClick: () => void;
}

export default function Cell({
  value,
  locked,
  suggestions,
  onClick,
}: CellProps) {
  const className = useMemo(() => {
    let name = "cell";
    name += locked ? " locked bg-dark text-success" : " text-white";
    if (!locked && suggestions.length === 0) {
      name += " border-danger";
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
