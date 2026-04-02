import styles from './Skeleton.module.css';

function Bone({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`${styles.skeleton} ${className}`} style={style} />;
}

export function ServicesSkeleton() {
  return (
    <div className={styles['skeleton-services-grid']}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles['skeleton-service-card']}>
          <Bone className={styles['skeleton-service-icon']} />
          <Bone className={styles['skeleton-service-name']} />
          <Bone className={styles['skeleton-service-price']} />
        </div>
      ))}
    </div>
  );
}

export function MastersSkeleton() {
  return (
    <div className={styles['skeleton-masters-grid']}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles['skeleton-master-card']}>
          <Bone className={styles['skeleton-master-photo']} />
          <Bone className={styles['skeleton-master-name']} />
          <Bone className={styles['skeleton-master-rating']} />
          <div className={styles['skeleton-master-tags']}>
            <Bone className={styles['skeleton-tag']} />
            <Bone className={styles['skeleton-tag']} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className={styles['skeleton-reviews-grid']}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles['skeleton-review-card']}>
          <div className={styles['skeleton-review-header']}>
            <Bone className={styles['skeleton-review-author']} />
            <Bone className={styles['skeleton-review-date']} />
          </div>
          <Bone className={styles['skeleton-review-stars']} />
          <Bone className={styles['skeleton-review-text']} />
        </div>
      ))}
    </div>
  );
}
