"use strict";

const featuresContainer = document.getElementById("feature");
const productsContainer = document.querySelector(".pro-container");
const productsContainer2 = document.querySelector(".pro-container2");

// Features
const featureItems = [
  { idx: 1, text: "free shipping", bgColor: "fddde4" },
  { idx: 2, text: "online order", bgColor: "cdebbc" },
  { idx: 3, text: "safe money", bgColor: "d1e8f2" },
  { idx: 4, text: "promotions", bgColor: "cdd4f8" },
  { idx: 5, text: "happy sell", bgColor: "f6dbf6" },
  { idx: 6, text: "24/7 support", bgColor: "fff2e5" },
];

const generateFeatureBoxHTML = (imgNumber, text, bg) => {
  return `
         <div class="fa-box">
          <img src="./img/features/f${imgNumber}.png" alt="${text}">
          <h6 style="text-transform: capitalize; background-color: #${
            bg || "red"
          }">${text}</h6>
        </div>
  `;
};

const insertFeatures = () => {
  featureItems.map((element) => {
    const features = generateFeatureBoxHTML(
      element.idx,
      element.text,
      element.bgColor
    );
    featuresContainer.insertAdjacentHTML("beforeend", features);
  });
};

insertFeatures();

// Index Products
const generateStars = (stars) => {
  const filledStars = '<i class="fas fa-star"></i>'.repeat(stars);
  const emptyStars = '<i class="far fa-star"></i>'.repeat(5 - stars);
  return filledStars + emptyStars;
};

const generateProductHTML = (product) => {
  return `
          <div class="pro">
            <img src="${product.img}" alt="${product.name}">
            <div class="des">
              <span>${product.brand}</span>
              <h5>${product.name}</h5>
              <div class="star">
                ${generateStars(product.stars)}
              </div>
              <h4>$${product.price}</h4>
            </div>
            <a href=""><i class="fa fa-shopping-cart cart"></i></a>
          </div>
  `;
};

const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status || "404"}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching products:", err || "No Data");
    return null;
  }
};

const renderProducts = async () => {
  let skeletonHTML = "";
  for (let i = 0; i < 8; i++) {
    skeletonHTML += `
    <div class="skeleton">
      <div class="img-skeleton"></div>
      <div class="des-skeleton">
        <div class="brand-skeleton"></div>
        <div class="name-skeleton"></div>
        <div class="stars-skeleton"></div>
        <div class="price-skeleton"></div>
      </div>
    </div>
  `;
  }
  productsContainer.innerHTML = skeletonHTML;
  productsContainer2.innerHTML = skeletonHTML;

  const products = await fetchData("./products.json");

  if (!products) {
    productsContainer.innerHTML = `<p style="color:red;">Error loading products. Please try again.</p>`;
    productsContainer2.innerHTML = `<p style="color:red;">Error loading products. Please try again.</p>`;
    return;
  }

  setTimeout(() => {
    productsContainer.innerHTML = "";
    productsContainer2.innerHTML = "";

    const latestProducts = products.slice(0, 8);
    latestProducts.forEach((product) => {
      productsContainer.insertAdjacentHTML(
        "beforeend",
        generateProductHTML(product)
      );
    });
    const latestProducts2 = products.slice(8);
    latestProducts2.forEach((product) => {
      productsContainer2.insertAdjacentHTML(
        "beforeend",
        generateProductHTML(product)
      );
    });
  }, 2000);
};

renderProducts();
