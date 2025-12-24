import React, { useState, useEffect, useCallback } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { lightenHexColor } from "../utilities";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light";
type ColorMap = {
  darker: string;
  lighter: string;
};

const COLOR_MAP = new Map<ButtonVariant, ColorMap>(
  [
    ["primary", "#6f42c1"],
    ["secondary", "#ea39b8"],
    ["success", "#3cf281"],
    ["danger", "#e44c55"],
    ["warning", "#ffc107"],
    ["info", "#1ba2f6"],
    ["dark", "#170229"],
    ["light", "#44d9e8"],
  ].map(([key, value]) => [
    key as ButtonVariant,
    { darker: value, lighter: lightenHexColor(value, 50) },
  ]),
);

export type HoldButtonProps = {
  // Action that will be performed when the button is held for the required time
  onComplete: () => void;
  variant?: ButtonVariant;
  // The number of milliseconds that the user has to hold the button
  holdTime?: number;
  children?: React.ReactNode;
} & ButtonProps;

const ConfirmationButton: React.FC<HoldButtonProps> = ({
  onComplete,
  holdTime = 2000,
  variant = "primary",
  children,
  style = {},
  ...rest
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const startHold = useCallback(() => {
    setIsHolding(true);
    setProgress(0);
  }, []);

  const endHold = useCallback(() => {
    setIsHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!isHolding) return;
    const updateInterval = holdTime / 60;

    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (updateInterval / holdTime) * 100;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          endHold();
          onComplete();
          return 100;
        }
        return newProgress;
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [isHolding, holdTime, onComplete, endHold]);
  const { darker: darkColor, lighter: lightColor } = COLOR_MAP.get(variant)!;

  const buttonStyle = {
    background: `linear-gradient(to right, ${lightColor} ${progress}%, ${lightColor} ${progress}%, ${darkColor} ${progress}%, ${darkColor} 100%)`,
    transition: "background 0.1s linear",
  };

  return (
    <Button
      {...rest}
      variant={variant}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      style={isHolding ? buttonStyle : style}
    >
      {children}
    </Button>
  );
};

export default ConfirmationButton;
