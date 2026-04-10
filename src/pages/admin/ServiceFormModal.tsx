import { useState, useEffect } from 'react';
import type { Service } from '../../types';
import type { ServicePayload } from '../../api/adminClient';
import { adminGetCategories, type AdminCategory } from '../../api/adminClient';
import styles from './FormModal.module.css';

interface Props {
  service: Service | null;
  onSave: (payload: ServicePayload) => Promise<void>;
  onClose: () => void;
}

export default function ServiceFormModal({ service, onSave, onClose }: Props) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState(service?.name ?? '');
  const [category, setCategory] = useState(service?.category as string ?? '');
  const [price, setPrice] = useState(service?.price ?? 0);
  const [duration, setDuration] = useState(service?.duration ?? 60);
  const [description, setDescription] = useState(service?.description ?? '');
  const [image, setImage] = useState(service?.image ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetCategories().then((cats) => {
      setCategories(cats);
      if (!service && cats.length > 0 && !category) {
        setCategory(cats[0].key);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Назва обов'язкова"); return; }
    if (price <= 0) { setError('Ціна має бути більше 0'); return; }
    setError('');
    setSaving(true);
    try {
      await onSave({ name, category, price, duration, description, image });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h2 className={styles.modalTitle}>{service ? 'Редагувати послугу' : 'Нова послуга'}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Назва *</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Категорія</label>
          <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Ціна (€) *</label>
          <input
            className={styles.input}
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Тривалість (хвилин)</label>
          <input
            className={styles.input}
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Опис</label>
          <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>URL зображення</label>
          <input className={styles.input} value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/service.jpg" />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>Скасувати</button>
          <button type="submit" className={styles.btnSave} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </form>
    </div>
  );
}
