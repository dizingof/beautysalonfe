import { useState, useEffect } from 'react';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminToggleCategory,
  type AdminCategory,
  type CategoryPayload,
} from '../../api/adminClient';
import styles from './TabTable.module.css';
import formStyles from './FormModal.module.css';

export default function CategoriesTab() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const load = async () => {
    try {
      setCategories(await adminGetCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload: CategoryPayload) => {
    if (editing) {
      await adminUpdateCategory(editing.id, payload);
    } else {
      await adminCreateCategory(payload);
    }
    await load();
    setModalOpen(false);
    setEditing(null);
  };

  const handleToggle = async (cat: AdminCategory) => {
    try {
      await adminToggleCategory(cat.id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Помилка');
    }
  };

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c: AdminCategory) => { setEditing(c); setModalOpen(true); };

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <h2 className={styles.sectionTitle}>Категорії</h2>
        <button className={styles.addBtn} onClick={openAdd}>+ Додати категорію</button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Завантаження...</div>
        ) : categories.length === 0 ? (
          <div className={styles.empty}>Категорій поки немає</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Емоджі</th>
                <th>Назва</th>
                <th>Ключ</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} style={{ opacity: c.isActive ? 1 : 0.5 }}>
                  <td style={{ fontSize: '1.5rem', textAlign: 'center' }}>{c.emoji}</td>
                  <td><strong>{c.name}</strong></td>
                  <td><code>{c.key}</code></td>
                  <td>{c.sortOrder}</td>
                  <td>
                    <span style={{ color: c.isActive ? '#27ae60' : '#e74c3c', fontWeight: 600 }}>
                      {c.isActive ? '✅ Активна' : '⛔ Неактивна'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => openEdit(c)}>Редагувати</button>
                    <button
                      className={c.isActive ? styles.btnDelete : styles.btnEdit}
                      onClick={() => handleToggle(c)}
                    >
                      {c.isActive ? 'Деактивувати' : 'Активувати'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <CategoryFormModal
          category={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function CategoryFormModal({
  category,
  onSave,
  onClose,
}: {
  category: AdminCategory | null;
  onSave: (payload: CategoryPayload) => Promise<void>;
  onClose: () => void;
}) {
  const [key, setKey] = useState(category?.key ?? '');
  const [name, setName] = useState(category?.name ?? '');
  const [emoji, setEmoji] = useState(category?.emoji ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) { setError("Ключ обов'язковий"); return; }
    if (!name.trim()) { setError("Назва обов'язкова"); return; }
    setError('');
    setSaving(true);
    try {
      await onSave({ key, name, emoji, sortOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={formStyles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={formStyles.modal} onSubmit={handleSubmit}>
        <h2 className={formStyles.modalTitle}>{category ? 'Редагувати категорію' : 'Нова категорія'}</h2>

        {error && <div className={formStyles.error}>{error}</div>}

        <div className={formStyles.field}>
          <label className={formStyles.label}>Ключ (англійською) *</label>
          <input className={formStyles.input} value={key} onChange={(e) => setKey(e.target.value)} placeholder="Manicure" required />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>Назва *</label>
          <input className={formStyles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Манікюр" required />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>Емоджі</label>
          <input className={formStyles.input} value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="💅" />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>Порядок сортування</label>
          <input
            className={formStyles.input}
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.btnCancel} onClick={onClose}>Скасувати</button>
          <button type="submit" className={formStyles.btnSave} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </div>
  );
}
