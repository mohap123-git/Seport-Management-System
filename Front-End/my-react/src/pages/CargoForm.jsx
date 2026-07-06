import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addCargo, getCargoById, updateCargo } from '../api/api';

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

function CargoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    cargoID: '',
    cargoType: '',
    weight: '',
    description: '',
    ownerName: '',
    ownerEmail: '',
    isHazardous: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;

    getCargoById(id)
      .then((res) =>
        setForm({
          ...res.data,
          cargoID: res.data.cargoID ?? '',
          weight: res.data.weight ?? '',
          description: res.data.description ?? '',
          ownerEmail: res.data.ownerEmail ?? '',
          isHazardous: !!res.data.isHazardous,
        }),
      )
      .catch((error) => {
        console.error(error);
        alert('Failed to load cargo details. Is the API running?');
      });
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    const cargoID = Number(form.cargoID);

    if (!cargoID || cargoID <= 0) e.cargoID = 'Valid cargo ID is required.';
    if (!form.cargoType) e.cargoType = 'Cargo type is required.';
    if (!form.weight || isNaN(form.weight)) e.weight = 'Valid weight is required.';
    if (!form.ownerName) e.ownerName = 'Owner name is required.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      cargoID: Number(form.cargoID),
      weight: Number(form.weight),
      description: form.description?.trim() ? form.description.trim() : null,
      ownerEmail: form.ownerEmail?.trim() ? form.ownerEmail.trim() : null,
      isHazardous: Boolean(form.isHazardous),
    };

    try {
      if (isEdit) {
        await updateCargo(id, payload);
      } else {
        await addCargo(payload);
      }
      navigate('/cargo');
    } catch (error) {
      console.error(error);
      alert('Error saving cargo.');
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ color: '#1a3c5e' }}>{isEdit ? 'Edit Cargo' : 'Add Cargo'}</h2>

      <label style={labelStyle}>Cargo ID</label>
      <input
        type="number"
        min="1"
        style={inputStyle}
        value={form.cargoID}
        onChange={(e) => setForm({ ...form, cargoID: e.target.value })}
        readOnly={isEdit}
      />
      {errors.cargoID && <p style={errStyle}>{errors.cargoID}</p>}

      <label style={labelStyle}>Cargo Type</label>
      <input style={inputStyle} value={form.cargoType} onChange={(e) => setForm({ ...form, cargoType: e.target.value })} />
      {errors.cargoType && <p style={errStyle}>{errors.cargoType}</p>}

      <label style={labelStyle}>Weight (Tons)</label>
      <input type="number" style={inputStyle} value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
      {errors.weight && <p style={errStyle}>{errors.weight}</p>}

      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, height: '80px' }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <label style={labelStyle}>Owner Name</label>
      <input style={inputStyle} value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
      {errors.ownerName && <p style={errStyle}>{errors.ownerName}</p>}

      <label style={labelStyle}>Owner Email</label>
      <input style={inputStyle} value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} />

      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" checked={form.isHazardous} onChange={(e) => setForm({ ...form, isHazardous: e.target.checked })} />
        Hazardous Cargo
      </label>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={handleSubmit} style={btnStyle}>
          {isEdit ? 'Update Cargo' : 'Add Cargo'}
        </button>
        <button onClick={() => navigate('/cargo')} style={{ ...btnStyle, background: '#6c757d' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CargoForm;
