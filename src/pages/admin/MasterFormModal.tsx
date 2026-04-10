import { useState, useEffect } from 'react';
import type { Master } from '../../types';
import type { MasterPayload } from '../../api/adminClient';
import { adminGetCategories, type AdminCategory } from '../../api/adminClient';
import styles from './FormModal.module.css';

interface Props {
  master: Master | null;
  onSave: (payload: MasterPayload) => Promise<void>;
  onClose: () => void;
}

export default function MasterFormModal({ master, onSave, onClose }: Props) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [name, setName] = useState(master?.name ?? '');
  const [photo, setPhoto] = useState(master?.photo ?? '');
  const [experience, setExperience] = useState(master?.experience ?? '');
  const [description, setDescription] = useState(master?.description ?? '');
  const [specializations, setSpecializations] = useState<string[]>(
    master?.specializations as string[] ?? []
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetCategories().then(setCategories);
  }, []);

  const toggleSpec = (value: string) => {
    setSpecializations((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Ім'я обов'язкове"); return; }
    setError('');
    setSaving(true);
    try {
      await onSave({ name, photo, experience, description, specializations });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h2 className={styles.modalTitle}>{master ? 'Редагувати майстра' : 'Новий майстер'}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Ім'я *</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>URL фото</label>
          <input className={styles.input} value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="https://..." />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Досвід</label>
          <input className={styles.input} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="3 роки" />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Опис</label>
          <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Спеціалізації</label>
          <div className={styles.checkboxGroup}>
            {categories.map((cat) => (
              <label key={cat.key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={specializations.includes(cat.key)}
                  onChange={() => toggleSpec(cat.key)}
                />
                {cat.emoji} {cat.name}
              </label>
            ))}
          </div>
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
