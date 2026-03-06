import { reviews } from '../../data/mockData';
import styles from './Reviews.module.css';

export default function Reviews() {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section id="reviews" className={`section ${styles.reviews}`}>
      <div className="container">
        <h2 className="section-title">Відгуки</h2>
        <div className={styles['reviews-grid']}>
          {reviews.map((review) => (
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
