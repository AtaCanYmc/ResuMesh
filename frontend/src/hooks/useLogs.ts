import { useState, useCallback } from 'react';
import { SystemLog } from '../types';
import { fetchSystemLogs } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

export const useLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSystemLogs(token);
      setLogs(data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Yetkisiz erişim. Token geçersiz veya süresi dolmuş.');
      } else {
        setError('Loglar çekilirken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { logs, loading, error, fetchLogs };
};
