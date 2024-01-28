import React, { useState, useEffect } from "react";
import { Button, ButtonProps } from "react-bootstrap";

export type CountdownButtonProps = {
  // Action that will be performed when the button is clicked, or when the time has run out
  onClick: () => void;
  // The number of milliseconds that the user has to click the button
  timeLimit: number;
  children?: React.ReactNode;
} & ButtonProps;

/**
 * A wrapper around a Bootstrap button that will count down from a specified time limit before firing the `onClick` event automatically.
 *
 * @param param0 `CountdownButtonProps` - Object containing the `onClick` function, the `timeLimit` in milliseconds, and any other props that you would like to pass to the button.
 * @returns React Component
 */
const CountdownButton: React.FC<CountdownButtonProps> = ({
  onClick,
  timeLimit,
  children,
  ...rest
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit); // 10 seconds in milliseconds

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => Math.max(0, timeLeft - 10)); // decrement by 10 milliseconds, stop at 0
    }, 10); // update every 10 milliseconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClick();
    }
  }, [timeLeft]);

  const formatTime = (time: number): string => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${seconds < 10 ? "0" : ""}${seconds}:${
      milliseconds < 10 ? "0" : ""
    }${milliseconds}`;
  };

  return (
    <Button
      disabled={timeLeft <= 0}
      onClick={onClick}
      variant="primary"
      {...rest}
    >
      {children} ({timeLeft > 0 ? formatTime(timeLeft) : "Action!"})
    </Button>
  );
};

export default CountdownButton;
