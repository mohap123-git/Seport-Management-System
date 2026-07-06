import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDocks, deleteDock } from '../api/api';

const btnStyle = { padding:'7px 14px', background:'#1a3c5e', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' };
const addBtnStyle = { ...btnStyle, background:'#0b6e4f' };
const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:'14px' };
const th = { padding:'10px 14px', textAlign:'left' };
const td = { padding:'10px 14px' };
const actionRow = { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' };
const headerRow = { display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap' };

const loadDocks = async (setDocks) => {
  try {
    const res = await getAllDocks();
    setDocks(res.data);
  } catch (error) {
    console.error(error);
    alert('Failed to load docks. Is the API running?');
  }
};

function DocksList() {
  const [docks, setDocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    void loadDocks(setDocks);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dock?')) return;

    try {
      await deleteDock(id);
      await loadDocks(setDocks);
    } catch (error) {
      console.error(error);
      alert('Failed to delete dock.');
    }
  };

  return (
    <div>
      <div style={headerRow}>
        <div>
          <h2 style={{ color:'#1a3c5e', marginBottom:'4px' }}>Dock List</h2>
          <p style={{ color:'#555', marginBottom:'16px' }}>Browse the docks available in the system.</p>
        </div>
        <button onClick={() => navigate('/docks/add')} style={addBtnStyle}>+ Add Dock</button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background:'#1a3c5e', color:'#fff' }}>
            <th style={th}>ID</th>
            <th style={th}>Dock Number</th>
            <th style={th}>Location</th>
            <th style={th}>Max Capacity</th>
            <th style={th}>Dock Type</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {docks.map((dock) => (
            <tr key={dock.dockID} style={{ borderBottom:'1px solid #ddd' }}>
              <td style={td}>{dock.dockID}</td>
              <td style={td}>{dock.dockNumber}</td>
              <td style={td}>{dock.location}</td>
              <td style={td}>{dock.maxCapacity} T</td>
              <td style={td}>{dock.dockType}</td>
              <td style={td}>{dock.status}</td>
              <td style={td}>
                <div style={actionRow}>
                  <button onClick={() => navigate(`/docks/edit/${dock.dockID}`)} style={btnStyle}>Edit</button>
                  <button onClick={() => handleDelete(dock.dockID)} style={{ ...btnStyle, background:'#dc3545' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {docks.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign:'center', padding:'20px', color:'#888' }}>No docks found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DocksList;
