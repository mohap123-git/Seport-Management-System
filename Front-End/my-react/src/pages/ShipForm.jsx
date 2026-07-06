import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addShip, getShipById, updateShip } from '../api/api';

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

function ShipForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    shipID: '',
    shipName: '',
    shipType: '',
    capacity: '',
    flagCountry: '',
    ownerName: '',
    contactNumber: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;

    getShipById(id)
      .then((res) => setForm({ ...res.data, shipID: res.data.shipID ?? '' }))
      .catch((error) => {
        console.error(error);
        alert('Failed to load ship details. Is the API running?');
      });
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    const shipID = Number(form.shipID);

    if (!shipID || shipID <= 0) e.shipID = 'Valid ship ID is required.';
    if (!form.shipName) e.shipName = 'Ship name is required.';
    if (!form.shipType) e.shipType = 'Ship type is required.';
    if (!form.capacity || isNaN(form.capacity)) e.capacity = 'Valid capacity is required.';
    if (!form.flagCountry) e.flagCountry = 'Flag country is required.';
    if (!form.ownerName) e.ownerName = 'Owner name is required.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      shipID: Number(form.shipID),
      capacity: Number(form.capacity),
      contactNumber: form.contactNumber?.trim() ? form.contactNumber.trim() : null,
    };

    try {
      if (isEdit) {
        await updateShip(id, payload);
      } else {
        await addShip(payload);
      }
      navigate('/ships');
    } catch (error) {
      console.error(error);
      alert('Error saving ship.');
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ color: '#1a3c5e' }}>{isEdit ? 'Edit Ship' : 'Add Ship'}</h2>

      <label style={labelStyle}>Ship ID</label>
      <input
        type="number"
        min="1"
        style={inputStyle}
        value={form.shipID}
        onChange={(e) => setForm({ ...form, shipID: e.target.value })}
        readOnly={isEdit}
      />
      {errors.shipID && <p style={errStyle}>{errors.shipID}</p>}

      <label style={labelStyle}>Ship Name</label>
      <input style={inputStyle} value={form.shipName} onChange={(e) => setForm({ ...form, shipName: e.target.value })} />
      {errors.shipName && <p style={errStyle}>{errors.shipName}</p>}

      <label style={labelStyle}>Ship Type</label>
      <input style={inputStyle} value={form.shipType} onChange={(e) => setForm({ ...form, shipType: e.target.value })} />
      {errors.shipType && <p style={errStyle}>{errors.shipType}</p>}

      <label style={labelStyle}>Capacity (Tons)</label>
      <input type="number" style={inputStyle} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
      {errors.capacity && <p style={errStyle}>{errors.capacity}</p>}

      <label style={labelStyle}>Flag Country</label>
      <input style={inputStyle} value={form.flagCountry} onChange={(e) => setForm({ ...form, flagCountry: e.target.value })} />
      {errors.flagCountry && <p style={errStyle}>{errors.flagCountry}</p>}

      <label style={labelStyle}>Owner Name</label>
      <input style={inputStyle} value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
      {errors.ownerName && <p style={errStyle}>{errors.ownerName}</p>}

      <label style={labelStyle}>Contact Number</label>
      <input style={inputStyle} value={form.contactNumber || ''} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />

      <label style={labelStyle}>Status</label>
      <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={handleSubmit} style={btnStyle}>
          {isEdit ? 'Update Ship' : 'Add Ship'}
        </button>
        <button onClick={() => navigate('/ships')} style={{ ...btnStyle, background: '#6c757d' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ShipForm;
