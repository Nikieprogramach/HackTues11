const express = require('express');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');

const options = {
origin: ["http://localhost:3000"],
}

const app = express();
app.use(cors(options));
app.use(express.json());

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

function generateToken() {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < 50; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
  }

app.post('/getOrdersFromShop', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    const {
        business
    } = req.body
    console.log(business)
    query = `SELECT * FROM conformedPurchases WHERE business = '${business}'` 
    const result = await pool.query(query)
    console.log(result.rows)
    res.json(result.rows)
});

app.post('/login', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    const {
        email,
        password
    } = req.body;

    const cleanupQuery = `SELECT * FROM authTokens WHERE CURRENT_TIMESTAMP > expires_at`
    const ress = await pool.query(cleanupQuery);
    for(var i = 0; i < ress.rows.length; i++){
        await pool.query(`DELETE FROM authTokens WHERE id = ${ress.rows[i].id}`);
    }
    console.log(email)
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const values = [email];  
    try {
        const result = await pool.query(query);
        console.log()
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
            res.json({"token": token, "privileges": result.rows[0].privileges})
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

app.post('/signup', async (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body;

    const query = `SELECT * FROM users WHERE email = '${email}'`;
    try {
        const result = await pool.query(query);
        console.log()
        if (result.rows.length > 0) {
            res.status(401).json({ error: "Account with that username already exists" });
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            const query1 = `INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', '${hash}')`
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