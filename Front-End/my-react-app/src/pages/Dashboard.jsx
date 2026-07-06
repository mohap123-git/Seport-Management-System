import { Link } from 'react-router-dom';

const cardStyle = {
  display: 'block',
  padding: '30px 40px',
  border: '2px solid #1a3c5e',
  borderRadius: '12px',
  textDecoration: 'none',
  background: '#f0f6ff',
  textAlign: 'center',
  minWidth: '150px',
  cursor: 'pointer',
};

const ctaWrap = {
  maxWidth: '720px',
  margin: '72px auto 0',
  padding: '36px',
  borderRadius: '18px',
  background: 'linear-gradient(180deg, #f7fbff 0%, #edf5fb 100%)',
  border: '1px solid #d7e1ea',
  boxShadow: '0 18px 50px rgba(26, 60, 94, 0.08)',
  textAlign: 'center',
};

const ctaButton = {
  display: 'inline-block',
  marginTop: '18px',
  padding: '12px 18px',
  borderRadius: '10px',
  background: '#1a3c5e',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 600,
};

function Dashboard({ isAuthenticated }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <h1 style={{ color: '#1a3c5e', fontSize: '42px' }}>{'\u{1F6A2}'} Seaport Management System</h1>
      <p style={{ fontSize: '18px', color: '#555', marginTop: '16px' }}>
        {isAuthenticated
          ? 'Manage ships, docks, cargo and arrivals efficiently.'
          : 'Sign in to view the ships, docks, cargo, arrivals, and reports data.'}
      </p>
      {isAuthenticated ? (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '50px', flexWrap: 'wrap' }}>
          {[
            { label: 'Ships', emoji: '\u{1F6A2}', path: '/ships' },
            { label: 'Docks', emoji: '\u26F5', path: '/docks' },
            { label: 'Cargo', emoji: '\u{1F4E6}', path: '/cargo' },
            { label: 'Arrivals', emoji: '\u2693', path: '/arrivals' },
          
          ].map((card) => (
            <Link key={card.label} to={card.path} style={cardStyle}>
              <div style={{ fontSize: '40px' }}>{card.emoji}</div>
              <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#1a3c5e' }}>{card.label}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={ctaWrap}>
          <h2 style={{ color: '#1a3c5e', marginTop: 0 }}>Private dashboard access</h2>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 0 }}>
            The operational tables are hidden until you sign in. Use the login page to unlock the
            ship, dock, cargo, arrival, and report screens.
          </p>
          <Link to="/login" style={ctaButton}>Go to Login</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
