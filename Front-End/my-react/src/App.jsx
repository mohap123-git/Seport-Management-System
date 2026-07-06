import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ShipsList from './pages/ShipsList';
import ShipForm from './pages/ShipForm';
import DocksList from './pages/DocksList';
import DockForm from './pages/DockForm';
import CargoList from './pages/CargoList';
import CargoForm from './pages/CargoForm';
import ArrivalsList from './pages/ArrivalsList';
import ArrivalForm from './pages/ArrivalForm';

import About from './pages/About';
import NotFound from './pages/NotFound';
import { readAuthState, setAuthState, subscribeAuthState } from './auth';

const styles = {
  nav: {
    background: '#1a3c5e',
    color: '#fff',
    padding: '12px 30px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '28px',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
    marginRight: '10px',
  },
  links: {
    display: 'flex',
    gap: '20px',
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  link: { color: '#fff', textDecoration: 'none', fontSize: '15px' },
  buttonLink: {
    color: '#fff',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.35)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  content: { padding: '30px' },
};

function RequireAuth({ isAuthenticated, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthState);
  const authActive = isAuthenticated || readAuthState();

  useEffect(() => subscribeAuthState(() => setIsAuthenticated(readAuthState())), []);

  const handleLogout = () => {
    setAuthState(false);
  };

  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>Seaport MS</Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/about" style={styles.link}>About</Link>
          {authActive ? (
            <>
              <Link to="/ships" style={styles.link}>Ships</Link>
              <Link to="/docks" style={styles.link}>Docks</Link>
              <Link to="/cargo" style={styles.link}>Cargo</Link>
              <Link to="/arrivals" style={styles.link}>Arrivals</Link>
              <Link to="/report" style={styles.link}>Report</Link>
              <button type="button" onClick={handleLogout} style={styles.buttonLink}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </div>
      </nav>
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home isAuthenticated={authActive} />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/ships"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ShipsList />
              </RequireAuth>
            }
          />
          <Route
            path="/ships/add"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ShipForm />
              </RequireAuth>
            }
          />
          <Route
            path="/ships/edit/:id"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ShipForm />
              </RequireAuth>
            }
          />
          <Route
            path="/docks"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <DocksList />
              </RequireAuth>
            }
          />
          <Route
            path="/docks/add"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <DockForm />
              </RequireAuth>
            }
          />
          <Route
            path="/docks/edit/:id"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <DockForm />
              </RequireAuth>
            }
          />
          <Route
            path="/cargo"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <CargoList />
              </RequireAuth>
            }
          />
          <Route
            path="/cargo/add"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <CargoForm />
              </RequireAuth>
            }
          />
          <Route
            path="/cargo/edit/:id"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <CargoForm />
              </RequireAuth>
            }
          />
          <Route
            path="/arrivals"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ArrivalsList />
              </RequireAuth>
            }
          />
          <Route
            path="/arrivals/add"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ArrivalForm />
              </RequireAuth>
            }
          />
          <Route
            path="/arrivals/edit/:id"
            element={
              <RequireAuth isAuthenticated={authActive}>
                <ArrivalForm />
              </RequireAuth>
            }
          />
    
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
