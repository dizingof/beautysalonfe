import { Send } from 'lucide-react';
import { contactInfo } from '../../data/mockData';
import styles from './Hero.module.css';

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero({ onBookClick }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles['hero-inner']}>
        <div className={styles['hero-content']}>
          <h1 className={styles['hero-title']}>
            Краса<br />в деталях
          </h1>
          <p className={styles['hero-subtitle']}>
            Шугарінг <span>·</span> Манікюр <span>·</span> Педикюр <span>·</span> Брови
          </p>
          <div className={styles['hero-actions']}>
            <button className="btn btn-primary btn-lg" onClick={onBookClick}>
              Записатися
            </button>
            <a
              href={contactInfo.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-outline ${styles['hero-telegram']}`}
            >
              <Send size={18} />
              Telegram
            </a>
          </div>
        </div>

        <div className={styles['hero-image-wrapper']}>
          <div className={styles['hero-image-placeholder']}>
            Beauty Room
          </div>
          <div className={styles['hero-decoration']}></div>
        </div>
      </div>
    </section>
  );
}
