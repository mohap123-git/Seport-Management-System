import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDock, getDockById, updateDock } from '../api/api';

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '14px',
  width: '100%',
  marginBottom: '4px',
  boxSizing: 'border-box',
};
const btnStyle = {
  padding: '8px 18px',
  background: '#1a3c5e',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
};
const errStyle = { color: 'red', fontSize: '13px', margin: '2px 0 8px' };
const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', color: '#333', marginTop: '10px' };
const formWrap = { maxWidth: '550px', margin: '0 auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', background: '#fafafa' };

function DockForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    dockID: '',
    dockNumber: '',
    location: '',
    maxCapacity: '',
    dockType: '',
    status: 'Available',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;

    getDockById(id)
      .then((res) =>
        setForm({
          ...res.data,
          dockID: res.data.dockID ?? '',
          maxCapacity: res.data.maxCapacity ?? '',
        }),
      )
      .catch((error) => {
        console.error(error);
        alert('Failed to load dock details. Is the API running?');
      });
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    const dockID = Number(form.dockID);

    if (!dockID || dockID <= 0) e.dockID = 'Valid dock ID is required.';
    if (!form.dockNumber) e.dockNumber = 'Dock number is required.';
    if (!form.location) e.location = 'Location is required.';
    if (!form.maxCapacity || isNaN(form.maxCapacity)) e.maxCapacity = 'Valid max capacity is required.';
    if (!form.dockType) e.dockType = 'Dock type is required.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      dockID: Number(form.dockID),
      maxCapacity: Number(form.maxCapacity),
    };

    try {
      if (isEdit) {
        await updateDock(id, payload);
      } else {
        await addDock(payload);
      }
      navigate('/docks');
    } catch (error) {
      console.error(error);
      alert('Error saving dock.');
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ color: '#1a3c5e' }}>{isEdit ? 'Edit Dock' : 'Add Dock'}</h2>

      <label style={labelStyle}>Dock ID</label>
      <input
        type="number"
        min="1"
        style={inputStyle}
        value={form.dockID}
        onChange={(e) => setForm({ ...form, dockID: e.target.value })}
        readOnly={isEdit}
      />
      {errors.dockID && <p style={errStyle}>{errors.dockID}</p>}

      <label style={labelStyle}>Dock Number</label>
      <input style={inputStyle} value={form.dockNumber} onChange={(e) => setForm({ ...form, dockNumber: e.target.value })} />
      {errors.dockNumber && <p style={errStyle}>{errors.dockNumber}</p>}

      <label style={labelStyle}>Location</label>
      <input style={inputStyle} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      {errors.location && <p style={errStyle}>{errors.location}</p>}

      <label style={labelStyle}>Max Capacity (Tons)</label>
      <input type="number" style={inputStyle} value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} />
      {errors.maxCapacity && <p style={errStyle}>{errors.maxCapacity}</p>}

      <label style={labelStyle}>Dock Type</label>
      <input style={inputStyle} value={form.dockType} onChange={(e) => setForm({ ...form, dockType: e.target.value })} />
      {errors.dockType && <p style={errStyle}>{errors.dockType}</p>}

      <label style={labelStyle}>Status</label>
      <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option>Available</option>
        <option>Occupied</option>
        <option>Maintenance</option>
      </select>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={handleSubmit} style={btnStyle}>
          {isEdit ? 'Update Dock' : 'Add Dock'}
        </button>
        <button onClick={() => navigate('/docks')} style={{ ...btnStyle, background: '#6c757d' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DockForm;
