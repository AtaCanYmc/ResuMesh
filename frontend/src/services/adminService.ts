import axios from 'axios';
import { SystemLog } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchSystemLogs = async (token: string): Promise<SystemLog[]> => {
  const response = await axios.get(`${API_URL}/api/v1/admin/logs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};
