import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./store/AppContext.jsx";
import "./styles.css";
import "./training-jarvis.css";
createRoot(document.getElementById("root")).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
