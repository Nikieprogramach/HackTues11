import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import OrdersDisplay from './orders_table_elements/ordersDisplay';

const AdminPage = () => {
  const { logout, user } = useAuth();
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

  const filterResultsByTimespan = (results) => {
    return results.filter((order) => {
      const orderDate = new Date(order.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      return (
        (!from || orderDate >= from) && 
        (!to || orderDate <= to) 
      );
    });
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
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

            const sortedResults = result.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB - dateA; 
            });

            setSortedData(sortedResults)
            const filteredResults = filterResultsByTimespan(sortedResults);
            setSearchResults(filteredResults);
            setHasSearched(true);

        } catch (error) {
            console.error('Error fetching data:', error);
            setSearchResults([]);
        }
    }
};

  useEffect(() => {
    if (hasSearched) {
      const filteredResults = filterResultsByTimespan(sortedData);
      setSearchResults(filteredResults);
    }
  }, [fromDate, toDate]);

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="App">
      <div className={`header ${hasSearched ? 'fade-out' : ''}`}>
        <h1>NAPI</h1>
        <h2>Администратор</h2>
      </div>
      <button className={`logout-button ${hasSearched ? 'fade-in' : ''}`} onClick={handleLogout}>
          Излизане от акаунта
      </button>
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