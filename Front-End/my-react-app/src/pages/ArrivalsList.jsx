import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllArrivals, searchArrivals, deleteArrival } from '../api/api';

const btnStyle   = { padding:'7px 14px', background:'#1a3c5e', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' };
const inputStyle = { padding:'8px 12px', borderRadius:'6px', border:'1px solid #ccc', fontSize:'14px' };
const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:'14px' };
const th         = { padding:'10px 14px', textAlign:'left' };
const td         = { padding:'10px 14px' };
const actionRow  = { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' };

const loadArrivals = async (setArrivals) => {
  try {
    const res = await getAllArrivals();
    setArrivals(res.data);
  } catch (error) {
    console.error(error);
    alert('Failed to load arrivals. Is the API running?');
  }
};

function ArrivalsList() {
  const [arrivals, setArrivals] = useState([]);
  const [ship,     setShip]     = useState('');
  const [status,   setStatus]   = useState('');
  const navigate                = useNavigate();

  useEffect(() => {
    void loadArrivals(setArrivals);
  }, []);

  const handleSearch = async () => {
    if (!ship.trim() && !status) {
      await loadArrivals(setArrivals);
      return;
    }

    try {
      const res = await searchArrivals(ship, status);
      setArrivals(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to search arrivals. Is the API running?');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('are sure to Delete this arrival?')) {
      try {
        await deleteArrival(id);
        await loadArrivals(setArrivals);
      } catch (error) {
        console.error(error);
        alert('Failed to delete arrival.');
      }
    }
  };

  const statusColor = (s) => s==='Arrived' ? 'green' : s==='Departed' ? 'gray' : 'orange';

  return (
    <div>
      <h2 style={{ color:'#1a3c5e' }}>⚓ Arrivals List</h2>
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
        <input placeholder="Search by ship name..." style={inputStyle}
          value={ship} onChange={e => setShip(e.target.value)} />
        <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Pending</option><option>Arrived</option><option>Departed</option>
        </select>
        <button onClick={handleSearch} style={btnStyle}>Search</button>
        <button onClick={() => navigate('/arrivals/add')} style={{ ...btnStyle, background:'#28a745' }}>+ Add Arrival</button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background:'#1a3c5e', color:'#fff' }}>
            <th style={th}>ID</th><th style={th}>Ship</th><th style={th}>Dock</th>
            <th style={th}>Cargo</th><th style={th}>Arrival Date</th>
            <th style={th}>Departure Date</th><th style={th}>Status</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.map(a => (
            <tr key={a.arrivalID} style={{ borderBottom:'1px solid #ddd' }}>
              <td style={td}>{a.arrivalID}</td>
              <td style={td}>{a.shipName}</td>
              <td style={td}>{a.dockNumber}</td>
              <td style={td}>{a.cargoType}</td>
              <td style={td}>{new Date(a.arrivalDate).toLocaleDateString()}</td>
              <td style={td}>{a.departureDate ? new Date(a.departureDate).toLocaleDateString() : '—'}</td>
              <td style={td}><span style={{ color: statusColor(a.status) }}>{a.status}</span></td>
              <td style={td}>
                <div style={actionRow}>
                  <button onClick={() => navigate(`/arrivals/edit/${a.arrivalID}`)}
                    style={{ ...btnStyle, background:'#ffc107', color:'#000' }}>Edit</button>
                  <button onClick={() => handleDelete(a.arrivalID)}
                    style={{ ...btnStyle, background:'#dc3545' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {arrivals.length === 0 && <tr><td colSpan="8" style={{ textAlign:'center', padding:'20px', color:'#888' }}>No arrivals found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default ArrivalsList;
