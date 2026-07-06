import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// -- Design tokens (Seaport MS "harbor console") ----------------------------
// Deep navy hull + brass beacon accent, evoking a dock control panel.
const colors = {
  hull: '#0B2540',      // sidebar background
  hullDeep: '#081A2E',  // hover / active well
  hairline: 'rgba(255,255,255,0.08)',
  ink: '#1a3c5e',       // kept from existing brand primary
  fog: '#F4F7FA',       // main content background
  mist: '#B9C7D6',      // secondary text on navy
  paper: '#EAF1F8',     // faint label text on navy
  beacon: '#E8A33D',    // signature accent (brass beacon light)
  live: '#5FBF8F',      // session-live indicator
};

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', emoji: '\u{1F3E0}', end: true },
    ],
  },
  {
    label: 'Operations',
    authOnly: true,
    items: [
      { label: 'Ships', path: '/ships', emoji: '\u{1F6A2}' },
      { label: 'Docks', path: '/docks', emoji: '\u26F5' },
      { label: 'Cargo', path: '/cargo', emoji: '\u{1F4E6}' },
      { label: 'Arrivals', path: '/arrivals', emoji: '\u2693' },
    ],
  },

  {
    label: 'Info',
    items: [
      { label: 'About', path: '/about', emoji: '\u2139\uFE0F' },
    ],
  },
];

function isActivePath(pathname, item) {
  if (item.end) return pathname === item.path;
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

function Sidebar({ isAuthenticated, onLogout }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar (hidden on desktop via layout.css) */}
      <div className="mobile-bar" style={styles.mobileBar}>
        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setMobileOpen((open) => !open)}
          style={styles.hamburger}
        >
          <span style={styles.hamburgerBar} />
          <span style={styles.hamburgerBar} />
          <span style={styles.hamburgerBar} />
        </button>
        <Link to="/" style={styles.mobileLogo} onClick={closeMobile}>
          {'\u{1F6A2}'} Seaport MS
        </Link>
      </div>

      {mobileOpen && (
        <div
          role="presentation"
          onClick={closeMobile}
          style={styles.scrim}
        />
      )}

      <aside style={{ ...styles.sidebar, ...(mobileOpen ? styles.sidebarOpen : null) }}>
        <div style={styles.brandRow}>
          <span style={styles.brandMark}>{'\u{1F6A2}'}</span>
          <div>
            <div style={styles.brandName}>Seaport MS</div>
            <div style={styles.brandSub}>Harbor control</div>
          </div>
        </div>

        <nav style={styles.nav}>
          {NAV_GROUPS.filter((group) => !group.authOnly || isAuthenticated).map((group) => (
            <div key={group.label} style={styles.group}>
              <div style={styles.groupLabel}>{group.label}</div>
              {group.items.map((item) => {
                const active = isActivePath(location.pathname, item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobile}
                    style={{
                      ...styles.navItem,
                      ...(active ? styles.navItemActive : null),
                    }}
                  >
                    <span
                      style={{
                        ...styles.navRail,
                        background: active ? colors.beacon : 'transparent',
                      }}
                    />
                    <span style={styles.navEmoji}>{item.emoji}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={styles.footer}>
          {isAuthenticated ? (
            <>
              <div style={styles.statusRow}>
                <span style={styles.statusDot} />
                <span style={styles.statusText}>Session active</span>
              </div>
              <button type="button" onClick={onLogout} style={styles.logoutButton}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={closeMobile} style={styles.loginButton}>
              Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

const SIDEBAR_WIDTH = 240;

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: `${SIDEBAR_WIDTH}px`,
    background: colors.hull,
    color: colors.paper,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    borderRight: `1px solid ${colors.hairline}`,
    fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '22px 20px 18px',
    borderBottom: `1px solid ${colors.hairline}`,
  },
  brandMark: {
    fontSize: '26px',
    lineHeight: 1,
  },
  brandName: {
    fontWeight: 700,
    fontSize: '16px',
    letterSpacing: '0.02em',
    color: '#fff',
  },
  brandSub: {
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: colors.mist,
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '18px 12px',
  },
  group: {
    marginBottom: '20px',
  },
  groupLabel: {
    fontSize: '11px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: colors.mist,
    padding: '0 12px 8px',
  },
  navItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px 10px 16px',
    borderRadius: '8px',
    color: colors.paper,
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '2px',
  },
  navItemActive: {
    background: colors.hullDeep,
    color: '#fff',
    fontWeight: 600,
  },
  navRail: {
    position: 'absolute',
    left: 0,
    top: '6px',
    bottom: '6px',
    width: '3px',
    borderRadius: '3px',
  },
  navEmoji: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  footer: {
    padding: '16px 20px 20px',
    borderTop: `1px solid ${colors.hairline}`,
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: colors.live,
    boxShadow: `0 0 0 3px rgba(95, 191, 143, 0.18)`,
  },
  statusText: {
    fontSize: '12px',
    color: colors.mist,
  },
  logoutButton: {
    width: '100%',
    padding: '9px 12px',
    background: 'transparent',
    color: '#fff',
    border: `1px solid rgba(255,255,255,0.28)`,
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  loginButton: {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    padding: '9px 12px',
    background: colors.beacon,
    color: colors.hullDeep,
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 700,
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  mobileBar: {
    display: 'none',
  },
  hamburger: {
    background: 'transparent',
    border: 'none',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  hamburgerBar: {
    width: '20px',
    height: '2px',
    background: '#fff',
    display: 'block',
  },
  mobileLogo: {
    color: '#fff',
    fontWeight: 700,
    textDecoration: 'none',
    fontSize: '16px',
  },
  scrim: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(8, 26, 46, 0.5)',
    zIndex: 39,
  },
};

export { SIDEBAR_WIDTH };
export default Sidebar;
