const cartSection = document.getElementById("cart");

const addToCart = (e) => {
  e.preventDefault();

  const productId = parseInt(new URLSearchParams(window.location.search).get("id"));
  const container = document.querySelector(".single-product-form");
  if (!container) return;

  const name = container.querySelector("h2").innerText;
  const price = parseFloat(container.querySelector(".price").innerText.replace("$",""));
  const brand = container.querySelector(".brand").innerText.replace("Brand: ","");
  const size = container.querySelector('input[name="size"]:checked').value;
  const color = container.querySelector('input[name="color"]:checked').value;

  const cartItem = { id: productId, name, brand, price, size, color, quantity: 1 };
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${name} (${size}, ${color}) added to cart!`);
  loadCart();
};

const loadCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!cart.length) {
    cartSection.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    return;
  }

  const cartHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-left">
        <img src="./img/products/q (${item.id}).png" alt="${item.name}" class="cart-item-img">
      </div>
      <div class="cart-item-middle">
        <h3 class="cart-item-name">${item.name}</h3>
        <p class="cart-item-size">Size: ${item.size}</p>
        <p class="cart-item-color">Color: <span class="color-circle" style="background-color:${item.color}"></span></p>
        <p class="cart-item-price">Price: $${item.price}</p>
      </div>
      <div class="cart-item-right">
        <button class="remove-item" data-index="${i}">Remove</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartSection.innerHTML = `
    <h2 class="cart-title">Your Cart (${cart.length} items)</h2>
    <div class="cart-items-container">${cartHTML}</div>
    <div class="cart-total"><h3>Total: $${total}</h3></div>
  `;

  document.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", (e) => {
      cart.splice(e.target.dataset.index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });
};

document.addEventListener("submit", (e) => {
  if (e.target.id === "add-to-cart-form") addToCart(e);
});

document.addEventListener("DOMContentLoaded", loadCart);
