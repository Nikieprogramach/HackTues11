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
    //
  };

  const fetchOrders = async (cardNumber) => {
    setOrders()
  };

  const handleAddCard = () => {
    setShowAddCardPopup(true);
  };

  const handleSaveCard = () => {
    if (newCard.digits.length === 4 && newCard.firstName && newCard.lastName) {
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
            {cards.map((card, index) => (
              <div
                key={index}
                className={`card-item ${selectedCard === card ? 'selected' : ''}`}
                onClick={() => setSelectedCard(card)}
              >
                {card}
              </div>
            ))}
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
    </div>
  );
};

export default UserPage;