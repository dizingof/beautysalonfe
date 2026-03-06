import { masters, categoryNames } from '../../data/mockData';
import styles from './Masters.module.css';

interface MastersProps {
  onMasterClick: (masterId: string) => void;
}

export default function Masters({ onMasterClick }: MastersProps) {
  return (
    <section id="masters" className={`section ${styles.masters}`}>
      <div className="container">
        <h2 className="section-title">Майстри</h2>
        <div className={styles['masters-grid']}>
          {masters.map((master) => (
            <div
              key={master.id}
              className={styles['master-card']}
              onClick={() => onMasterClick(master.id)}
            >
              <div className={styles['master-photo-wrapper']}>
                <div className={styles['master-photo-placeholder']}>
                  {master.name[0]}
                </div>
              </div>
              <h3 className={styles['master-name']}>{master.name}</h3>
              <div className={styles['master-rating']}>
                <span className={styles['master-star']}>★</span>
                <span>{master.rating.toFixed(1)}</span>
              </div>
              <div className={styles['master-specs']}>
                {master.specializations.map((spec) => (
                  <span key={spec} className={styles['master-spec-tag']}>
                    {categoryNames[spec]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
