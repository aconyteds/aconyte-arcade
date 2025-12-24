import { useCallback, useEffect, useRef } from "react";

export default function useInterval(
  callback: Function,
  interval: number,
): { reset: () => void; clear: () => void } {
  const callbackRef = useRef<Function>(callback);
  const intervalRef = useRef<number>(interval);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    intervalRef.current = window.setInterval(() => {
      callbackRef.current();
    }, interval);
  }, [interval]);

  const clear = useCallback(() => {
    intervalRef.current && window.clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  useEffect(() => {
    set();
    return clear; // This will clear the interval when the component using the hook unmounts
  }, [set, clear]);

  return { reset, clear };
}
