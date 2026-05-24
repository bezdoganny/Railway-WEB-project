// ============================================================
// WagonSelector.jsx — Вибір вагона потяга
//
// Відображає кнопки для кожного вагону з інформацією:
//   • номер вагону
//   • тип (Економ, Купе, СВ тощо)
//   • кількість вільних місць
//   • ціна (базова × коефіцієнт вагону)
//
// При виборі вагону оновлює глобальний стан через useBooking.
// ============================================================

import { useBooking } from "../context/BookingContext";
import styles from "./WagonSelector.module.css";

export default function WagonSelector({ wagons, basePrice }) {
  const { state, selectWagon } = useBooking();

  return (
    <div className={styles.section}>
      <p className={styles.sectionTitle}>🚃 Оберіть вагон</p>
      <div className={styles.wagonRow}>
        {wagons.map((wagon) => {
          const freeSeats = wagon.totalSeats - wagon.bookedSeats.length;
          const price = Math.round(basePrice * wagon.priceMultiplier);
          const isSelected = state.selectedWagon?.id === wagon.id;

          return (
            <button
              key={wagon.id}
              className={`${styles.wagonBtn} ${isSelected ? styles.selected : ""}`}
              onClick={() => selectWagon(wagon)}
              title={`Вагон ${wagon.number} — ${wagon.type}`}
            >
              <span className={styles.wagonNumber}>{wagon.number}</span>
              <span className={styles.wagonType}>{wagon.type}</span>
              <span className={styles.wagonFree}>{freeSeats} вільно</span>
              <span className={styles.wagonPrice}>{price} ₴</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
