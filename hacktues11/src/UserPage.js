import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from './AuthContext';
import OrdersDisplay from './orders_table_elements/ordersDisplay';
import CardList from './user_page_elements/cardList';
import AddCardPopup from './user_page_elements/addCardPopup';
import TimeSpanSelector from './orders_table_elements/timespanSelector';
import './App.css';
import './UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [cards, setCards] = useState([]); 
  const [selectedCard, setSelectedCard] = useState(); 
  const [orders, setOrders] = useState([]);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [newCard, setNewCard] = useState({ digits: '', firstname: '', lastname: '' });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  

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

  // const sortOrders = () =>{
  //     const sortedOrders = orders.sort((a, b) => {
  //     const dateA = new Date(a.date);
  //     const dateB = new Date(b.date);
  //     return dateB - dateA; 
  //   });
  //   setOrders(sortedOrders);
  // };

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
    const token = localStorage.getItem("authToken");

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
        setCards(data); 
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrders = async () => {
    const firstname =  JSON.parse(localStorage.getItem("user")).firstname; 
    const lastname = JSON.parse(localStorage.getItem("user")).lastname;
    const cardnumbers = selectedCard.cardnumbers
    console.log(cardnumbers)
    try {
      const response = await fetch('http://localhost:5000/getpurchaseswithcard', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({firstname, lastname, cardnumbers}),
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
          setCards(prevCards => (Array.isArray(prevCards) ? [...prevCards, { cardnumbers: newCard.digits, firstname: newCard.firstname, lastname: newCard.lastname }] : [{ cardnumbers: newCard.digits, firstname: newCard.firstname, lastname: newCard.lastname }]));
          setNewCard({ digits: '', firstname: '', lastname: '' })
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

  const handleAddIban = () => {
    //
  }

  return (
    <div className="user-page">
      <div className="top-bar">
        <div className="welcome-message">
           Добре дошли {JSON.parse(localStorage.getItem("user")).firstname} {JSON.parse(localStorage.getItem("user")).lastname}!
        </div>
        <button className="logout-button-user" onClick={logout}>
          Излизане от акаунта
        </button>
      </div>
      <div className="main-content">
        <div className="left-section">

          <CardList cards={cards} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
          <button className="add-iban-button" onClick={handleAddIban}>
            Добавете IBAN и банка
          </button>
          <button className="add-card-button" onClick={() => { setNewCard({ digits: '', firstName: '', lastName: '' }); setShowAddCardPopup(true);}}>
            Добавете карта
          </button>
        </div>

        <div className="right-section">
        <TimeSpanSelector fromDate={fromDate} toDate={toDate} setFromDate={setFromDate} setToDate={setToDate} />
          {/* <h3>Поръчки с избраната карта</h3> */}
          {selectedCard ? (
            <OrdersDisplay key={orders.length} orders={orders} hasSearched={true} />
          ) : (
            <div className="no-card-selected">Изберете карта</div>
          )}
        </div>
      </div>
      {showAddCardPopup && (  <AddCardPopup setShowAddCardPopup={setShowAddCardPopup} setNewCard={setNewCard} newCard={newCard} handleSaveCard={handleSaveCard}/>
      )}
    </div>
  );
};

export default UserPage;