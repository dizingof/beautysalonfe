import { useState, useEffect } from 'react';
import type { Master } from '../../types';
import {
  adminGetMasters,
  adminCreateMaster,
  adminUpdateMaster,
  adminDeleteMaster,
  type MasterPayload,
} from '../../api/adminClient';
import MasterFormModal from './MasterFormModal';
import styles from './TabTable.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  Sugaring: 'Шугарінг',
  Manicure: 'Манікюр',
  Pedicure: 'Педикюр',
  Brows: 'Брови',
};

export default function MastersTab() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Master | null>(null);

  const load = async () => {
    try {
      setMasters(await adminGetMasters());
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

  const handleDelete = async (master: Master) => {
    if (!confirm(`Видалити майстра "${master.name}"?`)) return;
    await adminDeleteMaster(master.id);
    await load();
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
                <th>Опис</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {masters.map((m) => (
                <tr key={m.id}>
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
                          {CATEGORY_LABELS[s] ?? s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{m.description}</td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(m)}>Редагувати</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(m)}>Видалити</button>
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
