// ============================================================
// BookingService.js — Сервіс для роботи з бронюваннями
//
// У реальному застосунку тут були б HTTP-запити до backend API
// (fetch / axios). Зараз використовується mock-реалізація з
// імітацією затримки мережі через setTimeout + Promise.
//
// Такий підхід дозволяє:
//   1. Легко замінити mock на реальний API в майбутньому
//   2. Тестувати async-логіку вже зараз
//   3. Зберігати стан між перезавантаженнями через localStorage
// ============================================================

const STORAGE_KEY = "railway_bookings";
const DELAY_MS = 400; // Імітація мережевої затримки

// Генеруємо унікальний ID для бронювання
function generateId() {
  return `BK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// Допоміжна функція: затримка
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Отримати всі бронювання ----
export async function fetchBookings() {
  await delay(DELAY_MS);
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ---- Отримати заброньовані місця для конкретного вагону ----
export async function fetchBookedSeats(trainId, wagonId) {
  await delay(DELAY_MS);
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const bookings = JSON.parse(data);
    // Збираємо всі місця, заброньовані для цього потяга і вагону
    return bookings
      .filter((b) => b.trainId === trainId && b.wagonId === wagonId)
      .flatMap((b) => b.seats);
  } catch {
    return [];
  }
}

// ---- Зберегти нове бронювання ----
export async function saveBooking({ trainId, wagonId, seats, passenger }) {
  await delay(DELAY_MS);

  const booking = {
    id: generateId(),
    trainId,
    wagonId,
    seats,
    passenger,
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const existing = data ? JSON.parse(data) : [];
    const updated = [...existing, booking];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, booking };
  } catch {
    return { success: false, error: "Помилка збереження бронювання" };
  }
}

// ---- Скасувати бронювання ----
export async function cancelBooking(bookingId) {
  await delay(DELAY_MS);
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { success: false };
    const bookings = JSON.parse(data);
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" } : b
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  } catch {
    return { success: false };
  }
}
