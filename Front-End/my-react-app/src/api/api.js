import axios from "axios";

// Change this if your backend runs on a different port or host.
export const BASE_URL = "http://localhost:5119/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ships
export const getAllShips = () => api.get("/ships");
export const getShipById = (id) => api.get(`/ships/${id}`);
export const searchShips = (name) => api.get("/ships/search", { params: { name } });
export const addShip = (data) => api.post("/ships", data);
export const updateShip = (id, data) => api.put(`/ships/${id}`, data);
export const deleteShip = (id) => api.delete(`/ships/${id}`);

// Docks
export const getAllDocks = () => api.get("/docks");
export const getDockById = (id) => api.get(`/docks/${id}`);
export const addDock = (data) => api.post("/docks", data);
export const updateDock = (id, data) => api.put(`/docks/${id}`, data);
export const deleteDock = (id) => api.delete(`/docks/${id}`);

// Cargo
export const getAllCargo = () => api.get("/cargo");
export const getCargoById = (id) => api.get(`/cargo/${id}`);
export const addCargo = (data) => api.post("/cargo", data);
export const updateCargo = (id, data) => api.put(`/cargo/${id}`, data);
export const deleteCargo = (id) => api.delete(`/cargo/${id}`);

// Arrivals
export const getAllArrivals = () => api.get("/arrivals");
export const getArrivalById = (id) => api.get(`/arrivals/${id}`);
export const searchArrivals = (ship, status) =>
  api.get("/arrivals/search", { params: { ship, status } });
export const addArrival = (data) => api.post("/arrivals", data);
export const updateArrival = (id, data) => api.put(`/arrivals/${id}`, data);
export const deleteArrival = (id) => api.delete(`/arrivals/${id}`);

export { api };
export default api;
