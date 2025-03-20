import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const App = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Mock JSON data
  const mockData = [
    {
      date_time: "20.03.2025",
      order_id: "ORD12345",
      items: ["bread", "soda"],
      prices: [2.5, 3.0],
      total_price: 5.5, // Add total_price to each order
    },
    {
      date_time: "19.03.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"],
      prices: [1.2, 6.0],
      total_price: 7.2, // Add total_price to each order
    },
    {
      date_time: "21.03.2025",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"],
      prices: [2.0, 3.5, 1.3],
      total_price: 6.8, // Add total_price to each order
    },
    {
      date_time: "20.02.2025",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.04.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "01.08.2024",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.07.2024",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.09.2024",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "01.03.2024",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.03.2024",
      order_id: "ORD12345",
      items: ["bread", "soda"], // Ensure this is an array
      prices: [2.5, 3.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12346",
      items: ["milk", "cookies"], // Ensure this is an array
      prices: [1.2, 6.0], // Ensure this is an array
      total_price: 7.2,
    },
    {
      date_time: "20.03.2025",
      order_id: "ORD12347",
      items: ["juice", "chips", "candy"], // Ensure this is an array
      prices: [2.0, 3.5, 1.3], // Ensure this is an array
      total_price: 7.2,
    },
  ];

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}`);
  };

  const filterResultsByTimespan = (results) => {
    return results.filter((order) => {
      const orderDate = parseDate(order.date_time);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      return (
        (!from || orderDate >= from) && 
        (!to || orderDate <= to) 
      );
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {

      if (!hasSearched) {
        const today = new Date().toISOString().split('T')[0];
        setFromDate('');
        setToDate(today);
      }

      const sortedData = [...mockData].sort((a, b) => {
        const dateA = new Date(a.date_time.split('.').reverse().join('-'));
        const dateB = new Date(b.date_time.split('.').reverse().join('-'));
        return dateB - dateA;
      });

      setSortedData(sortedData);
      const filteredResults = filterResultsByTimespan(sortedData);
      setSearchResults(filteredResults);
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (hasSearched) {
      const filteredResults = filterResultsByTimespan(sortedData);
      setSearchResults(filteredResults);
    }
  }, [fromDate, toDate]);

  return (
    <div className="App">
      <div className={`header ${hasSearched ? 'fade-out' : ''}`}>
        <h1>NAPI</h1>
        <h2>Администратор</h2>
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
            <label>От дата:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label>до дата:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className={`content ${hasSearched ? 'fade-in' : ''}`}>
            <table>
              <thead>
                <tr>
                  <th>Дата & Време</th>
                  <th>Номер на поръчкта</th>
                  <th>Продукти</th>
                  <th>Цена</th>
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
                              <td rowSpan={order.items.length + 1}>{order.date_time}</td>
                              <td rowSpan={order.items.length + 1}>{order.order_id}</td>
                            </>
                          )}
                          <td>{item}</td>
                          <td>{order.prices[i].toFixed(2)} лв.</td>
                        </tr>
                      ))}
                      <tr className="sub-row">
                        <td><b>ОБЩА ЦЕНА</b></td>
                        <td><b>{order.total_price.toFixed(2)} лв.</b></td>
                      </tr>
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