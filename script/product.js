const productContainer = document.getElementById("product-details");
const params = new URLSearchParams(window.location.search);
const productIdParam = params.get("id");
const productId = parseInt(productIdParam);

const getRandomImgs = (numVariants, excludeFirst = false) => {
  const maxNumberImgs = 12;
  const usedNumbers = new Set();
  const variantImgs = [];

  while (variantImgs.length < numVariants) {
    const randomNumber = Math.floor(Math.random() * maxNumberImgs) + 1;
    if (!usedNumbers.has(randomNumber)) {
      usedNumbers.add(randomNumber);
      variantImgs.push(`./img/products/q (${randomNumber}).png`);
    }
  }

  return variantImgs;
};

const loadProduct = async () => {
  const products = await fetchData("./data/products.json");

  if (!products || !Array.isArray(products)) {
    productContainer.innerHTML = `<p>Error loading products</p>`;
    return;
  }

  if (isNaN(productId)) {
    productContainer.innerHTML = `
      <div class="product-404">
        <h2>Product Not Found</h2>
        <p>Sorry, the product ID "${productId}" is invalid.</p>
        <a href="shop.html" class="btn-back">Go Back to Shop</a>
      </div>
    `;
    return;
  }

  const product = products.find((p) => Number(p.id) === productId);

  if (!product) {
    productContainer.innerHTML = `
      <div class="product-404">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you’re looking for does not exist.</p>
        <a href="shop.html" class="btn-back">Go Back to Shop</a>
      </div>
    `;
    return;
  }

  const variantImgs = [product.img, ...getRandomImgs(product.variants.length - 1)];

productContainer.innerHTML = `
<div class="single-product-form ">
  <div class="product-images">
    <img src="${product.img}" alt="${product.name}" class="main-img" id="main-product-img">
    <div class="gallery">
      ${variantImgs.map(img => `<img src="${img}" class="gallery-img" data-img="${img}">`).join("")}
    </div>
  </div>

  <div class="product-info">
    <h2>${product.name}</h2>
    <p class="brand">Brand: ${product.brand}</p>
    <div class="stars">${"★".repeat(product.stars)}${"☆".repeat(5 - product.stars)}</div>
    <p class="price">$${product.price}</p>

    <div class="product-details">
      <h3>Product Details</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse 
        lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum 
        ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin 
        porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.
      </p>
    </div>

    <form id="add-to-cart-form">
      <div class="variant-selection">
        <p class="label">Size:</p>
        <div class="size-options">
          ${product.variants.map((v, i) => `
            <label class="size-circle">
              <input type="radio" name="size" value="${v.size}" ${i === 0 ? "checked" : ""}>
              <span>${v.size}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <div class="variant-selection">
        <p class="label">Color:</p>
        <div class="color-options">
          ${product.variants.map((v, i) => `
            <label class="color-circle" data-img="${i === 0 ? product.img : variantImgs[i - 1]}" >
              <input type="radio" name="color" value="${v.color}" ${i === 0 ? "checked" : ""}>
              <span style="background-color:${v.color};"></span>
            </label>
          `).join("")}
        </div>
      </div>

      <button type="submit" class="add-cart">Add to Cart</button>
    </form>
  </div>
</div>
`;



  const mainImg = document.getElementById("main-product-img");

  document.querySelectorAll(".color-circle input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const img = e.target.parentElement.getAttribute("data-img");
      mainImg.src = img;
    });
  });

  document.querySelectorAll(".gallery-img").forEach((img) => {
    img.addEventListener("click", () => {
      mainImg.src = img.dataset.img;
    });
  });

  const addToCartForm = document.getElementById("add-to-cart-form");
  addToCartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const size = addToCartForm.size.value;
    const color = addToCartForm.color.value;
    const quantity = Number(addToCartForm.quantity.value);
    const cartItem = { id: product.id, name: product.name, size, color, quantity, price: product.price };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} (${size}, ${color}) added to cart!`);
  });
};

loadProduct();
