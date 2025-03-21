const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt')

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

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("password", salt);

        const exampleData = {
            firstname: 'Gabriel',
            lastname: 'Petrov',
            email: "gabriel.petrov@gmail.com",
            password: hash,
            privileges: 'admin',
        };

        const insertQuery = ` 
            INSERT INTO users (
                firstname, lastname, email, password, privileges
            ) VALUES ($1, $2, $3, $4, $5)
        ;`

        const values = [
            exampleData.firstname,
            exampleData.lastname,
            exampleData.email,
            exampleData.password,
            exampleData.privileges,
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