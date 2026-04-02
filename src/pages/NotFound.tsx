import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body, Montserrat, sans-serif)', color: 'var(--color-text, #333)' }}>
      <Helmet>
        <title>Сторінку не знайдено — Beauty Room</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 style={{ fontSize: '4rem', margin: 0, color: 'var(--color-accent, #c59d5f)' }}>404</h1>
      <p style={{ fontSize: '1.25rem', margin: '1rem 0 2rem' }}>Сторінку не знайдено</p>
      <Link to="/" style={{ color: 'var(--color-accent, #c59d5f)', textDecoration: 'underline', fontSize: '1rem' }}>
        На головну
      </Link>
    </div>
  );
}
