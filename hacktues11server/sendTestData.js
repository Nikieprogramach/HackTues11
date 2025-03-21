// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const PROTO_PATH = "./packets.proto";

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true,
// });

// const packets = grpc.loadPackageDefinition(packageDefinition).packets;
// const client = new packets.PacketAPI("localhost:50051", grpc.credentials.createInsecure());

// function testOrder() {
//     const order = {
//         orderID: 2342344,
//         business: "LIDL",
//         paymentMethod: "card",
//         purchasedItems: [
//             { name: "Сирене", price: 10.37 },
//             { name: "Вафла Морени", price: 1.50 }
//         ],
//         amount: 11.87
//     };
    
//     client.QueryOrder(order, (error, response) => {
//         if (error) {
//             console.error("Error in QueryOrder:", error);
//         } else {
//             console.log("QueryOrder response:", response);
//         }
//     });
// }

// function testPayment() {
//     const payment = {
//         orderID: 2342344,
//         firstname: "Nikola",
//         lastname: "Aleksov",
//         cardnums: "8475",
//         amount: 11.87
//     };
    
//     client.QueryPayment(payment, (error, response) => {
//         if (error) {
//             console.error("Error in QueryPayment:", error);
//         } else {
//             console.log("QueryPayment response:", response);
//         }
//     });
// }

// testOrder();
// setTimeout(testPayment, 2000);

const GRPCClient = require('napi-grpc-lib')

const client = new GRPCClient("localhost:50051");

client.queryOrder({
    orderID: 2342344,
    business: "LIDL",
    paymentMethod: "card",
    purchasedItems: [
        { name: "Кашкавал", price: 10.37 },
        { name: "Вафла Морени", price: 1.50 }
    ],
    amount: 11.87
}).then(response => console.log(response))
  .catch(error => console.error(error));

client.queryPayment({
    orderID: 2342344,
    firstname: "Nikola",
    lastname: "Aleksov",
    cardnums: "8475",
    amount: 11.87
}).then(response => console.log(response))
  .catch(error => console.error(error));