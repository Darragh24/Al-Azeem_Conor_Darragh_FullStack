class CartItem {
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

// store an item in the shopping cart
let shoppingCart = [];

// add an item to the shopping cart
function addToCart(name, price, quantity) {
    let newItem = new CartItem(name, price, quantity);
    shoppingCart.push(newItem);
}

// display what's in the shopping cart
console.log(shoppingCart);

/* export default class shoppingCart extends Component {

} */
