import { useState, useEffect } from 'react';
import { getServices, getCategories } from '../../api/client';
import type { ServiceCategory, Service } from '../../types';
import styles from './Prices.module.css';

const categoryOrder: ServiceCategory[] = ['sugaring', 'manicure', 'pedicure', 'brows'];

interface PricesProps {
  onBookService: (serviceId: string) => void;
  initialCategory?: ServiceCategory;
}

export default function Prices({ onBookService, initialCategory }: PricesProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory || 'sugaring');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [catNames, setCatNames] = useState<Record<string, string>>({});

  useEffect(() => {
    getServices().then(setAllServices).catch(console.error);
    getCategories()
      .then((cats) => {
        const map: Record<string, string> = {};
        cats.forEach((c) => (map[c.key] = c.name));
        setCatNames(map);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredServices = allServices.filter((s) => s.category === activeCategory);

  return (
    <section id="prices" className={`section ${styles.prices}`}>
      <div className="container">
        <h2 className="section-title">Ціни</h2>

        <div className={styles['prices-tabs']}>
          {categoryOrder.map((cat) => (
            <button
              key={cat}
              className={`${styles['prices-tab']} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {catNames[cat] || cat}
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
