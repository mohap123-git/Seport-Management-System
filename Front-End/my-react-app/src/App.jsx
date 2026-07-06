import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
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
import Sidebar from './components/Sidebar';
import { readAuthState, setAuthState, subscribeAuthState } from './auth';
import './layout.css';

const styles = {
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
      <div className="app-shell">
        <Sidebar isAuthenticated={authActive} onLogout={handleLogout} />
        <div className="app-content">
          <div style={styles.content}>
            <Routes>
          <Route path="/" element={<Dashboard isAuthenticated={authActive} />} />
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
        </div>
      </div>
    </Router>
  );
}

export default App;
