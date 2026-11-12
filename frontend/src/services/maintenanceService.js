import api from './api';

export const getSchedules = async () => {
  const response = await api.get('/maintenance/schedules');
  return response.data;
};

export const completeTask = async (logData) => {
  const response = await api.post('/maintenance/complete', logData);
  return response.data;
};

export const createSchedule = async (scheduleData) => {
  const response = await api.post('/maintenance/schedule', scheduleData);
  return response.data;
};

export const getLogs = async () => {
  const response = await api.get('/maintenance/logs');
  return response.data;
};

const maintenanceService = {
  getSchedules,
  completeTask,
  createSchedule,
  getLogs,
};

export default maintenanceService;
