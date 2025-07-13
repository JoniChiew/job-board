// Entry point for React application
import React from "react";
import { createRoot } from "react-dom/client";
import { AppContextProvider } from "./AppContext.js"; // Use AppContextProvider
import App from "./App.js";

const root = createRoot(document.getElementById("root"));
root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
