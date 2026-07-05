import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${apiUrl}/api/v1/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      login(response.data.access_token);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Kullanıcı adı veya şifre hatalı.');
      } else {
        setError('Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-center justify-center font-sans p-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <KeyRound className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Yönetici Girişi</h2>
        <p className="text-neutral-400 text-center mb-8">Sistemi yönetmek için giriş yapın</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500 text-neutral-100 transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500 text-neutral-100 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium mt-6"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
