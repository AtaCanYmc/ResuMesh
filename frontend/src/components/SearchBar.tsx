import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4">
      <div className="relative flex items-center bg-gray-900 border border-gray-800 rounded-xl focus-within:border-blue-500 shadow-lg transition-all">
        <Search className="absolute left-4 text-gray-500 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yetenek, proje, sertifika veya makale ara... (Örn: React, Spring, LLM)"
          className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none text-md"
        />
      </div>
      {query && (
        <p className="text-sm text-gray-400 mt-2 text-center">
          Backend'de şu kelime aranacak: <span className="text-blue-400 font-mono">{query}</span>
        </p>
      )}
    </div>
  );
}
