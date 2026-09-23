import React from "react";
import { createRoot } from "react-dom/client";
import App, { ErrorBoundary } from "./App.jsx";
import { AppProvider } from "./store/AppContext.jsx";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
  </ErrorBoundary>,
);
