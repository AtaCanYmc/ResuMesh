import React from 'react';
import SearchBar from './components/SearchBar';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-content items-center pt-20">
      <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        StackEcho / ResuMesh
      </h1>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        GitHub, LinkedIn ve Medium verilerini tek bir akıllı arama motorunda birleştiren açık kaynaklı portfolyo projesi.
      </p>
      <SearchBar />
    </div>
  );
}

export default App;
