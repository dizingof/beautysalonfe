import { categoryNames, categoryMinPrices } from '../../data/mockData';
import type { ServiceCategory } from '../../types';
import styles from './Services.module.css';

const categoryIcons: Record<string, string> = {
  sugaring: '✨',
  manicure: '💅',
  pedicure: '🦶',
  brows: '👁️',
};

const categories: ServiceCategory[] = ['sugaring', 'manicure', 'pedicure', 'brows'];

interface ServicesProps {
  onCategoryClick: (category: ServiceCategory) => void;
}

export default function Services({ onCategoryClick }: ServicesProps) {
  return (
    <section id="services" className={`section ${styles.services}`}>
      <div className="container">
        <h2 className="section-title">Послуги</h2>
        <div className={styles['services-grid']}>
          {categories.map((cat) => (
            <div
              key={cat}
              className={styles['service-card']}
              onClick={() => onCategoryClick(cat)}
            >
              <div className={styles['service-card-image']}>
                <div className={`${styles['service-card-placeholder']} ${styles[cat]}`}>
                  {categoryIcons[cat]}
                </div>
              </div>
              <h3>{categoryNames[cat]}</h3>
              <p className={styles['service-card-price']}>
                від {categoryMinPrices[cat]} грн
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
