import React, { useContext, createContext, ReactNode, useMemo, useRef, useEffect } from 'react';
import { useArray } from "../hooks";
import { ToastContainer, Toast } from "react-bootstrap";

type ToastSeverity = "success" | "warning" | "error" | "info";

interface Toast {
    severity: ToastSeverity;
    message: string;
    duration?: number;
}

interface IToasterContext {
    toast: (severity: ToastSeverity, message: string, duration?: number) => void;
}

export const ToasterContext = createContext<IToasterContext>({ toast: () => { } });

export function useToasterContext(): IToasterContext {
    const value = useContext(ToasterContext);
    if (value === null) throw new Error("No Toaster Context Provided");
    return value;
}

export const ToasterContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const portalRef = useRef<HTMLElement | null>(null);
    const { array: displayedToasts, push: addToast, remove: removeToast } = useArray<Toast>([]);

    useEffect(() => {
        portalRef.current = document.createElement("div");
        portalRef.current.className = "toaster";
        document.body.appendChild(portalRef.current);
        return () => {
            if (portalRef.current) {
                document.body.removeChild(portalRef.current);
            }
        }
    }, []);

    const toast = (severity: ToastSeverity, message: string, duration: number = 6000) => {
        if (!message) return;
        addToast({ severity, message, duration });
        setTimeout(() => {
            const index = displayedToasts.findIndex((_toast) => _toast.message === message);
            removeToast(index);
        }, duration);
    }

    const RenderMessages = (): JSX.Element[] => {
        return displayedToasts.map((toast, index) => (
            <Toast key={index} bg={toast.severity}>
                <Toast.Body>{toast.message}</Toast.Body>
            </Toast>
        ));
    }

    const value: IToasterContext = useMemo(() => ({ toast }), [toast]);

    return (
        <>
            <ToasterContext.Provider value={value}>
                {children}
            </ToasterContext.Provider>
            <ToastContainer className="toast-container">
                {RenderMessages()}
            </ToastContainer>
        </>
    )
};

