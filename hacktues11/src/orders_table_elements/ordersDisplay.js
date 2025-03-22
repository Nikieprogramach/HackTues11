import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../App.css';
import Order from './order';

const OrdersDisplay = (props) => {
    const [orders, setOrders] = useState(props.orders);
    var totalcost = 0
    orders.map(order => {
        totalcost += parseFloat(order.amount)
    })
    return(
        <div className={`content ${props.hasSearched ? 'fade-in' : ''}`}>
            <table>
                <thead>
                <tr>
                    <th>Търговец</th>
                    <th>Дата и Време</th>
                    <th>Номер на поръчкта</th>
                    <th>Продукти</th>
                    <th>Цена</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <Order order={order}/>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">No results found.</td>
                    </tr>
                )}
                <tr>
                    <td colSpan="5"><strong>Общо: {totalcost.toFixed(2)}</strong></td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default OrdersDisplay;