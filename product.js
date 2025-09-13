const productContainer = document.getElementById("product-details");
const params = new URLSearchParams(window.location.search);
const productIdParam = params.get("id");
const productId = parseInt(productIdParam);

const getRandomImgs = () => {
  const maxNumberImgs = 12;
  const productVar = 2;
  const randomImgs = [];
  const usedNumbers = new Set();

  while (randomImgs.length < productVar) {
    const randomNumber = Math.floor(Math.random() * maxNumberImgs) + 1;
    if (!usedNumbers.has(randomNumber)) {
      usedNumbers.add(randomNumber);
      randomImgs.push(`./img/products/q (${randomNumber}).png`);
    }
  }

  return randomImgs;
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

  const variantImgs = getRandomImgs(product.img);

  productContainer.innerHTML = `
<div class="single-product-form">
  <div class="product-images">
    <img src="${product.img}" alt="${
    product.name
  }" class="main-img" id="main-product-img">
    <div class="gallery">
      ${variantImgs
        .map(
          (img) => `<img src="${img}" class="gallery-img" data-img="${img}">`
        )
        .join("")}
    </div>
  </div>

  <div class="product-info">
    <h2>${product.name}</h2>
    <p class="brand">Brand: ${product.brand}</p>
    <div class="stars">${"★".repeat(product.stars)}${"☆".repeat(
    5 - product.stars
  )}</div>
    <p class="price">$${product.price}</p>

    <form id="add-to-cart-form">
      <div class="variant-selection">
        <p class="label">Size:</p>
        <div class="size-options">
          ${product.variants
            .map(
              (v, i) => `<label class="size-circle">
                <input type="radio" name="size" value="${v.size}" ${
                i === 0 ? "checked" : ""
              }>${v.size}
              </label>`
            )
            .join("")}
        </div>
      </div>

      <div class="variant-selection">
        <p class="label">Color:</p>
        <div class="color-options">
          ${product.variants
            .map(
              (v, i) => `<label class="color-circle" data-img="${
                variantImgs[i] || product.img
              }" style="background-color:${v.color};">
                <input type="radio" name="color" value="${v.color}" ${
                i === 0 ? "checked" : ""
              }>
              </label>`
            )
            .join("")}
        </div>
      </div>

      <div class="quantity-selection">
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" min="1" max="${
          product.quantity
        }" value="1">
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
};

loadProduct();

loadProduct();
