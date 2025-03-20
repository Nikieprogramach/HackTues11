import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './App.css';

const Order = (props) => {
    const [order, setOrder] = useState(props.order);
    var purchaseditems = []
    var splitstr = order.purchaseditems.split(",")
    splitstr.map(str => {
        purchaseditems.push({name: str.trim().split(':')[0].trim(), price: str.trim().split(':')[1].trim()})
    })
    return(
        <>
            {purchaseditems.map((item, i) => (
            <tr className={i > 0 ? 'sub-row' : ''}>
                {i === 0 && (
                <>
                    <td rowSpan={order.purchaseditems.length + 1}>{order.date}</td>
                    <td rowSpan={order.purchaseditems.length + 1}>{order.orderid}</td>
                </>
                )}
                <td>{item.name}</td>
                <td>{parseFloat(purchaseditems[i].price).toFixed(2)} лв.</td>
            </tr>
            ))}
            <tr className="sub-row">
            <td><b>ОБЩА ЦЕНА</b></td>
            <td><b>{parseFloat(order.amount).toFixed(2)} лв.</b></td>
            </tr>
        </>
    )
}

export default Order;