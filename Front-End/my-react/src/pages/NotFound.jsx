import { Link } from 'react-router-dom';
import { readAuthState } from '../auth';

const styles = {
  wrap: {
    minHeight: 'calc(100vh - 120px)',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #f4f8fb 0%, #e8f1f8 100%)',
  },
  card: {
    maxWidth: '640px',
    width: '100%',
    background: '#fff',
    border: '1px solid #d7e1ea',
    borderRadius: '18px',
    boxShadow: '0 18px 50px rgba(26, 60, 94, 0.12)',
    padding: '36px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '999px',
    background: '#e9f3fb',
    color: '#1a3c5e',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '18px',
  },
  code: {
    margin: '0',
    fontSize: '72px',
    lineHeight: 1,
    color: '#1a3c5e',
    fontWeight: 800,
  },
  title: {
    margin: '14px 0 10px',
    fontSize: '28px',
    color: '#10263b',
  },
  text: {
    margin: '0 auto 24px',
    maxWidth: '520px',
    color: '#5a6b7d',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  primary: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    background: '#1a3c5e',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
  },
  secondary: {
    display: 'inline-block',
    padding: '12px 18px',
    borderRadius: '10px',
    background: '#eef4f8',
    color: '#1a3c5e',
    textDecoration: 'none',
    fontWeight: 600,
    border: '1px solid #d7e1ea',
  },
};

function NotFound() {
  const isAuthenticated = readAuthState();

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.badge}>Page not found</div>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>This route does not exist.</h2>
        <p style={styles.text}>
          The page you tried to open was moved, deleted, or the address was typed
          incorrectly. Use the button below to return to the main dashboard.
        </p>
        <div style={styles.actions}>
          <Link to="/" style={styles.primary}>Go Home</Link>
          <Link to={isAuthenticated ? '/ships' : '/login'} style={styles.secondary}>
            {isAuthenticated ? 'View Ships' : 'Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
