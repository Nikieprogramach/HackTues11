const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

async function insertExampleData() {
    try {
        await client.connect();

        const exampleData = {
            orderid: 12345,
            business: 'Example Business',
            purchaseditems: 'Item1: 10.20, Item2: 1.30, Item3: 5',
            firstname: 'John',
            lastname: 'Doe',
            cardnumbers: 123456789,
            amount: 99.99,
            paymentmethod: 'Credit Card',
            date: '2026-10-01',
        };

        const insertQuery = `
            INSERT INTO conformedPurchases (
                orderid, business, purchaseditems, firstname, lastname, cardnumbers, amount, paymentmethod, date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            exampleData.orderid,
            exampleData.business,
            exampleData.purchaseditems,
            exampleData.firstname,
            exampleData.lastname,
            exampleData.cardnumbers,
            exampleData.amount,
            exampleData.paymentmethod,
            exampleData.date,
        ];

        const res = await client.query(insertQuery, values);
        console.log('Data inserted successfully:', res.rowCount);

    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        await client.end();
    }
}

insertExampleData();