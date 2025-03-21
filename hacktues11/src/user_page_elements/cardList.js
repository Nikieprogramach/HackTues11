import React from 'react';
import '../UserPage.css';

const CardList = ({ cards, selectedCard, setSelectedCard }) => (
  <div className="card-list">
    <h3 className='h3-title'>Вашите карти</h3>
    {cards.map((card, index) => (
      <div
        key={index}
        className={`card-item ${selectedCard === card ? 'selected' : ''}`}
        onClick={() => setSelectedCard(card)}
      >
        ************{card.cardnumbers}
      </div>
    ))}
  </div>
);

export default CardList;