import React from 'react';
import '../UserPage.css';

const AddIbanPopup = ({ setShowAddIbanPopup, setIban, iban, setBank, bank, handleIbanSubmit}) => (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Добавете нова карта</h3>
        <input type="text" placeholder="IBAN"  pattern="[A-Z]{2}\d{2}[A-Z0-9]{1,30}" title="Моля, въведете валиден IBAN" onChange={(e) => setIban(e.target.value)}/>
        <input type="text" placeholder="Банка"  onChange={(e) => setBank(e.target.value)}/>
        <div className="popup-buttons">
        <button onClick={handleIbanSubmit}>Запазване</button>
          <button onClick={() => setShowAddIbanPopup(false)}>Прекратяване</button>
        </div>
      </div>
    </div>
  );

  export default AddIbanPopup;