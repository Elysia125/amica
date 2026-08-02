import "@/i18n";
import "@/styles/globals.css";
import "@charcoal-ui/icons";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/routes/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
