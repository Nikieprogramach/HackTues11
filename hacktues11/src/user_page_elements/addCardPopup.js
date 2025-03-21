import React from 'react';
import '../UserPage.css';

const AddCardPopup = ({ setShowAddCardPopup, setNewCard, newCard, handleSaveCard }) => (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Добавете нова карта</h3>
        <input type="text" placeholder="Последните 4 цифри на картата" onChange={(e) => setNewCard({ ...newCard, digits: e.target.value })} />
        <input type="text" placeholder="Първо Име" onChange={(e) => setNewCard({ ...newCard, firstname: e.target.value })} />
        <input type="text" placeholder="Фамилия" onChange={(e) => setNewCard({ ...newCard, lastname: e.target.value })} />
        <div className="popup-buttons">
        <button onClick={handleSaveCard}>Запазване</button>
          <button onClick={() => setShowAddCardPopup(false)}>Прекратяване</button>
        </div>
      </div>
    </div>
  );

  export default AddCardPopup;