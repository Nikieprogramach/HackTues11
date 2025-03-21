const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./packets.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const packets = grpc.loadPackageDefinition(packageDefinition).packets;
const client = new packets.PacketAPI("localhost:50051", grpc.credentials.createInsecure());

function testOrder() {
    const order = {
        orderID: 12345,
        business: "Test Business",
        paymentMethod: "card",
        purchasedItems: [
            { name: "Item1", price: 10.0 },
            { name: "Item2", price: 20.0 }
        ],
        amount: 30.0
    };
    
    client.QueryOrder(order, (error, response) => {
        if (error) {
            console.error("Error in QueryOrder:", error);
        } else {
            console.log("QueryOrder response:", response);
        }
    });
}

function testPayment() {
    const payment = {
        orderID: 12345,
        firstname: "Nikola",
        lastname: "Aleksov",
        cardnums: "1346",
        amount: 30.0
    };
    
    client.QueryPayment(payment, (error, response) => {
        if (error) {
            console.error("Error in QueryPayment:", error);
        } else {
            console.log("QueryPayment response:", response);
        }
    });
}

testOrder();
setTimeout(testPayment, 2000);