import { useState, useEffect } from 'react';
import { getReviews, getMasters, createReview } from '../../api/client';
import type { Review, Master } from '../../types';
import styles from './Reviews.module.css';

export default function Reviews() {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [masterId, setMasterId] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = () => getReviews().then(setReviewsData).catch(console.error);

  useEffect(() => {
    load();
    getMasters().then((m) => { setMasters(m); if (m.length > 0) setMasterId(m[0].id); }).catch(console.error);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await createReview({ author, rating, text, masterId });
      setSuccess(true);
      setAuthor(''); setText(''); setRating(5);
      setFormOpen(false);
      await load();
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className={`section ${styles.reviews}`}>
      <div className="container">
        <div className={styles['reviews-header']}>
          <h2 className="section-title">Відгуки</h2>
          <button className={styles['add-review-btn']} onClick={() => setFormOpen((v) => !v)}>
            {formOpen ? '✕ Скасувати' : '+ Залишити відгук'}
          </button>
        </div>

        {success && <div className={styles['success-msg']}>Дякуємо! Ваш відгук додано ✓</div>}

        {formOpen && (
          <form className={styles['review-form']} onSubmit={handleSubmit}>
            {error && <div className={styles['form-error']}>{error}</div>}
            <div className={styles['form-row']}>
              <div className={styles['form-field']}>
                <label>Ваше ім'я *</label>
                <input value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="Ім'я" />
              </div>
              <div className={styles['form-field']}>
                <label>Майстер</label>
                <select value={masterId} onChange={(e) => setMasterId(e.target.value)}>
                  {masters.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className={styles['form-field']}>
                <label>Оцінка</label>
                <div className={styles['star-picker']}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" className={n <= rating ? styles['star-active'] : styles['star']} onClick={() => setRating(n)}>★</button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles['form-field']}>
              <label>Текст відгуку *</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} required placeholder="Поділіться враженнями..." rows={3} />
            </div>
            <button className={styles['form-submit']} type="submit" disabled={submitting}>
              {submitting ? 'Надсилання...' : 'Надіслати відгук'}
            </button>
          </form>
        )}

        <div className={styles['reviews-grid']}>
          {reviewsData.map((review) => (
            <div key={review.id} className={styles['review-card']}>
              <div className={styles['review-header']}>
                <span className={styles['review-author']}>{review.author}</span>
                <span className={styles['review-date']}>{formatDate(review.date)}</span>
              </div>
              <div className={styles['review-stars']}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              <p className={styles['review-text']}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
