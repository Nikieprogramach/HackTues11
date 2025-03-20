const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
require('dotenv').config();
const Order = require('./order_pb').Order;
const Payment = require('./payment_pb').Payment;

app.use(express.json());

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

app.get('/getOrdersFromShop', async (req, res) => {
    const {
        business
    } = req.body
    query = `SELECT * FROM conformedPurchases WHERE business = ${business}` 
    const result = await pool.query(query)
    res.json(result.rows)
});

app.post('/queryPurchase', async (req, res) => {
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
    amount = deserializedOrder.getAmount()
    try{
        query = `SELECT * FROM unconformedPayments WHERE orderid = $1` 
        values = [orderID]
        const result = await pool.query(query, values)
        if (result.rows.length > 0) {
            row = result.rows[0]
            query = `INSERT INTO conformedPurchases (orderid, business, purchaseditems, clientfirstname, clientlastname, cardnumbers, paymentmethod, amount, date) VALUES ('$1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`
            values = [orderID, business, purchasedItemsString, row.clientfirstname, row.clientlastname, row.cardnums, paymentMethod, amount]
            await pool.query(query, values);
            await pool.query(`DELETE FROM unconformedPayments WHERE orderid = ${orderID}`);
        }else{
            if(paymentMethod === "cash"){
                var values = [orderID, business, purchasedItemsString, paymentMethod, amount]
                query = `INSERT INTO conformedPurchases (orderid, business, purchaseditems, paymentmethod, amount) VALUES ('$1, $2, $3, $4, $5)`
                try{
                    pool.query(query, values);
                }catch{
                    console.log("Error uploading to db")
                }
            }else if(paymentMethod === "card" || paymentMethod === "online"){
                var values = [orderID, business, purchasedItemsString, paymentMethod]
                query = `INSERT INTO unconformedPurchases (orderid, business, purchaseditems, paymentmethod) VALUES ('$1, $2, $3, $4)`
                try{
                    pool.query(query, values);
                }catch{
                    console.log("Error uploading to db")
                }
            }
        }
    }catch{
        console.log("Error")
    }    

});

app.post('/conformPurchaceCard', async (req, res) => {
    const {
        payment,
    } = req.body
    deserializedPayment = Payment.deserializeBinary(payment)
    orderID = deserializedPayment.getOrderid()
    firstname = deserializedPayment.getFirstname()
    lastname = deserializedPayment.getLastname()
    cardnums = deserializedPayment.getCardnums()
    amount = deserializedPayment.getAmount()
    try{
        query = `SELECT * FROM unconformedPurchases WHERE orderid = $1` 
        values = [orderID]
        const result = await pool.query(query, values)
        if (result.rows.length > 0) {
            row = result.rows[0]
            query = `INSERT INTO conformedPurchases (orderid, business, purchaseditems, clientfirstname, clientlastname, cardnumbers, paymentmethod, amount, date) VALUES ('$1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`
            values = [orderID, row.business, row.purchaseditems, firstname, lastname, cardnums, row.paymentmethod, amount]
            await pool.query(query, values);
            await pool.query(`DELETE FROM unconformedPurchases WHERE orderid = ${orderID}`);
        }else{
            console.log("Order not found")
            var values = [orderID, firstname, lastname, cardnums, amount]
            query = `INSERT INTO unconformedPayments (orderid, clientfirstname, clientlastname, cardnums, amount) VALUES ('$1, $2, $3, $4, $5)`
            try{
                pool.query(query, values);
            }catch{
                console.log("Error uploading to db")
            }
        }
    }catch{
        console.log("Error while trying to fetch db")
    }
});

// app.post('/conformPurchaceCard', async (req, res) => {
//     res.send('Hello, World!');
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});