import { useState, useEffect } from 'react';
import type { Review, Master } from '../../types';
import {
  adminGetReviews,
  adminCreateReview,
  adminUpdateReview,
  adminDeleteReview,
  type ReviewPayload,
} from '../../api/adminClient';
import { adminGetMasters } from '../../api/adminClient';
import ReviewFormModal from './ReviewFormModal';
import styles from './TabTable.module.css';

const STARS = ['★', '★★', '★★★', '★★★★', '★★★★★'];

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const load = async () => {
    try {
      const [r, m] = await Promise.all([adminGetReviews(), adminGetMasters()]);
      setReviews(r);
      setMasters(m);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload: ReviewPayload) => {
    if (editing) {
      await adminUpdateReview(editing.id, payload);
    } else {
      await adminCreateReview(payload);
    }
    await load();
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`Видалити відгук від "${review.author}"?`)) return;
    await adminDeleteReview(review.id);
    await load();
  };

  const getMasterName = (id: string) => masters.find(m => m.id === id)?.name ?? '—';

  return (
    <div className={styles.section}>
      <div className={styles.toolbar}>
        <h2 className={styles.sectionTitle}>Відгуки</h2>
        <button className={styles.addBtn} onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Додати відгук
        </button>
      </div>

      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Завантаження...</div>
        ) : reviews.length === 0 ? (
          <div className={styles.empty}>Відгуків поки немає</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Автор</th>
                <th>Майстер</th>
                <th>Оцінка</th>
                <th>Текст</th>
                <th>Дата</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.author}</strong></td>
                  <td><span className={styles.tag}>{getMasterName(r.masterId)}</span></td>
                  <td style={{ color: '#c9a96e', letterSpacing: 2 }}>{STARS[r.rating - 1]}</td>
                  <td>{r.text}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
                  <td>
                    <button className={styles.btnEdit} onClick={() => { setEditing(r); setModalOpen(true); }}>Редагувати</button>
                    <button className={styles.btnDelete} onClick={() => handleDelete(r)}>Видалити</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ReviewFormModal
          review={editing}
          masters={masters}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
