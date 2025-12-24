import { useState } from "react";

export default function useToggle(
  initialValue: boolean,
): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (value?: boolean) => {
    setValue((currentValue: boolean) =>
      typeof value === "boolean" ? (value as boolean) : !currentValue,
    );
  };

  return [value, toggle];
}
