import { useState, useEffect, useMemo } from 'react';
import { getServices, getCategories } from '../../api/client';
import type { ServiceCategory, Service } from '../../types';
import styles from './Prices.module.css';

interface PricesProps {
  onBookService: (serviceId: string) => void;
  initialCategory?: ServiceCategory;
}

export default function Prices({ onBookService, initialCategory }: PricesProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>(initialCategory || '');
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [catList, setCatList] = useState<{ key: string; name: string }[]>([]);

  useEffect(() => {
    getServices().then(setAllServices).catch(console.error);
    getCategories()
      .then((cats) => {
        setCatList(cats);
        if (!initialCategory && cats.length > 0) setActiveCategory(cats[0].key);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  const filteredServices = allServices.filter((s) => s.category === activeCategory);

  const servicesJsonLd = useMemo(() => {
    if (allServices.length === 0) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      'name': 'Послуги Beauty Room',
      'itemListElement': allServices.map((s) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': s.name,
          'description': s.description,
          'provider': {
            '@type': 'BeautySalon',
            'name': 'Beauty Room',
            'url': 'https://beautyroomvarna.space',
          },
        },
        'price': s.price.toFixed(2),
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/InStock',
      })),
    });
  }, [allServices]);

  return (
    <section id="prices" className={`section ${styles.prices}`}>
      {servicesJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: servicesJsonLd }}
        />
      )}
      <div className="container">
        <h2 className="section-title">Ціни</h2>

        <div className={styles['prices-tabs']}>
          {catList.map((cat) => (
            <button
              key={cat.key}
              className={`${styles['prices-tab']} ${activeCategory === cat.key ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className={styles['prices-table']}>
          {filteredServices.map((service) => (
            <div key={service.id} className={styles['prices-row']}>
              <div className={styles['prices-row-name']}>{service.name}</div>
              <div className={styles['prices-row-duration']}>{service.duration} хв</div>
              <div className={styles['prices-row-price']}>{service.price} €</div>
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
