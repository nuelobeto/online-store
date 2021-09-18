//grab elements
const productEl = document.querySelector('.products');
const cartEl = document.querySelector('.cart');
const cartItemsEl = document.querySelector('.cart-items');
const totalPriceEl = document.querySelector('.total');
const totalItemsEl = document.querySelector('.total-items');

//display cart
let cartState = false;

function showCart() {
  cartState = cartState ? false : true;
  if (cartState === true) {
    cartEl.style.display = 'block';
  }
  if (cartState === false) {
    cartEl.style.display = 'none';
  }
}

function renderProducts() {
  products.forEach((product) => {
    productEl.innerHTML += `
      <div class="product">
        <img src="${product.imgSrc}" alt="" />
        <p class="product-text">${product.name}</p>
        <p class="product-price"><span>$</span>${product.price}</p>
        <div class="overlay">
          <div class="opacity"></div>
          <span class="add-to-cart" onclick="addToCart(${product.id})">add to cart</span>
        </div>
      </div>
    `;
  })
}
renderProducts();

//cart array
let cart = JSON.parse(localStorage.getItem('CART')) || [];
updateCart();

function addToCart(id) {
  //check if product already exist in cart
  if (cart.some(product => product.id === id)) {
    updateQuantity('plus', id);
  } else {
    const item = products.find(product => product.id === id)
    cart.push({
      ...item,
      quantity: 1
    });
  }
  updateCart();
}

//update cart
function updateCart() {
  renderCartItems();
  renderSubTotal();
  //local storage
  localStorage.setItem('CART', JSON.stringify(cart));
}

//render subtotal
function renderSubTotal() {
  let totalPrice = 0,
    totalItems = 0;
  cart.forEach((product) => {
    totalPrice += product.price * product.quantity;
    totalItems += product.quantity;
  })
  totalPriceEl.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
  totalItemsEl.innerHTML = totalItems;
}

//render cart items
function renderCartItems() {
  cartItemsEl.innerHTML = '';
  cart.forEach((product) => {
    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <div class="image">
          <img src="${product.imgSrc}" alt="" />
        </div>
        <div class="title-price">
          <p class="text">${product.name}</p>
          <p class="price">$${product.price}</p>
          <div class="quantity">
            <button class="minus" onclick="updateQuantity('minus', ${product.id})">-</button>
            <input class="" type="number" value="${product.quantity}" />
            <button class="plus" onclick="updateQuantity('plus', ${product.id})">+</button>
          </div>
          <button class="removeItem" onclick="removeCartItem(${product.id})">Remove from cart</button>
        </div>
      </div>
    `;
  })
}

function updateQuantity(action, id) {
  cart = cart.map((product) => {
    let quantity = product.quantity;
    if (product.id === id) {
      if (action === 'minus' && quantity > 1) {
        quantity--;
      } else if (action === 'plus' && quantity < product.instock) {
        quantity++;
      }
    }
    return {
      ...product,
      quantity,
    };
  })
  updateCart();
}

function removeCartItem(id) {
  cart = cart.filter(product => product.id !== id)
  updateCart();
}