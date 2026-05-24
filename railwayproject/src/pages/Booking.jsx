// ============================================================
// Booking.jsx — Сторінка бронювання квитків
//
// Маршрут: /booking/:trainId
//
// Послідовність взаємодії:
//   1. Отримуємо trainId із URL (useParams)
//   2. Знаходимо потяг у даних
//   3. Зберігаємо потяг у глобальному стані (якщо зайшли по прямому URL)
//   4. Користувач обирає вагон (WagonSelector)
//   5. Бачить схему місць (SeatMap)
//   6. Заповнює форму (BookingForm)
// ============================================================

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { getTrainById } from "../data/trains";
import WagonSelector from "../components/WagonSelector";
import SeatMap from "../components/SeatMap";
import BookingForm from "../components/BookingForm";
import styles from "./Booking.module.css";

export default function Booking() {
  const { trainId } = useParams();
  const { state, selectTrain } = useBooking();

  // Знаходимо потяг за ID
  const train = getTrainById(trainId);

  // Якщо потяг не в стані (пряме URL), завантажуємо його
  useEffect(() => {
    if (train && state.selectedTrain?.id !== train.id) {
      selectTrain(train);
    }
  }, [trainId]);

  // 404 — потяг не знайдено
  if (!train) {
    return (
      <div className={styles.notFound}>
        <span>🚫</span>
        <h2>Рейс не знайдено</h2>
        <Link to="/" className={styles.backLink}>← Повернутись до списку</Link>
      </div>
    );
  }

  const selectedWagon = state.selectedWagon;

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Навігаційна хлібна крихта */}
        <nav className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>Рейси</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>
            {train.from} → {train.to}
          </span>
        </nav>

        {/* Заголовок рейсу */}
        <div className={styles.trainHeader}>
          <div>
            <h1 className={styles.trainTitle}>
              {train.from}
              <span className={styles.arrow}> → </span>
              {train.to}
            </h1>
            <p className={styles.trainMeta}>
              Поїзд №{train.number} · {train.departureDate} · {train.departureTime} – {train.arrivalTime} · {train.duration}
            </p>
          </div>
          <div className={styles.typeBadge}>{train.type}</div>
        </div>

        {/* Основний контент: двоколонковий лейаут на великих екранах */}
        <div className={styles.layout}>
          {/* Ліва колонка: вибір вагону і схема місць */}
          <div className={styles.leftCol}>
            <WagonSelector wagons={train.wagons} basePrice={train.price} />
            <SeatMap wagon={selectedWagon} basePrice={train.price} />
          </div>

          {/* Права колонка: форма бронювання */}
          <div className={styles.rightCol}>
            <BookingForm train={train} wagon={selectedWagon} />
          </div>
        </div>
      </div>
    </main>
  );
}
