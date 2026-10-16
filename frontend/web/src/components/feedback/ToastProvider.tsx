import { useCallback, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import { ToastContext } from "./ToastContext";
import type { ToastMessage, ToastProviderProps, ToastType } from "./ToastTypes";

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, type, message }]);
  }, []);

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const variants: Record<ToastType, string> = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer
        position="top-end"
        containerPosition="fixed"
        className="p-3"
        style={{
          zIndex: 9999,
          top: 80,
          right: 500,
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.type === "error" ? "danger" : toast.type}
            onClose={() => removeToast(toast.id)}
            delay={5000}
            autohide
            className="mb-2"
          >
            <Toast.Header>
              <strong className="me-auto">{variants[toast.type]}</strong>
            </Toast.Header>

            <Toast.Body
              className={
                toast.type === "error" || toast.type === "success"
                  ? "text-white"
                  : undefined
              }
            >
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}
