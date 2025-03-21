import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import OrdersDisplay from './ordersDisplay';
import './App.css';
import './UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // Assuming user data is available in AuthContext
  const [cards, setCards] = useState([]); // List of card numbers
  const [selectedCard, setSelectedCard] = useState(null); // Selected card number
  const [orders, setOrders] = useState([]); // Orders for the selected card
  const [showAddCardPopup, setShowAddCardPopup] = useState(false); // Popup visibility
  const [newCard, setNewCard] = useState({ digits: '', firstname: '', lastname: '' });

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
  }, [selectedCard, newCard]);

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
    // const token = localStorage.getItem('authToken'); 

    // try {
    //   const response = await fetch('http://localhost:5000/getusercards', {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({token}),
    //   });
  
    //   if (response.ok) {
    //     const data = await response.json();
    //     setCards(data.cards); 
    //   } else {
    //     console.error('Failed to fetch cards');
    //   }
    // } catch (error) {
    //   console.error('Error fetching cards:', error);
    // }
    setCards(['1234', '3421', '2312']);
  };

  const fetchOrders = async (cardNumber) => {
    const firstname =  JSON.parse(localStorage.getItem("user")).firstname; 
    const lastname = JSON.parse(localStorage.getItem("user")).lastname;

    // try {
    //   const response = await fetch('http://localhost:5000/getpurchaseswithcard', {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({firstname, lastname, cardNumber}),
    //   });
  
    //   if (response.ok) {
    //     const data = await response.json();
    //     setOrders(data); 
    //   } else {
    //     console.error('Failed to fetch orders');
    //   }
    // } catch (error) {
    //   console.error('Error fetching orders:', error);
    // }
    const response = await fetch('http://localhost:5000/getOrdersFromShop', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ business: 'Example Business' }),
      mode: 'cors'
  });

  if (!response.ok) {
      throw new Error('Failed to fetch data');
  }

  const result = await response.json();
  setOrders(result);
  };

  // const addCardToUSer = async (cardNumber) => {
  //   const token = localStorage.getItem('token')
  //   const firstname = JSON.parse(localStorage.getItem("user")).firstname; 
  //   const lastname = JSON.parse(localStorage.getItem("user")).lastname;

  //   try {
  //     const response = await fetch('http://localhost:5000/addcardtouser', {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({token, cardNumber, firstname, lastname}),
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       setOrders(data); 
  //     } else {
  //       console.error('Failed to add card');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   }
  // };

  const handleAddCard = () => {
    setNewCard({ digits: '', firstName: '', lastName: '' });
    setShowAddCardPopup(true);
  };

  const handleSaveCard = async () => {
    if (newCard.digits.length === 4 && 
      newCard.firstname ===  JSON.parse(localStorage.getItem("user")).firstname && 
      newCard.lastname === JSON.parse(localStorage.getItem("user")).lastname
    ) {
      const token = localStorage.getItem("authToken")
      const firstname = JSON.parse(localStorage.getItem("user")).firstname; 
      const lastname = JSON.parse(localStorage.getItem("user")).lastname;
      const cardnumbers = newCard.digits
      try {
        const response = await fetch('http://localhost:5000/addcardtouser', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token, firstname, lastname, cardnumbers}),
        });
    
        if (response.ok) {
          setNewCard({ digits: '', firstName: '', lastName: '' })
          setCards(prevCards => (Array.isArray(prevCards) ? [...prevCards, newCard.digits] : [newCard.digits]));
          setNewCard({ digits: '', firstname: '', lastname: '' });
          setShowAddCardPopup(false);
        } else {
          console.error('Failed to upload card');
        }
      } catch (error) {
        console.error('Error uploading card:', error);
      }
    } else {
      alert('Please fill all fields correctly.');
    }

    
  }
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="user-page">
      <div className="top-bar">
        <div className="welcome-message">
          Welcome {user?.firstname} {user?.lastname}!
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Излизане от акаунта
        </button>
      </div>
      <div className="main-content">
        <div className="left-section">
          {/* <h3>Вашите карти</h3> */}
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
            Добавете карта
          </button>
        </div>

        <div className="right-section">
          {/* <h3>Поръчки с избраната карта</h3> */}
          {selectedCard ? (
            <OrdersDisplay key={orders.length} orders={orders} hasSearched={true} />
          ) : (
            <div className="no-card-selected">Изберете карта</div>
          )}
        </div>
      </div>
      {showAddCardPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Добавете нова карта</h3>
            <input
              type="text"
              placeholder="Последните 4 цифри на картата"
              // value={newCard.digits}
              onChange={(e) => setNewCard({ ...newCard, digits: e.target.value })}
            />
            <input
              type="text"
              placeholder="Първо Име"
              // value={newCard.firstname}
              onChange={(e) => setNewCard({ ...newCard, firstname: e.target.value })}
            />
            <input
              type="text"
              placeholder="Фамилия"
              // value={newCard.lastname}
              onChange={(e) => setNewCard({ ...newCard, lastname: e.target.value })}
            />
            <div className="popup-buttons">
              <button onClick={handleSaveCard}>Запазване</button>
              <button onClick={() => setShowAddCardPopup(false)}>Прекратяване</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;