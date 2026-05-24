// ============================================================
// Home.jsx — Головна сторінка (список рейсів)
//
// Маршрут: /
// Відображає:
//   • Hero-банер із заголовком
//   • Компонент TrainList зі списком рейсів та фільтрами
// ============================================================

import TrainList from "../components/TrainList";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroLabel}>🇺🇦 Офіційний продаж квитків</span>
            <h1 className={styles.heroTitle}>
              Залізничні
              <br />
              <span className={styles.heroAccent}>квитки онлайн</span>
            </h1>
            <p className={styles.heroSub}>
              Обирайте зручні рейси, вагони та місця — бронюйте за лічені секунди
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>6+</span>
              <span className={styles.statLabel}>Рейсів</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>15+</span>
              <span className={styles.statLabel}>Вагонів</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>195₴</span>
              <span className={styles.statLabel}>Від / місце</span>
            </div>
          </div>
        </div>
      </section>

      {/* Список рейсів */}
      <div className="container">
        <TrainList />
      </div>
    </main>
  );
}
