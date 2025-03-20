import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Mock JSON data
  const mockData = [
    {
      date_time: "20.03.2025",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
    },
    {
      date_time: "19.03.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
    },
    {
      date_time: "21.03.2025",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
    },
    {
      date_time: "20.02.2025",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
    },
    {
      date_time: "20.04.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
    },
    {
      date_time: "01.08.2024",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
    },
    {
      date_time: "20.07.2024",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
    },
    {
      date_time: "20.09.2024",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
    },
    {
      date_time: "01.03.2024",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
    },
    {
      date_time: "20.03.2024",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {

      const sortedData = [...mockData].sort((a, b) => {
        const dateA = new Date(a.date_time.split('.').reverse().join('-'));
        const dateB = new Date(b.date_time.split('.').reverse().join('-'));
        return dateB - dateA;
      });

      setSearchResults(sortedData);
      setHasSearched(true);
    }
  };

  return (
    <div className="App">
      <div className={`header ${hasSearched ? 'fade-out' : ''}`}>
        <h1>NAPI</h1>
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
        <FontAwesomeIcon icon={faMagnifyingGlass} /> Search
        </button>
      </div>
      {hasSearched && (
        <>
          <div className={`timespan-selector ${hasSearched ? 'fade-in' : ''}`}>
            <label>From:</label>
            <input type="date" />
            <label>To:</label>
            <input type="date" />
          </div>
          <div className={`content ${hasSearched ? 'fade-in' : ''}`}>
            <table>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map((order, index) => (
                    <React.Fragment key={index}>
                      {order.items.map((item, i) => (
                        <tr key={`${index}-${i}`} className={i > 0 ? 'sub-row' : ''}>
                          {i === 0 && (
                            <>
                              <td rowSpan={order.items.length}>{order.date_time}</td>
                              <td rowSpan={order.items.length}>{order.order_id}</td>
                            </>
                          )}
                          <td>{item}</td>
                          <td>${order.prices[i].toFixed(2)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No results found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default App;