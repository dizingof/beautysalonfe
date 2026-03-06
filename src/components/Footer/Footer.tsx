import { MapPin, Phone, Clock, Send, Instagram } from 'lucide-react';
import { contactInfo } from '../../data/mockData';
import styles from './Footer.module.css';

interface FooterProps {
  onBookClick: () => void;
}

export default function Footer({ onBookClick }: FooterProps) {
  return (
    <footer id="contacts" className={styles.footer}>
      <div className="container">
        <div className={styles['footer-inner']}>
          <div className={styles['footer-brand']}>
            <div className={styles['footer-logo']}>Beauty Room</div>
            <div className={styles['footer-logo-sub']}>salon</div>
            <p className={styles['footer-description']}>
              Салон краси у серці Києва. Працюємо з любов&apos;ю до кожної деталі.
            </p>
          </div>

          <div className={styles['footer-section']}>
            <h4>Наші контакти</h4>
            <div className={styles['footer-contacts-item']}>
              <MapPin size={18} />
              <span>{contactInfo.address}</span>
            </div>
            <div className={styles['footer-contacts-item']}>
              <Phone size={18} />
              <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}>{contactInfo.phone}</a>
            </div>
            <div className={styles['footer-contacts-item']}>
              <Clock size={18} />
              <span>{contactInfo.schedule}</span>
            </div>

            <div className={styles['footer-socials']}>
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['footer-social-link']}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={contactInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['footer-social-link']}
                aria-label="Telegram"
              >
                <Send size={20} />
              </a>
            </div>
          </div>

          <div className={styles['footer-cta-section']}>
            <h4>Запишіться онлайн</h4>
            <p className={styles['footer-cta-text']}>
              Оберіть зручний час та улюбленого майстра за кілька кліків.
            </p>
            <button className="btn btn-primary btn-lg" onClick={onBookClick}>
              Записатися
            </button>
          </div>
        </div>

        <div className={styles['footer-bottom']}>
          © {new Date().getFullYear()} Beauty Room. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
