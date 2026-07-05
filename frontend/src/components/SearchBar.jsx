import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

export default function SearchBar({ onSearchResults }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.trim().length < 2) {
      onSearchResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/v1/search/?q=${query}`);
        onSearchResults(response.data);
      } catch (error) {
        console.error("Arama motoru hatası:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearchResults]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-2xl focus-within:border-blue-500 shadow-2xl transition-all">
        <Search className="absolute left-5 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Teknoloji, proje, sertifika veya deneyim ara... (Örn: React, Spring, IoT)"
          className="w-full bg-transparent pl-14 pr-5 py-5 text-white placeholder-gray-500 focus:outline-none text-lg rounded-2xl"
        />
      </div>
    </div>
  );
}
