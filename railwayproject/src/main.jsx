// ============================================================
// main.jsx — Точка входу React-застосунку
//
// Тут підключаємо глобальні стилі та монтуємо React у DOM.
// React.StrictMode допомагає виявляти потенційні проблеми
// під час розробки (подвійний рендер у dev-режимі — це норма).
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
