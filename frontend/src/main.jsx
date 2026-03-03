import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "13.5px",
          fontWeight: 500,
          borderRadius: "10px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
        },
        success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
        error:   { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
      }}
    />
  </StrictMode>
);
