import React, { useMemo } from "react";

export interface CellProps {
  value: number;
  locked: boolean;
  suggestions: number[];
  onChange: (newValue: number) => void;
}

export default function Cell({
  value,
  locked,
  suggestions,
  onChange,
}: CellProps) {
  const className = useMemo(() => {
    let name = "cell";
    name += locked ? " locked bg-dark text-success" : " text-white";
    if (!locked && suggestions.length === 0) {
      name += " border-danger";
    }
    return name;
  }, [locked, suggestions]);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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
    <div className={className} onClick={onClick}>
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
