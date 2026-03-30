import { useState, useEffect } from 'react';
import type { Service } from '../../types';
import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
  type ServicePayload,
} from '../../api/adminClient';
import ServiceFormModal from './ServiceFormModal';
import styles from './TabTable.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  Sugaring: 'Шугарінг',
  Manicure: 'Манікюр',
  Pedicure: 'Педикюр',
  Brows: 'Брови',
};

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = async () => {
    try {
      setServices(await adminGetServices());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload: ServicePayload) => {
    if (editing) {
      await adminUpdateService(editing.id, payload);
    } else {
      await adminCreateService(payload);
    }
    await load();
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`Видалити послугу "${service.name}"?`)) return;
    try {
      await adminDeleteService(service.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setModalOpen(true); };

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <h2 className={styles.sectionTitle}>Послуги та ціни</h2>
        <button className={styles.addBtn} onClick={openAdd}>+ Додати послугу</button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Завантаження...</div>
        ) : services.length === 0 ? (
          <div className={styles.empty}>Послуг поки немає</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна (грн)</th>
                <th>Тривалість (хв)</th>
                <th>Опис</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>
                    <span className={styles.tag}>
                      {CATEGORY_LABELS[s.category as string] ?? s.category}
                    </span>
                  </td>
                  <td>{s.price} грн</td>
                  <td>{s.duration} хв</td>
                  <td>{s.description}</td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(s)}>Редагувати</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(s)}>Видалити</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ServiceFormModal
          service={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
