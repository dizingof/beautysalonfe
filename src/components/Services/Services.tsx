import { useState, useEffect } from 'react';
import type { ServiceCategory } from '../../types';
import { getCategories } from '../../api/client';
import { ServicesSkeleton } from '../Skeleton/Skeleton';
import styles from './Services.module.css';

interface ServicesProps {
  onCategoryClick: (category: ServiceCategory) => void;
}

export default function Services({ onCategoryClick }: ServicesProps) {
  const [categories, setCategories] = useState<{ key: string; name: string; emoji?: string; minPrice: number }[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <section id="services" className={`section ${styles.services}`}>
      <div className="container">
        <h2 className="section-title">Послуги</h2>
        <div className={styles['services-grid']}>
          {categories.length === 0 ? <ServicesSkeleton /> : categories.map((cat) => (
            <div
              key={cat.key}
              className={styles['service-card']}
              onClick={() => onCategoryClick(cat.key as ServiceCategory)}
            >
              <div className={styles['service-card-image']}>
                <div className={`${styles['service-card-placeholder']} ${styles[cat.key]}`}>
                  {cat.emoji || cat.key}
                </div>
              </div>
              <h3>{cat.name}</h3>
              <p className={styles['service-card-price']}>
                від {cat.minPrice} €
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
