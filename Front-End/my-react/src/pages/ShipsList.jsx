import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllShips, searchShips, deleteShip } from '../api/api';

const btnStyle   = { padding:'7px 14px', background:'#1a3c5e', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' };
const inputStyle = { padding:'8px 12px', borderRadius:'6px', border:'1px solid #ccc', fontSize:'14px' };
const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:'14px' };
const th         = { padding:'10px 14px', textAlign:'left' };
const td         = { padding:'10px 14px' };
const actionRow  = { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' };

const loadShips = async (setShips) => {
  try {
    const res = await getAllShips();
    setShips(res.data);
  } catch (error) {
    console.error(error);
    alert('Failed to load ships. Is the API running?');
  }
};

function ShipsList() {
  const [ships,  setShips]  = useState([]);
  const [search, setSearch] = useState('');
  const navigate            = useNavigate();

  useEffect(() => {
    void loadShips(setShips);
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      await loadShips(setShips);
      return;
    }

    try {
      const res = await searchShips(search);
      setShips(res.data);
    } catch (error) {
      console.error(error);
      alert('Failed to search ships. Is the API running?');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this ship?')) {
      try {
        await deleteShip(id);
        await loadShips(setShips);
      } catch (error) {
        console.error(error);
        alert('Failed to delete ship.');
      }
    }
  };

  return (
    <div>
      <h2 style={{ color:'#1a3c5e' }}>🚢 Ships List</h2>
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
        <input placeholder="Search by ship name..." style={inputStyle}
          value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={handleSearch} style={btnStyle}>Search</button>
        <button onClick={() => navigate('/ships/add')} style={{ ...btnStyle, background:'#28a745' }}>+ Add Ship</button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background:'#1a3c5e', color:'#fff' }}>
            <th style={th}>ID</th><th style={th}>Ship Name</th><th style={th}>Type</th>
            <th style={th}>Capacity</th><th style={th}>Flag Country</th>
            <th style={th}>Owner</th><th style={th}>Status</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ships.map(s => (
            <tr key={s.shipID} style={{ borderBottom:'1px solid #ddd' }}>
              <td style={td}>{s.shipID}</td>
              <td style={td}>{s.shipName}</td>
              <td style={td}>{s.shipType}</td>
              <td style={td}>{s.capacity} T</td>
              <td style={td}>{s.flagCountry}</td>
              <td style={td}>{s.ownerName}</td>
              <td style={td}><span style={{ color: s.status==='Active' ? 'green':'red' }}>{s.status}</span></td>
              <td style={td}>
                <div style={actionRow}>
                  <button onClick={() => navigate(`/ships/edit/${s.shipID}`)}
                    style={{ ...btnStyle, background:'#ffc107', color:'#000' }}>Edit</button>
                  <button onClick={() => handleDelete(s.shipID)}
                    style={{ ...btnStyle, background:'#dc3545' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {ships.length === 0 && <tr><td colSpan="8" style={{ textAlign:'center', padding:'20px', color:'#888' }}>No ships found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default ShipsList;
