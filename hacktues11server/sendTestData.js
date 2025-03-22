const GRPCClient = require('napi-grpc-lib')

const client = new GRPCClient("localhost:50051");

client.queryOrder({
    orderID: 2342344,
    business: "Elimex",
    paymentMethod: "card",
    purchasedItems: [
        { name: "Resistor 220ohm", price: 0.80 },
        { name: "Stepper motor", price: 25.99 }
    ],
    amount: 26.79
}).then(response => console.log(response))
  .catch(error => console.error(error));

client.queryPayment({
    orderID: 2342344,
    firstname: "Nikola",
    lastname: "Aleksov",
    cardnums: "8475",
    amount: 26.79
}).then(response => console.log(response))
  .catch(error => console.error(error));