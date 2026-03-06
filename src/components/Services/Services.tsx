import { useState, useEffect } from 'react';
import type { ServiceCategory } from '../../types';
import { getCategories } from '../../api/client';
import styles from './Services.module.css';

const categoryIcons: Record<string, string> = {
  sugaring: '✨',
  manicure: '💅',
  pedicure: '🦶',
  brows: '👁️',
};

const categoryOrder: ServiceCategory[] = ['sugaring', 'manicure', 'pedicure', 'brows'];

interface ServicesProps {
  onCategoryClick: (category: ServiceCategory) => void;
}

export default function Services({ onCategoryClick }: ServicesProps) {
  const [categories, setCategories] = useState<{ key: string; name: string; minPrice: number }[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const sorted = [...categories].sort(
    (a, b) => categoryOrder.indexOf(a.key as ServiceCategory) - categoryOrder.indexOf(b.key as ServiceCategory)
  );

  return (
    <section id="services" className={`section ${styles.services}`}>
      <div className="container">
        <h2 className="section-title">Послуги</h2>
        <div className={styles['services-grid']}>
          {sorted.map((cat) => (
            <div
              key={cat.key}
              className={styles['service-card']}
              onClick={() => onCategoryClick(cat.key as ServiceCategory)}
            >
              <div className={styles['service-card-image']}>
                <div className={`${styles['service-card-placeholder']} ${styles[cat.key]}`}>
                  {categoryIcons[cat.key]}
                </div>
              </div>
              <h3>{cat.name}</h3>
              <p className={styles['service-card-price']}>
                від {cat.minPrice} грн
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
