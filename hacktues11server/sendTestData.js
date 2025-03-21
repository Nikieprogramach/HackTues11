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