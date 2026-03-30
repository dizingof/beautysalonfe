import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../../api/adminClient';
import MastersTab from './MastersTab';
import ServicesTab from './ServicesTab';
import styles from './AdminDashboard.module.css';

type Tab = 'masters' | 'services';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('masters');
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
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
      </nav>

      <main className={styles.content}>
        {tab === 'masters' && <MastersTab />}
        {tab === 'services' && <ServicesTab />}
      </main>
    </div>
  );
}
