const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
require('dotenv').config();

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

app.post('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const cleanupQuery = `SELECT * FROM authTokens WHERE CURRENT_TIMESTAMP > expires_at`
    const ress = await pool.query(cleanupQuery);
    console.log(ress.rows)
    for(var i = 0; i < ress.rows.length; i++){
        await pool.query(`DELETE FROM authTokens WHERE id = ${ress.rows[i].id}`);
    }

    const query = `SELECT * FROM users WHERE name = $1`;
    const values = [username];  
    try {
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
        const heshPass = result.rows[0].password;
        if(bcrypt.compareSync(password, heshPass)){
            var token = generateToken()
            try {
            const query1 = `INSERT INTO authtokens (user_id, token) VALUES (${result.rows[0].id}, '${token}')`;
            await pool.query(query1)
            } catch (error) {
                console.error("Database Insert Error:", error);
            }
            res.json({"token": token})
        }else{
            res.status(401).json({ error: "Invalid password" });
        }
        } else {
        res.status(401).json({ error: "Invalid username or password" });
        }
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to login" });
    }
});

app.post('/verifytoken', async (req, res) => {
    const {
        token
    } = req.body;

    try {
        const query = `SELECT * FROM authtokens WHERE token = $1 AND CURRENT_TIMESTAMP < expires_at`;
        const values = [token];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
        res.json({ valid: true });
        } else {
        res.json({ valid: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to verify token" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});