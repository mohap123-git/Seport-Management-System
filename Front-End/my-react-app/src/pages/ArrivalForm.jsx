import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addArrival, getArrivalById, updateArrival, getAllShips, getAllDocks, getAllCargo } from '../api/api';

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

const toDateTimeLocalValue = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

function ArrivalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    arrivalID: '',
    shipID: '',
    dockID: '',
    cargoID: '',
    arrivalDate: '',
    departureDate: '',
    status: 'Pending',
    notes: '',
  });
  const [ships, setShips] = useState([]);
  const [docks, setDocks] = useState([]);
  const [cargo, setCargo] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [shipsRes, docksRes, cargoRes] = await Promise.all([getAllShips(), getAllDocks(), getAllCargo()]);

        setShips(shipsRes.data);
        setDocks(docksRes.data);
        setCargo(cargoRes.data);

        if (isEdit) {
          const arrivalRes = await getArrivalById(id);
          setForm({
            ...arrivalRes.data,
            arrivalID: arrivalRes.data.arrivalID ?? '',
            arrivalDate: toDateTimeLocalValue(arrivalRes.data.arrivalDate),
            departureDate: toDateTimeLocalValue(arrivalRes.data.departureDate),
            notes: arrivalRes.data.notes ?? '',
            status: arrivalRes.data.status ?? 'Pending',
          });
        }
      } catch (error) {
        console.error(error);
        alert('Failed to load arrival form data. Is the API running?');
      }
    };

    void loadFormData();
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    const arrivalID = Number(form.arrivalID);
    const shipID = Number(form.shipID);
    const dockID = Number(form.dockID);
    const cargoID = Number(form.cargoID);

    if (!arrivalID || arrivalID <= 0) e.arrivalID = 'Valid arrival ID is required.';
    if (!shipID || shipID <= 0) e.shipID = 'Please select a ship.';
    if (!dockID || dockID <= 0) e.dockID = 'Please select a dock.';
    if (!cargoID || cargoID <= 0) e.cargoID = 'Please select cargo.';
    if (!form.arrivalDate) e.arrivalDate = 'Arrival date is required.';
    if (form.departureDate && form.departureDate < form.arrivalDate) {
      e.departureDate = 'Departure must be after arrival date.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      arrivalID: Number(form.arrivalID),
      shipID: Number(form.shipID),
      dockID: Number(form.dockID),
      cargoID: Number(form.cargoID),
      departureDate: form.departureDate ? form.departureDate : null,
      notes: form.notes?.trim() ? form.notes.trim() : null,
    };

    try {
      if (isEdit) {
        await updateArrival(id, payload);
      } else {
        await addArrival(payload);
      }
      navigate('/arrivals');
    } catch (error) {
      console.error(error);
      alert('Error saving arrival.');
    }
  };

  return (
    <div style={formWrap}>
      <h2 style={{ color: '#1a3c5e' }}>{isEdit ? 'Edit Arrival' : 'Add Arrival'}</h2>

      <label style={labelStyle}>Arrival ID</label>
      <input
        type="number"
        min="1"
        style={inputStyle}
        value={form.arrivalID}
        onChange={(e) => setForm({ ...form, arrivalID: e.target.value })}
        readOnly={isEdit}
      />
      {errors.arrivalID && <p style={errStyle}>{errors.arrivalID}</p>}

      <label style={labelStyle}>Ship ID</label>
      <select style={inputStyle} value={form.shipID} onChange={(e) => setForm({ ...form, shipID: e.target.value })}>
        <option value="">-- Select Ship --</option>
        {ships.map((s) => (
          <option key={s.shipID} value={s.shipID}>
            {s.shipID} - {s.shipName}
          </option>
        ))}
      </select>
      {errors.shipID && <p style={errStyle}>{errors.shipID}</p>}

      <label style={labelStyle}>Dock ID</label>
      <select style={inputStyle} value={form.dockID} onChange={(e) => setForm({ ...form, dockID: e.target.value })}>
        <option value="">-- Select Dock --</option>
        {docks.map((d) => (
          <option key={d.dockID} value={d.dockID}>
            {d.dockID} - {d.dockNumber} - {d.location}
          </option>
        ))}
      </select>
      {errors.dockID && <p style={errStyle}>{errors.dockID}</p>}

      <label style={labelStyle}>Cargo ID</label>
      <select style={inputStyle} value={form.cargoID} onChange={(e) => setForm({ ...form, cargoID: e.target.value })}>
        <option value="">-- Select Cargo --</option>
        {cargo.map((c) => (
          <option key={c.cargoID} value={c.cargoID}>
            {c.cargoID} - {c.cargoType} - {c.ownerName}
          </option>
        ))}
      </select>
      {errors.cargoID && <p style={errStyle}>{errors.cargoID}</p>}

      <label style={labelStyle}>Arrival Date</label>
      <input
        type="datetime-local"
        style={inputStyle}
        value={form.arrivalDate || ''}
        onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
      />
      {errors.arrivalDate && <p style={errStyle}>{errors.arrivalDate}</p>}

      <label style={labelStyle}>Departure Date (optional)</label>
      <input
        type="datetime-local"
        style={inputStyle}
        value={form.departureDate || ''}
        onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
      />
      {errors.departureDate && <p style={errStyle}>{errors.departureDate}</p>}

      <label style={labelStyle}>Status</label>
      <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option>Pending</option>
        <option>Arrived</option>
        <option>Departed</option>
      </select>

      <label style={labelStyle}>Notes</label>
      <textarea style={{ ...inputStyle, height: '80px' }} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button onClick={handleSubmit} style={btnStyle}>
          {isEdit ? 'Update Arrival' : 'Add Arrival'}
        </button>
        <button onClick={() => navigate('/arrivals')} style={{ ...btnStyle, background: '#6c757d' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ArrivalForm;
