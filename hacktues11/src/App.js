import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

const App = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Mock JSON data
  const mockData = [
    {
      date_time: "20.03.2025",
      order_id: "ORD12345",
      items: ["bread", "soda"],
      price: 5.5,
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"],
      price: 7.2,
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12347",
      items: ["juice", "chips"],
      price: 6.8,
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Set the search results to the mock data (ignoring the search query)
      setSearchResults(mockData);
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
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} disabled={!searchQuery.trim()}>
          Search
        </button>
      </div>
      {hasSearched && (
        <div className="content">
          {searchResults.length > 0 ? (
            searchResults.map((order, index) => (
              <div key={index} className="item">
                <p><strong>Date & Time:</strong> {order.date_time}</p>
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Items:</strong> {order.items.join(', ')}</p>
                <p><strong>Price:</strong> ${order.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="item">No results found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;