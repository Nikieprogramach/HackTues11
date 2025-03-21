import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import OrdersDisplay from './ordersDisplay';
import './App.css';

const UserPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Assuming user data is available in AuthContext
  const [cards, setCards] = useState([]); // List of card numbers
  const [selectedCard, setSelectedCard] = useState(null); // Selected card number
  const [orders, setOrders] = useState([]); // Orders for the selected card
  const [showAddCardPopup, setShowAddCardPopup] = useState(false); // Popup visibility
  const [newCard, setNewCard] = useState({ digits: '', firstName: '', lastName: '' });

  useEffect(() => {
    checkAuth();
    fetchCards();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      fetchOrders(selectedCard);
    } else {
      setOrders([]); 
    }
  }, [selectedCard]);

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
            navigate("/user");
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

  const fetchCards = async () => {
    const token = localStorage.getItem('authToken'); 

    try {
      const response = await fetch('http://localhost:5000/getusercards', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards); 
      } else {
        console.error('Failed to fetch cards');
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const fetchOrders = async (cardNumber) => {
    const firstname = localStorage.getItem('firstname'); 
    const lastname = localStorage.getItem('lastname');

    try {
      const response = await fetch('http://localhost:5000/getpurchaseswithcard', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({firstname, lastname, cardNumber}),
      });
  
      if (response.ok) {
        const data = await response.json();
        setOrders(data); 
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddCard = () => {
    setNewCard({ digits: '', firstName: '', lastName: '' });
    setShowAddCardPopup(true);
  };

  const handleSaveCard = () => {
    if (newCard.digits.length === 4 && newCard.firstName ===  JSON.parse(localStorage.getItem("user")).firstname && newCard.lastName === JSON.parse(localStorage.getItem("user")).lastname) {
      setCards([...cards, newCard.digits]);
      setNewCard({ digits: '', firstName: '', lastName: '' });
      setShowAddCardPopup(false);
    } else {
      alert('Please fill all fields correctly.');
    }
  };

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="user-page">
      <div className="top-bar">
        <div className="welcome-message">
          Welcome {user?.firstName} {user?.lastName}!
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      <div className="main-content">
        <div className="left-section">
          <h3>Your Cards</h3>
          <div className="card-list">
            {cards &&
            <>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`card-item ${selectedCard === card ? 'selected' : ''}`}
                onClick={() => setSelectedCard(card)}
              >
                {card}
              </div>
            ))}</>}
          </div>
          <button className="add-card-button" onClick={handleAddCard}>
            Add Card
          </button>
        </div>

        <div className="right-section">
          {selectedCard ? (
            <OrdersDisplay key={orders.length} orders={orders} hasSearched={true} />
          ) : (
            <div className="no-card-selected">Select a card</div>
          )}
        </div>
      </div>
      {showAddCardPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Card</h3>
            <input
              type="text"
              placeholder="Last 4 Digits"
              // value={newCard.digits}
              onChange={(e) => setNewCard({ ...newCard, digits: e.target.value })}
            />
            <input
              type="text"
              placeholder="First Name"
              // value={newCard.firstName}
              onChange={(e) => setNewCard({ ...newCard, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              // value={newCard.lastName}
              onChange={(e) => setNewCard({ ...newCard, lastName: e.target.value })}
            />
            <button onClick={handleSaveCard}>Save</button>
            <button onClick={() => setShowAddCardPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;