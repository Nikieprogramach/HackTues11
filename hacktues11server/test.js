order = [{name: "Fuzetea", price: 2.40}, {name: "Fuzetea", price: 2.40}]

const itemsString = order.map(item => `${item.name}: ${item.price}`).join(", ");

console.log(itemsString); 