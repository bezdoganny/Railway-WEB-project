// ============================================================
// MyBookings.jsx — Сторінка з усіма бронюваннями користувача
//
// Маршрут: /bookings
//
// Відображає список бронювань з localStorage через контекст.
// Кожна картка містить повну інформацію про заброньований квиток.
// ============================================================

import { Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import styles from "./MyBookings.module.css";

export default function MyBookings() {
  const { state } = useBooking();
  const bookings = state.bookings;

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Заголовок */}
        <div className={styles.header}>
          <h1 className={styles.title}>🎫 Мої квитки</h1>
          <p className={styles.subtitle}>Усі ваші заброньовані квитки</p>
        </div>

        {/* Список бронювань або порожній стан */}
        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎟️</span>
            <h2 className={styles.emptyTitle}>У вас поки немає квитків</h2>
            <p>Оберіть рейс та заброньуйте місця</p>
            <Link to="/" className={styles.ctaBtn}>
              Переглянути рейси →
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {[...bookings].reverse().map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ---- Картка бронювання ----
function BookingCard({ booking }) {
  const statusLabel = booking.status === "confirmed" ? "✅ Підтверджено" : "❌ Скасовано";
  const statusClass = booking.status === "confirmed" ? styles.confirmed : styles.cancelled;

  return (
    <article className={styles.card}>
      {/* Заголовок картки */}
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.bookingId}>#{booking.id}</p>
          <h3 className={styles.route}>
            {booking.from} → {booking.to}
          </h3>
        </div>
        <span className={`${styles.status} ${statusClass}`}>{statusLabel}</span>
      </div>

      {/* Деталі */}
      <div className={styles.details}>
        <Detail icon="🚂" label="Потяг" value={booking.trainNumber} />
        <Detail icon="📅" label="Дата" value={booking.departureDate} />
        <Detail icon="🕐" label="Відправлення" value={booking.departureTime} />
        <Detail icon="🚃" label="Вагон" value={`№${booking.wagonNumber} (${booking.wagonType})`} />
        <Detail icon="💺" label="Місця" value={booking.seats.sort((a,b)=>a-b).join(", ")} />
        <Detail icon="👤" label="Пасажир" value={booking.passenger.name} />
        <Detail icon="📞" label="Телефон" value={booking.passenger.phone} />
      </div>

      {/* Ціна */}
      <div className={styles.cardFooter}>
        <span className={styles.createdAt}>
          Заброньовано: {new Date(booking.createdAt).toLocaleString("uk-UA")}
        </span>
        <span className={styles.total}>{booking.totalCost} ₴</span>
      </div>
    </article>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className={styles.detail}>
      <span className={styles.detailIcon}>{icon}</span>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
