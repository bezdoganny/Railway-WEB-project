// ============================================================
// BookingContext.jsx — Глобальний стан через useContext
//
// Цей файл реалізує патерн "Context + Reducer" для управління
// глобальним станом застосунку:
//   • обраний потяг
//   • обраний вагон
//   • обрані місця
//   • список бронювань (зберігається в localStorage)
//
// Будь-який компонент може отримати доступ до стану через хук
// useBooking() — без передачі пропсів через кілька рівнів.
// ============================================================

import { createContext, useContext, useReducer, useEffect } from "react";

// ---------- початковий стан ----------
const initialState = {
  selectedTrain: null,
  selectedWagon: null,
  selectedSeats: [],
  bookings: [],
};

// ---------- reducer ----------
function bookingReducer(state, action) {
  switch (action.type) {
    case "SELECT_TRAIN":
      // При виборі нового потяга скидаємо вагон та місця
      return {
        ...state,
        selectedTrain: action.payload,
        selectedWagon: null,
        selectedSeats: [],
      };

    case "SELECT_WAGON":
      // При зміні вагона скидаємо вибрані місця
      return {
        ...state,
        selectedWagon: action.payload,
        selectedSeats: [],
      };

    case "TOGGLE_SEAT": {
      const seatNum = action.payload;
      const isSelected = state.selectedSeats.includes(seatNum);
      return {
        ...state,
        selectedSeats: isSelected
          ? state.selectedSeats.filter((s) => s !== seatNum)
          : [...state.selectedSeats, seatNum],
      };
    }

    case "CLEAR_SEATS":
      return { ...state, selectedSeats: [] };

    case "ADD_BOOKING":
      // Додаємо нове бронювання до списку
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
        selectedSeats: [],
      };

    case "LOAD_BOOKINGS":
      return { ...state, bookings: action.payload };

    default:
      return state;
  }
}

// ---------- Context ----------
const BookingContext = createContext(null);

// ---------- Provider ----------
export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Завантажуємо бронювання з localStorage при першому рендері
  useEffect(() => {
    try {
      const saved = localStorage.getItem("railway_bookings");
      if (saved) {
        dispatch({ type: "LOAD_BOOKINGS", payload: JSON.parse(saved) });
      }
    } catch {
      // Якщо дані пошкоджені — ігноруємо
    }
  }, []);

  // Зберігаємо бронювання в localStorage при кожній зміні
  useEffect(() => {
    localStorage.setItem("railway_bookings", JSON.stringify(state.bookings));
  }, [state.bookings]);

  // Допоміжні action creators для зручного використання
  const actions = {
    selectTrain:  (train)  => dispatch({ type: "SELECT_TRAIN",  payload: train }),
    selectWagon:  (wagon)  => dispatch({ type: "SELECT_WAGON",  payload: wagon }),
    toggleSeat:   (seat)   => dispatch({ type: "TOGGLE_SEAT",   payload: seat }),
    clearSeats:   ()       => dispatch({ type: "CLEAR_SEATS" }),
    addBooking:   (booking)=> dispatch({ type: "ADD_BOOKING",   payload: booking }),
  };

  return (
    <BookingContext.Provider value={{ state, ...actions }}>
      {children}
    </BookingContext.Provider>
  );
}

// ---------- Custom Hook ----------
export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
