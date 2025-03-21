import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import OrdersDisplay from './ordersDisplay';

const AdminPage = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState([]); 

  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
  
    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/verifytoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token}),
        });
  
        if (response.ok) {
          const data = await response.json();
          if(data.valid){
            navigate("/admin");
          }else {
            localStorage.setItem("authToken", null);
            localStorage.setItem("privileges", null);
            navigate("/login")
          }
        } 
      } catch (error) {
        localStorage.setItem("authToken", null);
        localStorage.setItem("privileges", null);
        navigate("/login")
      }
    } else {
      navigate("/login");
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return new Date(`${year}-${month}-${day}`);
  };

  // const filterResultsByTimespan = (results) => {
  //   return results.filter((order) => {
  //     const orderDate = parseDate(order.date_time);
  //     const from = fromDate ? new Date(fromDate) : null;
  //     const to = toDate ? new Date(toDate) : null;

  //     return (
  //       (!from || orderDate >= from) && 
  //       (!to || orderDate <= to) 
  //     );
  //   });
  // };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
        // if (!hasSearched) {
        //     const today = new Date().toISOString().split('T')[0];
        //     setFromDate('');
        //     setToDate(today);
        // }

        try {
            const response = await fetch('http://localhost:5000/getOrdersFromShop', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ business: searchQuery.trim() }),
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();

            console.log("Fetched Data:", result);

            setData(result);
            setSearchResults(result)
            setHasSearched(true);

        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            setSearchResults([]); // Clear results in case of error
        }
    }
};

  // useEffect(() => {
  //   if (hasSearched) {
  //     const filteredResults = filterResultsByTimespan(sortedData);
  //     setSearchResults(filteredResults);
  //   }
  // }, [fromDate, toDate]);

  useEffect(() => {
    if (data.length > 0) {
      setSearchResults(data);
  } else {
      setSearchResults([]);
  }
}, [data]);

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
        <div>
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
          <OrdersDisplay key={searchResults.length} orders={searchResults} hasSearched={hasSearched}/>
        </div>
      )}
    </div>
  );
};

export default AdminPage;