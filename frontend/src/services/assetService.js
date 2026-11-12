import api from './api';

export const getAll = async (page = 0, size = 10) => {
  const response = await api.get('/assets', {
    params: { page, size },
  });
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/assets/${id}`);
  return response.data;
};

export const create = async (assetData) => {
  const response = await api.post('/assets', assetData);
  return response.data;
};

export const decommission = async (id) => {
  const response = await api.delete(`/assets/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

const assetService = {
  getAll,
  getById,
  create,
  decommission,
  getStats,
};

export default assetService;
