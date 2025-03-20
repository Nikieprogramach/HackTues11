const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs')
const Order = require('./order_pb').Order;

app.use(express.json());

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

app.get('/getOrdersFromShop', (req, res) => {

});

app.post('/queryPurchase', (req, res) => {
    const {
        order,
    } = req.body
    deserializedOrder = Order.deserializeBinary(order)
    console.log(deserializedOrder)
    orderID = deserializedOrder.getOrderid()
    business = deserializedOrder.getBusiness()
    paymentMethod = deserializedOrder.getPaymentmethod()
    purchasedItems = deserializedOrder.getPurchaseditemsList()
    purchasedItemsString = purchasedItems.map(item => `${item.name}: ${item.price}`).join(", ");
    var values = [orderID, business, purchasedItemsString, paymentMethod]
    query = `INSERT INTO unconformedPurchases (orderid, busines, purchaseditems, paymentmethod) VALUES ('$1, $2, $3, $4)`
    try{
        pool.query(query, values);
    }catch{
        console.log("Error uploading to db")
    }
    
});

app.post('/conformPurchaceOnline', (req, res) => {
    res.send('Hello, World!');
});

app.post('/conformPurchaceCard', (req, res) => {
    res.send('Hello, World!');
});

app.get('/conformPurchaceCash', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});