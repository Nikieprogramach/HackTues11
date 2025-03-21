const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Pool } = require('pg');
require('dotenv').config();

const PROTO_PATH = './packets.proto'

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

async function QueryOrderHandler(call, callback){
    const { orderID, business, paymentMethod, purchasedItems, amount } = call.request;
    console.log(purchasedItems)
    var purchasedItemsString = purchasedItems.map(item => `${item.name}: ${item.price.toFixed(2)}`).join(", ");
    try{
        query = `SELECT * FROM unconformedpayments WHERE orderid = $1` 
        values = [orderID]
        const result = await pool.query(query, values)
        if (result.rows.length > 0) {
            row = result.rows[0]
            query = `INSERT INTO conformedpurchases (orderid, business, purchaseditems, firstname, lastname, cardnumbers, paymentmethod, amount, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`
            values = [orderID, business, purchasedItemsString, row.firstname, row.lastname, row.cardnums, paymentMethod, amount]
            await pool.query(query, values);
            await pool.query(`DELETE FROM unconformedpayments WHERE orderid = ${orderID}`);
        }else{
            console.log("method of payment:", paymentMethod)
            if(paymentMethod === "cash"){
                var values = [orderID, business, purchasedItemsString, paymentMethod, amount]
                 query = `INSERT INTO conformedpurchases (orderid, business, purchaseditems, paymentmethod, amount) VALUES ($1, $2, $3, $4, $5)`
                await pool.query(query, values);
            }else if(paymentMethod === "card" || paymentMethod === "online"){
                var values = [orderID, business, purchasedItemsString, paymentMethod]
                query = `INSERT INTO unconformedpurchases (orderid, business, purchaseditems, paymentmethod) VALUES ($1, $2, $3, $4)`
                await pool.query(query, values);
            }else{
                console.log("blqt")
            }
        }
    }catch(err){
        console.log(err)
        const response = { status: "Error" };
        return callback(null, response);
    }       
    const response = { status: "Payment processed successfully" };
    return callback(null, response);
}

async function QueryPaymentHandler(call, callback){
    const { orderID, firstname, lastname, cardnums, amount } = call.request;
    try{
        query = `SELECT * FROM unconformedpurchases WHERE orderid = $1` 
        values = [orderID]
        const result = await pool.query(query, values)
        if (result.rows.length > 0) {
            row = result.rows[0]
            query = `INSERT INTO conformedpurchases (orderid, business, purchaseditems, firstname, lastname, cardnumbers, paymentmethod, amount, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)`
            values = [orderID, row.business, row.purchaseditems, firstname, lastname, cardnums, row.paymentmethod, amount]
            await pool.query(query, values);
            await pool.query(`DELETE FROM unconformedpurchases WHERE orderid = ${orderID}`);
        }else{
            console.log("Order not found")
            var values = [orderID, firstname, lastname, cardnums, amount]
            query = `INSERT INTO unconformedpayments (orderid, firstname, lastname, cardnums, amount) VALUES ($1, $2, $3, $4, $5)`
            await pool.query(query, values);
        }
    }catch(err){
        console.log(err)
        const response = { status: "Error" };
        return callback(null, response);
    }
    const response = { status: "Payment processed successfully" };
    return callback(null, response);
}
  
const packets = grpc.loadPackageDefinition(packageDefinition);
const Server = new grpc.Server();
const PacketAPI = packets.packets.PacketAPI
Server.addService(PacketAPI.service, { 
    QueryOrder: QueryOrderHandler, 
    QueryPayment: QueryPaymentHandler,
})

Server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("gRPC Server running at http://localhost:50051");
});
