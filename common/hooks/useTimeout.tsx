import { useCallback, useEffect, useRef } from "react";

export default function useTimeout(
  callback: Function,
  delay: number,
): { reset: () => void; clear: () => void } {
  const callbackRef = useRef<Function>(callback);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current();
    }, delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && window.clearTimeout(timeoutRef.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}
