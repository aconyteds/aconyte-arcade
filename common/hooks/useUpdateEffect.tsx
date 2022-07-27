import { useEffect, useRef } from "react";

export default function useUpdateEffect(callback: Function, dependencies: any) {
    const callbackRef = useRef<Function>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        callbackRef.current();
    }, dependencies);
}