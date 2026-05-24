// ============================================================
// TrainCard.jsx — Картка окремого рейсу
//
// Пропси:
//   train    — об'єкт із даними рейсу (з trains.js)
//   onSelect — callback для переходу до бронювання
//
// Компонент суто "presentational" — не має власного стану,
// лише відображає дані та викликає callback при кліку.
// ============================================================

import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import styles from "./TrainCard.module.css";

// Визначаємо CSS-клас та емодзі для типу потяга
function getTypeStyle(type) {
  if (type.includes("Інтерсіті")) return { cls: styles.intercity, emoji: "⚡" };
  if (type.includes("Нічний"))    return { cls: styles.night,     emoji: "🌙" };
  return                                 { cls: styles.regional,  emoji: "🚂" };
}

export default function TrainCard({ train }) {
  const navigate = useNavigate();
  const { selectTrain } = useBooking();

  const typeInfo = getTypeStyle(train.type);

  function handleSelect() {
    // Зберігаємо обраний потяг у глобальному стані
    selectTrain(train);
    // Переходимо на сторінку бронювання
    navigate(`/booking/${train.id}`);
  }

  return (
    <article className={styles.card} onClick={handleSelect}>
      {/* Бейдж типу потяга */}
      <span className={`${styles.typeBadge} ${typeInfo.cls}`}>
        {typeInfo.emoji} {train.type}
      </span>

      {/* Номер потяга */}
      <p className={styles.trainNumber}>Поїзд №{train.number}</p>

      {/* Дата відправлення */}
      <p className={styles.date}>📅 {formatDate(train.departureDate)}</p>

      {/* Маршрут: місто → місто */}
      <div className={styles.route}>
        <div className={styles.city}>
          <div className={styles.cityName}>{train.from}</div>
          <div className={styles.cityTime}>{train.departureTime}</div>
        </div>

        <div className={styles.routeDivider}>
          <div className={styles.routeLine}>
            <span>🚆</span>
          </div>
          <span className={styles.routeDuration}>{train.duration}</span>
        </div>

        <div className={styles.city} style={{ textAlign: "right" }}>
          <div className={styles.cityName}>{train.to}</div>
          <div className={styles.cityTime}>{train.arrivalTime}</div>
        </div>
      </div>

      {/* Нижня частина: мета-інфо та ціна */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            🚃 {train.wagons.length} вагон{wagonsLabel(train.wagons.length)}
          </span>
          <span className={styles.metaItem}>
            💺 {countFreeSeats(train)} місць вільно
          </span>
        </div>

        <div style={{ textAlign: "right" }}>
          <span className={styles.price}>
            {train.price} ₴
            <span className={styles.priceLabel}>від / місце</span>
          </span>
        </div>

        <button className={styles.btn} onClick={handleSelect}>
          Обрати місця →
        </button>
      </div>
    </article>
  );
}

// --- допоміжні функції ---
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function countFreeSeats(train) {
  return train.wagons.reduce((total, w) => {
    return total + (w.totalSeats - w.bookedSeats.length);
  }, 0);
}

function wagonsLabel(n) {
  if (n === 1) return "";
  if (n < 5)   return "и";
  return "ів";
}
