import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCargo, deleteCargo } from '../api/api';

const btnStyle = { padding:'7px 14px', background:'#1a3c5e', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' };
const addBtnStyle = { ...btnStyle, background:'#0b6e4f' };
const tableStyle = { width:'100%', borderCollapse:'collapse', fontSize:'14px' };
const th = { padding:'10px 14px', textAlign:'left' };
const td = { padding:'10px 14px' };
const actionRow = { display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap' };
const headerRow = { display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap' };

const loadCargo = async (setCargo) => {
  try {
    const res = await getAllCargo();
    setCargo(res.data);
  } catch (error) {
    console.error(error);
    alert('Failed to load cargo. Is the API running?');
  }
};

function CargoList() {
  const [cargo, setCargo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    void loadCargo(setCargo);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cargo record?')) return;

    try {
      await deleteCargo(id);
      await loadCargo(setCargo);
    } catch (error) {
      console.error(error);
      alert('Failed to delete cargo.');
    }
  };

  return (
    <div>
      <div style={headerRow}>
        <div>
          <h2 style={{ color:'#1a3c5e', marginBottom:'4px' }}>Cargo List</h2>
          <p style={{ color:'#555', marginBottom:'16px' }}>Browse the cargo records available in the system.</p>
        </div>
        <button onClick={() => navigate('/cargo/add')} style={addBtnStyle}>+ Add Cargo</button>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background:'#1a3c5e', color:'#fff' }}>
            <th style={th}>ID</th>
            <th style={th}>Cargo Type</th>
            <th style={th}>Weight</th>
            <th style={th}>Description</th>
            <th style={th}>Owner</th>
            <th style={th}>Email</th>
            <th style={th}>Hazardous</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cargo.map((item) => (
            <tr key={item.cargoID} style={{ borderBottom:'1px solid #ddd' }}>
              <td style={td}>{item.cargoID}</td>
              <td style={td}>{item.cargoType}</td>
              <td style={td}>{item.weight} T</td>
              <td style={td}>{item.description || '-'}</td>
              <td style={td}>{item.ownerName}</td>
              <td style={td}>{item.ownerEmail || '-'}</td>
              <td style={td}>{item.isHazardous ? 'Yes' : 'No'}</td>
              <td style={td}>
                <div style={actionRow}>
                  <button onClick={() => navigate(`/cargo/edit/${item.cargoID}`)} style={btnStyle}>Edit</button>
                  <button onClick={() => handleDelete(item.cargoID)} style={{ ...btnStyle, background:'#dc3545' }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {cargo.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign:'center', padding:'20px', color:'#888' }}>No cargo found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CargoList;
