// ============================================================
// BookingForm.jsx — Форма бронювання квитків
//
// Поля:
//   • Ім'я (обов'язкове, мін. 2 символи)
//   • Телефон (формат +380XXXXXXXXX)
//   • Email (валідація регулярним виразом)
//
// Логіка:
//   1. Валідуємо поля при сабміті (і при blur для кожного поля)
//   2. Якщо валідація пройшла — викликаємо saveBooking() з сервісу
//   3. При успіху показуємо toast-повідомлення і додаємо в контекст
//   4. Перенаправляємо на головну сторінку
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBooking } from "../context/BookingContext";
import { saveBooking } from "../services/BookingService";
import styles from "./BookingForm.module.css";

// ---- Правила валідації ----
const validators = {
  name: (v) => {
    if (!v.trim()) return "Ім'я є обов'язковим";
    if (v.trim().length < 2) return "Ім'я має містити мінімум 2 символи";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Телефон є обов'язковим";
    if (!/^\+380\d{9}$/.test(v.replace(/\s/g, "")))
      return "Формат: +380XXXXXXXXX";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email є обов'язковим";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Введіть коректний email";
    return "";
  },
};

export default function BookingForm({ train, wagon }) {
  const navigate = useNavigate();
  const { state, addBooking, clearSeats } = useBooking();

  const [fields, setFields] = useState({ name: "", phone: "+380", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedSeats = state.selectedSeats;
  const price = wagon
    ? Math.round(train.price * wagon.priceMultiplier)
    : train.price;
  const totalCost = selectedSeats.length * price;

  // Оновлення поля
  function handleChange(field, value) {
    setFields((prev) => ({ ...prev, [field]: value }));
    // Знімаємо помилку при редагуванні
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  // Валідація при виході з поля (blur)
  function handleBlur(field) {
    const err = validators[field](fields[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  // Сабміт форми
  async function handleSubmit(e) {
    e.preventDefault();

    // Валідуємо всі поля
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      newErrors[field] = validators[field](fields[field]);
    });
    setErrors(newErrors);

    // Якщо є хоча б одна помилка — не відправляємо
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const result = await saveBooking({
        trainId: train.id,
        wagonId: wagon.id,
        seats: selectedSeats,
        passenger: {
          name: fields.name.trim(),
          phone: fields.phone.trim(),
          email: fields.email.trim(),
        },
      });

      if (result.success) {
        // Додаємо в глобальний стан
        addBooking({
          ...result.booking,
          trainNumber: train.number,
          from: train.from,
          to: train.to,
          departureDate: train.departureDate,
          departureTime: train.departureTime,
          wagonNumber: wagon.number,
          wagonType: wagon.type,
          totalCost,
        });

        toast.success(
          `✅ Бронювання підтверджено! Квиток №${result.booking.id}`,
          { autoClose: 5000 }
        );

        navigate("/bookings");
      } else {
        toast.error("❌ Помилка бронювання. Спробуйте ще раз.");
      }
    } catch {
      toast.error("❌ Щось пішло не так. Перевірте з'єднання.");
    } finally {
      setLoading(false);
    }
  }

  // Якщо місця не обрані — показуємо підказку
  if (selectedSeats.length === 0) {
    return (
      <div className={styles.hint}>
        💡 Оберіть місця на схемі вагону, щоб продовжити бронювання
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitle}>🎫 Дані пасажира</h3>

      {/* Поля форми */}
      <div className={styles.fields}>
        {/* Ім'я */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Ім'я та прізвище *</label>
          <input
            className={`${styles.input} ${errors.name ? styles.error : ""}`}
            type="text"
            placeholder="Іваненко Іван"
            value={fields.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
          />
          {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
        </div>

        {/* Телефон */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Телефон *</label>
          <input
            className={`${styles.input} ${errors.phone ? styles.error : ""}`}
            type="tel"
            placeholder="+380501234567"
            value={fields.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
          />
          {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email *</label>
          <input
            className={`${styles.input} ${errors.email ? styles.error : ""}`}
            type="email"
            placeholder="ivan@example.com"
            value={fields.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>
      </div>

      {/* Підсумок */}
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Рейс</span>
          <span>{train.from} → {train.to}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Відправлення</span>
          <span>{train.departureDate} {train.departureTime}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Вагон</span>
          <span>№{wagon.number} ({wagon.type})</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Місця</span>
          <span>{[...selectedSeats].sort((a, b) => a - b).join(", ")}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Разом до сплати</span>
          <span>{totalCost} ₴</span>
        </div>
      </div>

      {/* Кнопка підтвердження */}
      <button
        type="submit"
        className={`${styles.submitBtn} ${loading ? styles.loading : ""}`}
        disabled={loading}
      >
        {loading ? "Обробляємо..." : `Підтвердити бронювання — ${totalCost} ₴`}
      </button>
    </form>
  );
}
