import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { clearToken } from '../../api/adminClient';
import MastersTab from './MastersTab';
import ServicesTab from './ServicesTab';
import ReviewsTab from './ReviewsTab';
import BookingsTab from './BookingsTab';
import styles from './AdminDashboard.module.css';

type Tab = 'masters' | 'services' | 'reviews' | 'bookings';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('masters');
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
      <Helmet>
        <title>Адмін-панель — Beauty Room</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className={styles.header}>
        <span className={styles.logo}>Beauty Room — Адмін</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Вийти
        </button>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'masters' ? styles.active : ''}`}
          onClick={() => setTab('masters')}
        >
          Майстри
        </button>
        <button
          className={`${styles.tab} ${tab === 'services' ? styles.active : ''}`}
          onClick={() => setTab('services')}
        >
          Послуги та ціни
        </button>
        <button
          className={`${styles.tab} ${tab === 'reviews' ? styles.active : ''}`}
          onClick={() => setTab('reviews')}
        >
          Відгуки
        </button>
        <button
          className={`${styles.tab} ${tab === 'bookings' ? styles.active : ''}`}
          onClick={() => setTab('bookings')}
        >
          Записи
        </button>
      </nav>

      <main className={styles.content}>
        {tab === 'masters' && <MastersTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'bookings' && <BookingsTab />}
      </main>
    </div>
  );
}
