import { useState, useEffect } from 'react';
import type { Service } from '../../types';
import {
  adminGetServices,
  adminCreateService,
  adminUpdateService,
  adminToggleService,
  adminGetCategories,
  type ServicePayload,
  type AdminCategory,
} from '../../api/adminClient';
import ServiceFormModal from './ServiceFormModal';
import styles from './TabTable.module.css';

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = async () => {
    try {
      const [svcs, cats] = await Promise.all([adminGetServices(), adminGetCategories()]);
      setServices(svcs);
      const labels: Record<string, string> = {};
      cats.forEach((c: AdminCategory) => { labels[c.key] = `${c.emoji} ${c.name}`; labels[c.key.toLowerCase()] = `${c.emoji} ${c.name}`; });
      setCategories(labels);
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

  const handleToggle = async (service: Service) => {
    try {
      await adminToggleService(service.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка');
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
                <th>Ціна (€)</th>
                <th>Тривалість (хв)</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} style={{ opacity: s.isActive === false ? 0.5 : 1 }}>
                  <td><strong>{s.name}</strong></td>
                  <td>
                    <span className={styles.tag}>
                      {categories[s.category as string] ?? s.category}
                    </span>
                  </td>
                  <td>{s.price} €</td>
                  <td>{s.duration} хв</td>
                  <td>
                    <span style={{ color: s.isActive !== false ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                      {s.isActive !== false ? '✅ Активна' : '⛔ Неактивна'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(s)}>Редагувати</button>
                    <button
                      className={s.isActive !== false ? styles.btnDelete : styles.btnEdit}
                      onClick={() => handleToggle(s)}
                    >
                      {s.isActive !== false ? 'Деактивувати' : 'Активувати'}
                    </button>
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
