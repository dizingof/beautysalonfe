import { useState, useEffect } from 'react';
import type { Master } from '../../types';
import {
  adminGetMasters,
  adminCreateMaster,
  adminUpdateMaster,
  adminToggleMaster,
  adminRefreshMasterSchedule,
  adminGetCategories,
  type MasterPayload,
  type AdminCategory,
} from '../../api/adminClient';
import MasterFormModal from './MasterFormModal';
import styles from './TabTable.module.css';

export default function MastersTab() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Master | null>(null);

  const load = async () => {
    try {
      const [msts, cats] = await Promise.all([adminGetMasters(), adminGetCategories()]);
      setMasters(msts);
      const labels: Record<string, string> = {};
      cats.forEach((c: AdminCategory) => { labels[c.key] = `${c.emoji} ${c.name}`; labels[c.key.toLowerCase()] = `${c.emoji} ${c.name}`; });
      setCategories(labels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload: MasterPayload) => {
    if (editing) {
      await adminUpdateMaster(editing.id, payload);
    } else {
      await adminCreateMaster(payload);
    }
    await load();
    setModalOpen(false);
    setEditing(null);
  };

  const handleToggle = async (master: Master) => {
    try {
      await adminToggleMaster(master.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка');
    }
  };

  const handleRefreshSchedule = async (master: Master) => {
    await adminRefreshMasterSchedule(master.id);
    alert(`Розклад для ${master.name} оновлено на 30 днів`);
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (m: Master) => { setEditing(m); setModalOpen(true); };

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <h2 className={styles.sectionTitle}>Майстри</h2>
        <button className={styles.addBtn} onClick={openAdd}>+ Додати майстра</button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Завантаження...</div>
        ) : masters.length === 0 ? (
          <div className={styles.empty}>Майстрів поки немає</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Фото</th>
                <th>Ім'я</th>
                <th>Досвід</th>
                <th>Спеціалізації</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {masters.map((m) => (
                <tr key={m.id} style={{ opacity: m.isActive === false ? 0.5 : 1 }}>
                  <td>
                    {m.photo ? (
                      <img className={styles.photo} src={m.photo} alt={m.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className={styles.noPhoto}>👤</div>
                    )}
                  </td>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.experience}</td>
                  <td>
                    <div className={styles.tags}>
                      {m.specializations.map((s) => (
                        <span key={s} className={styles.tag}>
                          {categories[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ color: m.isActive !== false ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                      {m.isActive !== false ? '✅ Активний' : '⛔ Неактивний'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(m)}>Редагувати</button>
                    <button className={styles.btnEdit} onClick={() => handleRefreshSchedule(m)}>📅 Розклад</button>
                    <button
                      className={m.isActive !== false ? styles.btnDelete : styles.btnEdit}
                      onClick={() => handleToggle(m)}
                    >
                      {m.isActive !== false ? 'Деактивувати' : 'Активувати'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <MasterFormModal
          master={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
