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
        orderID: 2094846,
        business: "LIDL",
        paymentMethod: "card",
        purchasedItems: [
            { name: "Баница със спанак", price: 1.29 },
            { name: "Вафла Морени", price: 1.50 }
        ],
        amount: 2.79
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
        orderID: 2094846,
        firstname: "Nikola",
        lastname: "Aleksov",
        cardnums: "8464",
        amount: 2.79
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