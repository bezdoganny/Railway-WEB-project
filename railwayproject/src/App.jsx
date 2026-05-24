// ============================================================
// App.jsx — Кореневий компонент застосунку
//
// Налаштовує:
//   1. BookingProvider — обгортає все дерево компонентів
//      для доступу до глобального стану через useBooking()
//
//   2. React Router маршрути:
//      /           → Home (список рейсів)
//      /booking/:trainId → Booking (вибір місць)
//      /bookings   → MyBookings (мої квитки)
//      *           → NotFound (404)
//
//   3. ToastContainer — для глобальних повідомлень (react-toastify)
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BookingProvider } from "./context/BookingContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

// Простий 404
function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "16px",
      color: "var(--color-muted)",
      textAlign: "center",
    }}>
      <span style={{ fontSize: "64px" }}>🚂</span>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--color-text)" }}>
        404 — Сторінка не знайдена
      </h2>
      <a href="/" style={{ color: "var(--color-accent-2)" }}>← На головну</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        {/* Шапка показується на всіх сторінках */}
        <Header />

        {/* Маршрутизація */}
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/booking/:trainId"    element={<Booking />} />
          <Route path="/bookings"            element={<MyBookings />} />
          <Route path="*"                    element={<NotFound />} />
        </Routes>

        {/* Toast-повідомлення (бронювання, помилки) */}
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            fontFamily: "var(--font-body)",
          }}
        />
      </BookingProvider>
    </BrowserRouter>
  );
}
