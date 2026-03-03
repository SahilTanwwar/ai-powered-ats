import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { T } from "../theme";

const ToastContext = createContext(null);

let idSeed = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, type = "info") => {
    const id = ++idSeed;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  const api = useMemo(() => ({
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 300, display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const tone =
              t.type === "success"
                ? { bg: T.successSoft, border: `${T.success}55`, text: T.success }
                : t.type === "error"
                  ? { bg: T.dangerSoft, border: `${T.danger}55`, text: T.danger }
                  : { bg: T.indigoSoft, border: `${T.indigo}55`, text: T.indigo };

            return (
              <motion.button
                key={t.id}
                onClick={() => dismiss(t.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  minWidth: 240,
                  maxWidth: 360,
                  textAlign: "left",
                  border: `1px solid ${tone.border}`,
                  background: tone.bg,
                  color: tone.text,
                  borderRadius: 12,
                  padding: "10px 12px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.09)",
                }}
                aria-label="Dismiss notification"
              >
                {t.message}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
