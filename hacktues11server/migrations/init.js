const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

async function migrateDatabase() {
    try {
        await client.connect();
        console.log("Connected to PostgreSQL");

        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                firstname VARCHAR(200) NOT NULL,
                lastname VARCHAR(200) NOT NULL,
                email VARCHAR(200) UNIQUE NOT NULL,
                password VARCHAR(1000) NOT NULL,
                cards TEXT,
                privileges VARCHAR(100) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS unconformedPurchases (
                id SERIAL PRIMARY KEY,
                orderid INT NOT NULL,
                business VARCHAR(250) NOT NULL,
                purchaseditems TEXT NOT NULL,
                paymentmethod VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS unconformedPayments (
                id SERIAL PRIMARY KEY,
                orderid INT NOT NULL,
                firstname VARCHAR(250) NOT NULL,
                lastname VARCHAR(250) NOT NULL,
                cardnums INT NOT NULL,
                amount DECIMAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS conformedPurchases (
                id SERIAL PRIMARY KEY,
                orderid INT NOT NULL,
                business VARCHAR(250) NOT NULL,
                purchaseditems TEXT NOT NULL,
                firstname VARCHAR(200),
                lastname VARCHAR(200),
                cardnumbers INT NOT NULL,
                amount DECIMAL NOT NULL,
                paymentmethod VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            `CREATE TABLE IF NOT EXISTS authTokens (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(1000) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1' HOUR)
            );`,
            `CREATE TABLE IF NOT EXISTS cards (
                id SERIAL PRIMARY KEY,
                firstname VARCHAR(200) NOT NULL,
                lastname VARCHAR(200) NOT NULL,
                cardnumbers INT NOT NULL
            );`
        ];

        for (const query of queries) {
            await client.query(query);
        }

        console.log("Database migration completed successfully");
    } catch (err) {
        console.error("Error during migration:", err);
    } finally {
        await client.end();
    }
}

migrateDatabase();
