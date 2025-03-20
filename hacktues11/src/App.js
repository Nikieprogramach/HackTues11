import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

const App = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Perform search logic here
      setHasSearched(true);
    }
  };

  return (
    <div className="App">
       <div className={`search-bar ${hasSearched ? 'search-bar-top' : 'search-bar-center'}`}>
        <input
          type="text"
          placeholder="Type business name here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.target.value);
            }
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {hasSearched && (
        <div className="content">
          <p>searched</p>
        </div>
      )}
    </div>
  );
}

export default App;
