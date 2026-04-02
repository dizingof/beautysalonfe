import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  onBookClick: () => void;
}

const navItems = [
  { label: 'Послуги', href: '/services', hash: '#services' },
  { label: 'Майстри', href: '/masters', hash: '#masters' },
  { label: 'Ціни', href: '/prices', hash: '#prices' },
  { label: 'Відгуки', href: '/reviews', hash: '#reviews' },
  { label: 'Контакти', href: '/#contacts', hash: '#contacts' },
];

export default function Header({ onBookClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavClick = (item: typeof navItems[0]) => {
    setMenuOpen(false);
    const isHome = location.pathname === '/';

    if (isHome) {
      // On home page — scroll to section
      const el = document.querySelector(item.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // On other pages — navigate to dedicated route
    if (item.href === '/#contacts') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector('#contacts');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      navigate(item.href);
      window.scrollTo({ top: 0 });
    }
  };

  const scrollToTop = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
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
                  handleNavClick(item);
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
              handleNavClick(item);
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
