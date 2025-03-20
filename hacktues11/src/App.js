import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

const App = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const performSearch = (query) => {
    const mockResults = [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`,
    ];
    return mockResults;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = performSearch(searchQuery);
      setSearchResults(results)
      setHasSearched(true);
    }
  };

  return (
    <div className="App">
      <div className={`header ${hasSearched ? 'fade-out' : ''}`}>
        <h1>T.R.A.C.K.</h1>
        <h2>Transaction Receipt Aggregation and Centralized Knowledge</h2>
      </div>
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
        <button onClick={handleSearch} disabled={!searchQuery.trim()}>Search</button>
      </div>
        {hasSearched && (
          <div className="content">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <div key={index} className="item">
                  {result}
                </div>
              ))
            ) : (
              <div className="item">No results found.</div>
            )}
          </div>
        )}
    </div>
  );
}

export default App;
