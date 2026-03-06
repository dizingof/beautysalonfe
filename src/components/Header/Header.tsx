import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onBookClick: () => void;
}

const navItems = [
  { label: 'Послуги', href: '#services' },
  { label: 'Майстри', href: '#masters' },
  { label: 'Ціни', href: '#prices' },
  { label: 'Відгуки', href: '#reviews' },
  { label: 'Контакти', href: '#contacts' },
];

export default function Header({ onBookClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles['header-inner']}>
          <div className={styles.logo} onClick={scrollToTop}>
            <span className={styles['logo-main']}>Beauty Room</span>
            <span className={styles['logo-sub']}>salon</span>
          </div>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <a
                key={item.href}
                className={styles['nav-link']}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            className={`btn btn-primary ${styles['header-cta']}`}
            onClick={onBookClick}
          >
            Записатися
          </button>

          <button
            className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`${styles['mobile-menu-overlay']} ${menuOpen ? styles.open : ''}`}>
        <div className={styles['mobile-menu-logo']}>Beauty Room</div>
        {navItems.map((item) => (
          <a
            key={item.href}
            className={styles['mobile-nav-link']}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(item.href);
            }}
            href={item.href}
          >
            {item.label}
          </a>
        ))}
        <button
          className={`btn btn-primary btn-lg ${styles['mobile-menu-cta']}`}
          onClick={() => {
            setMenuOpen(false);
            onBookClick();
          }}
        >
          Записатися
        </button>
      </div>
    </>
  );
}
