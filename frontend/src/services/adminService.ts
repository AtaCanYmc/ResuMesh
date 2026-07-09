import axios from 'axios';
import { SystemLog } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchSystemLogs = async (
  token: string,
  page: number = 1,
  level?: string,
  module?: string,
  searchQuery?: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (level) params.append('level', level);
  if (module) params.append('module', module);
  if (searchQuery) params.append('search_query', searchQuery);
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  const response = await axios.get(`${API_URL}/api/v1/admin/logs?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
