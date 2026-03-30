import { useState } from 'react';
import type { Review, Master } from '../../types';
import type { ReviewPayload } from '../../api/adminClient';
import styles from './FormModal.module.css';

interface Props {
  review: Review | null;
  masters: Master[];
  onSave: (payload: ReviewPayload) => Promise<void>;
  onClose: () => void;
}

export default function ReviewFormModal({ review, masters, onSave, onClose }: Props) {
  const [author, setAuthor] = useState(review?.author ?? '');
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [text, setText] = useState(review?.text ?? '');
  const [masterId, setMasterId] = useState(review?.masterId ?? (masters[0]?.id ?? ''));
  const [date, setDate] = useState(review?.date ?? new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) { setError("Ім'я автора обов'язкове"); return; }
    if (!masterId) { setError('Оберіть майстра'); return; }
    setError('');
    setSaving(true);
    try {
      await onSave({ author, rating, text, masterId, date });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className={styles.modal} onSubmit={handleSubmit}>
        <h2 className={styles.modalTitle}>{review ? 'Редагувати відгук' : 'Новий відгук'}</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Автор *</label>
          <input className={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Майстер</label>
          <select className={styles.select} value={masterId} onChange={(e) => setMasterId(e.target.value)}>
            {masters.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Оцінка</label>
          <select className={styles.select} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Текст відгуку</label>
          <textarea className={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Дата</label>
          <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
