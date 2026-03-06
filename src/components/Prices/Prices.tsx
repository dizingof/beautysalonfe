import { useState } from 'react';
import { services, categoryNames } from '../../data/mockData';
import type { ServiceCategory } from '../../types';
import styles from './Prices.module.css';

const categories: ServiceCategory[] = ['sugaring', 'manicure', 'pedicure', 'brows'];

interface PricesProps {
  onBookService: (serviceId: string) => void;
  initialCategory?: ServiceCategory;
}

export default function Prices({ onBookService, initialCategory }: PricesProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory || 'sugaring');

  const filteredServices = services.filter((s) => s.category === activeCategory);

  return (
    <section id="prices" className={`section ${styles.prices}`}>
      <div className="container">
        <h2 className="section-title">Ціни</h2>

        <div className={styles['prices-tabs']}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles['prices-tab']} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryNames[cat]}
            </button>
          ))}
        </div>

        <div className={styles['prices-table']}>
          {filteredServices.map((service) => (
            <div key={service.id} className={styles['prices-row']}>
              <div className={styles['prices-row-name']}>{service.name}</div>
              <div className={styles['prices-row-duration']}>{service.duration} хв</div>
              <div className={styles['prices-row-price']}>{service.price} грн</div>
              <div className={styles['prices-row-action']}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onBookService(service.id)}
                >
                  Обрати
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
