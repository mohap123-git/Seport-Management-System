import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { readAuthState, setAuthState } from '../auth';

const inputStyle = { padding:'8px 12px', borderRadius:'6px', border:'1px solid #ccc', fontSize:'14px', width:'100%', marginBottom:'4px', boxSizing:'border-box' };
const btnStyle = { padding:'8px 18px', background:'#1a3c5e', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'14px', width:'100%', marginTop:'8px' };
const errStyle = { color:'red', fontSize:'13px', margin:'2px 0 8px' };
const labelStyle = { display:'block', marginBottom:'4px', fontWeight:'bold', color:'#333' };
const formWrap = { maxWidth:'400px', margin:'60px auto', padding:'30px', border:'1px solid #ddd', borderRadius:'10px', background:'#fafafa' };

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const isAuthenticated = readAuthState();

  const handleSubmit = () => {
    if (!form.username || !form.password) {
      setError('All fields are required.');
      return;
    }

    if (form.username === 'admin' && form.password === 'admin123') {
      setAuthState(true);
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div style={formWrap}>
      <h2 style={{ color:'#1a3c5e', textAlign:'center' }}>Login</h2>
      {error && <p style={errStyle}>{error}</p>}
      <label style={labelStyle}>Username</label>
      <input
        placeholder="Enter username"
        style={inputStyle}
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <label style={labelStyle}>Password</label>
      <input
        placeholder="Enter password"
        type="password"
        style={inputStyle}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit} style={btnStyle}>Login</button>
    </div>
  );
}

export default Login;
