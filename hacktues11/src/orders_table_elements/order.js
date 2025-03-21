import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../App.css';



const Order = ({ order }) => {
    var purchaseditems = []
    var splitstr = order.purchaseditems.split(",")
    splitstr.map(str => {
        purchaseditems.push({name: str.trim().split(':')[0].trim(), price: str.trim().split(':')[1].trim()})
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    return (
      <>
        <tr className="main-row">
        <td rowSpan={purchaseditems.length + 2}>{order.business}</td>
          <td rowSpan={purchaseditems.length + 2}>{formatDate(order.date)}</td>
          <td rowSpan={purchaseditems.length + 2}>{order.orderid}</td>
        </tr>
  
        {purchaseditems.map((item, index) => (
          <tr key={index} className="sub-row">
            <td>{item.name}</td>
            <td>{parseFloat(item.price).toFixed(2)} лв.</td>
          </tr>
        ))}
        <tr className="sub-row">
            <td><b>ОБЩА ЦЕНА</b></td>
            <td><b>{parseFloat(order.amount).toFixed(2)} лв.</b></td>
        </tr>
      </>
    );
  };
  

export default Order;