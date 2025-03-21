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
            res.json({"token": token, "user": {'firstname': result.rows[0].firstname, 'lastname': result.rows[0].lastname, "privileges": result.rows[0].privileges}})
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
        
        if (result.rows.length > 0) {
            res.status(401).json({ error: "Account with that username already exists" });
        } else {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            const query1 = `INSERT INTO users (firstname, lastname, email, password) VALUES ('${firstname}', '${lastname}', '${email}', '${hash}')`
            await pool.query(query1);
            res.json({"ok": true})
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

app.post('/addcardtouser', async (req, res) => {
    const {
        token,
        cardnumbers,
        firstname,
        lastname
    } = req.body;
    try {
        const query = `SELECT * FROM authtokens WHERE token = $1`;
        const values = [token];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const query1 = `SELECT * FROM users WHERE id = $1`;
            const userID = result.rows[0].user_id
            const values = [userID];
            const result1 = await pool.query(query1, values);
            if(result1.rows[0].cards !== "" && result1.rows[0].cards !== null && result1.rows[0].cards !== undefined){
                var cards = result1.rows[0].cards
                console.log("cards:",cards)
            }else{
                var cards = ""
            }
            
            if(result1.rows.length > 0){
                const query1 = `SELECT * FROM cards 
                        WHERE firstname = $1
                        AND lastname = $2 
                        AND cardnumbers = $3`
                const values1 = [firstname, lastname, cardnumbers]
                const result = await pool.query(query1, values1)
                if(result.rows.length > 0) {}
                else {
                    const query2 = `INSERT INTO cards (firstname, lastname, cardnumbers)
                    VALUES ($1, $2, $3)`;
                    const values2 = [firstname, lastname, cardnumbers]
                    await pool.query(query2, values2);
                    const query3 = `SELECT * FROM cards 
                    WHERE firstname = $1
                    AND lastname = $2
                    AND cardnumbers = $3` 
                    const values3 = [firstname, lastname, cardnumbers]
                    const result = await pool.query(query3, values3)
                    // cards.push()
                    if(result.rows.length > 0){
                        console.log("cards", cards)
                        if(cards === ""){
                            var cardstoupload = result.rows[0].id
                        }else{
                            var cardstoupload = cards + "," + result.rows[0].id
                        }
                        const query3 = `UPDATE users SET cards = '${cardstoupload}' WHERE id = ${userID};`
                        await pool.query(query3)
                    }
                    res.json({ok:"ok"})
                }
            }
        } else {
            res.status(401).json({error: "Error while trying to upload card"})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to verify token" });
    }
});

app.post('/getpurchaseswithcard', async (req, res) => {
    const {
        firstname,
        lastname,
        cardnumbers
    } = req.body;
    try {
        const query = `SELECT * FROM conformedPurchases WHERE firstname = '${firstname}' AND lastname = '${lastname}' AND cardnumbers = ${cardnumbers}`;
        const result = await pool.query(query);

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.json([]);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to get payments" });
    }
});

app.post('/getusercards', async (req, res) => {
    const {
        token
    } = req.body;
    try{
        const query = `SELECT * FROM authtokens WHERE token = $1 AND CURRENT_TIMESTAMP < expires_at`;
        const values = [token];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const query1 = `SELECT * FROM users WHERE id = $1`;
            const userID = result.rows[0].user_id
            const values = [userID];
            const result1 = await pool.query(query1, values); 
            // var usercards = result1.rows[0].cards.split(',').filter(card => !(isNaN(card) || card === "" || card === undefined || card === null));
            if (result1.rows.length > 0 && result1.rows[0].cards !== "" && result1.rows[0].cards !== null) {
                if (result1.rows[0].cards.includes(",")) {
                    search = result1.rows[0].cards.split(',').map(Number).filter(card => !(isNaN(card) || card === "" || card === undefined || card === null));;
                } else {
                    search = [Number(result1.rows[0].cards).filter(card => !(isNaN(card) || card === "" || card === undefined || card === null))];
                }
                
                const query2 = `SELECT * FROM cards WHERE id = ANY($1::int[])`;
                const response = await pool.query(query2, [search]);
                res.json(response.rows)
            }else{
                res.json("")
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to get payments" });
    }
});

/////////////////////////////////////////////////////////
// IRIS api requests
////////////////////////////////////////////////////////



app.post('/setiban', async (req, res) => { 
    const {
        token,
        iban,
        bank
    } = req.body;
    try{
        const query = `SELECT * FROM authtokens WHERE token = $1 AND CURRENT_TIMESTAMP < expires_at`;
        const values = [token];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const query1 = `SELECT * FROM users WHERE id = $1`;
            const userID = result.rows[0].user_id
            const values = [userID];
            const result1 = await pool.query(query1, values); 
            var user = result1.rows[0]
            console.log(user)
            const irisUser = await signupAgent(process.env.IRISAGENTHASH, null, null, user.firstname, null, user.lastname, null, user.email, null)
            const banks = await getBanks(irisUser.userHash, null)
            const irisBank = banks.find(b => b.name.toLowerCase() === bank.toLowerCase())
            const registeredUser = await registerConsent(irisUser.userHash, irisBank.bankHash, user.firstname + " " + user.lastname, iban, null, null, null, null)
            res.json(registeredUser.startUrl)
        }
    }catch{
        res.status(500).json({ error: "Failed to set IBAN" });
    }
})

async function signupAgent(agentHash, companyName, uic, name, middleName, family, identityHash, email, webhookUrl) {
    const url = "https://developer.sandbox.irispay.bg/api/8/signup";
    
    const body = {
        agentHash,
        companyName: companyName || undefined,
        uic: uic !== null ? uic : undefined,
        name: name || undefined,
        middleName: middleName || undefined,
        family: family || undefined,
        identityHash: identityHash || undefined,
        email: email || undefined,
        webhookUrl: webhookUrl || undefined
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Signup request failed:", error);
        throw error;
    }
}

async function getBanks(userHash, country = "") {
    let url = "https://developer.sandbox.irispay.bg/api/8/banks";
    if (country) {
        url += `?country=${encodeURIComponent(country)}`;
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-user-hash": userHash,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Bank list request failed:", error);
        throw error;
    }
}

async function registerConsent(userHash, bankHash, username, iban, hookHash = null, sms = null, authorizationUrl = null, authorizationId = null) {
    const url = "https://developer.sandbox.irispay.bg/api/8/consent";
    
    const body = {
        bankHash,
        username,
        iban,
        hookHash: hookHash || undefined,
        sms: sms || undefined,
        authorizationUrl: authorizationUrl || undefined,
        authorizationId: authorizationId || undefined
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "x-user-hash": userHash,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.log("response: ", response)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Consent registration request failed:", error);
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});