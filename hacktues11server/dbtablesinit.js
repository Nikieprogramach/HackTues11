const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

async function createTable() {  
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // const query = `
    //   CREATE TABLE IF NOT EXISTS users (
    //     id SERIAL PRIMARY KEY,
    //     firstname VARCHAR(200) NOT NULL,
    //     lastname VARCHAR(200) NOT NULL,
    //     email VARCHAR(200) UNIQUE NOT NULL,
    //     password VARCHAR(1000) NOT NULL,
    //     cards TEXT,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `;

    // const query = `
    //     CREATE TABLE IF NOT EXISTS unconformedPurchases (
    //     orderid INT NOT NULL,
    //     busines VARCHAR(250) NOT NULL,
    //     purchaseditems TEXT NOT NULL,
    //     paymentmethod VARCHAR(100) NOT NULL,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //     );
    // `;

    const query = `
        CREATE TABLE IF NOT EXISTS conformedPurchases (
        orderid SERIAL PRIMARY KEY,
        busines VARCHAR(250) NOT NULL,
        purchaseditems TEXT NOT NULL,
        clientfirstname VARCHAR(200),
        clientlastname VARCHAR(200),
        cardnumbers INT NOT NULL,
        amount DECIMAL NOT NULL,
        paymentmethod VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
  
    await client.query(query);
    console.log("Table created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    await client.end();
  }
}

createTable();
