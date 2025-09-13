const cartFile = "./data/cart.json"; 

const addToCart = async (e) => {
  e.preventDefault();

  const size = document.querySelector('input[name="size"]:checked').value;
  const color = document.querySelector('input[name="color"]:checked').value;
  const quantity = parseInt(document.querySelector('#quantity').value);

  const productToAdd = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    size,
    color,
    quantity
  };

  try {
    let cart = await fetch(cartFile).then(r => r.json()).catch(() => []);

    cart.push(productToAdd);

    console.log("Updated cart:", cart);
    alert(`${productToAdd.name} added to cart!`);

  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

document.getElementById("add-to-cart-form").addEventListener("submit", addToCart);
