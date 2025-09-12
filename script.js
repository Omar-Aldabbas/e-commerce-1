"use strict";

const featuresContainer = document.getElementById("feature");
const productsContainer = document.querySelector(".pro-container");
const productsContainer2 = document.querySelector(".pro-container2");
const shopContainer = document.querySelector(".shop-container");
const bar = document.getElementById("bar");
const navbar = document.getElementById("navbar");
const closeBtn = document.getElementById("close");
const paginationEl = document.getElementById("pagination");

console.log(shopContainer);
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
  if (!featuresContainer) return;
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

  if (productsContainer) productsContainer.innerHTML = skeletonHTML;
  if (productsContainer2) productsContainer2.innerHTML = skeletonHTML;
  // if (shopContainer) shopContainer.innerHTML = skeletonHTML;

  const products = await fetchData("./products.json");

  if (!products) {
    if (productsContainer)
      productsContainer.innerHTML = `<p style="color:red;">Error loading products. Please try again.</p>`;
    if (productsContainer2)
      productsContainer2.innerHTML = `<p style="color:red;">Error loading products. Please try again.</p>`;
    // if (shopContainer) shopContainer.innerHTML = `<p style="color:red;">Error loading products. Please try again.</p>`;
    return;
  }

  setTimeout(() => {
    if (productsContainer) {
      productsContainer.innerHTML = "";
      products
        .slice(0, 8)
        .forEach((product) =>
          productsContainer.insertAdjacentHTML(
            "beforeend",
            generateProductHTML(product)
          )
        );
    }

    if (productsContainer2) {
      productsContainer2.innerHTML = "";
      products
        .slice(8)
        .forEach((product) =>
          productsContainer2.insertAdjacentHTML(
            "beforeend",
            generateProductHTML(product)
          )
        );
    }

    // if (shopContainer) {
    //   shopContainer.innerHTML = "";
    //   products.forEach(product => shopContainer.insertAdjacentHTML("beforeend", generateProductHTML(product)));
    // }
  }, 2000);
};

renderProducts();

//  menu

function toggleNavbar(show) {
  if (show) {
    navbar.classList.add("active");
    document.addEventListener("click", handleOutsideClick);
  } else {
    navbar.classList.remove("active");
    document.removeEventListener("click", handleOutsideClick);
  }
}

function handleOutsideClick(e) {
  if (!navbar.contains(e.target) && !bar.contains(e.target)) {
    toggleNavbar(false);
  }
}

if (bar) {
  bar.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNavbar(true);
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => toggleNavbar(false));
}

// Fake Pagenation
const renderShopWithPagination = async () => {
  const productsPerPage = 12;
  let currentPage = 1;
  let shopProducts = [];

  try {
    if (!shopContainer) return;
    shopContainer.innerHTML = Array(productsPerPage)
      .fill(0)
      .map(
        () => `
        <div class="skeleton">
          <div class="img-skeleton"></div>
          <div class="des-skeleton">
            <div class="brand-skeleton"></div>
            <div class="name-skeleton"></div>
            <div class="stars-skeleton"></div>
            <div class="price-skeleton"></div>
          </div>
        </div>
      `
      )
      .join("");

    const res = await new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const data = await fetch("./products.json");
          if (!data.ok) throw new Error("Failed to fetch products");
          resolve(await data.json());
        } catch (err) {
          reject(err);
        }
      }, 1500);
    });

    shopProducts = res;

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = shopProducts.slice(start, end);

    shopContainer.innerHTML = "";
    paginatedProducts.forEach((product) => {
      shopContainer.insertAdjacentHTML(
        "beforeend",
        generateProductHTML(product)
      );
    });

    const totalPages = Math.ceil(shopProducts.length / productsPerPage);
    let paginationHTML = `
      <div class="pagination">
      <span class="page-info">${currentPage} of ${totalPages}</span>
        <button class="prev" ${currentPage === 1 ? "disabled" : ""}>
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="next" ${currentPage === totalPages ? "disabled" : ""}>
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      `;
    if (!paginationEl) {
      shopContainer.insertAdjacentHTML("afterend", paginationHTML);
      paginationEl = document.querySelector(".pagination");
    } else {
      paginationEl.innerHTML = paginationHTML;
    }

    paginationEl.addEventListener("click", (e) => {
      if (e.target.closest(".page-btn")) {
        currentPage = Number(e.target.closest(".page-btn").dataset.page);
        renderShopWithPagination();
      } else if (e.target.closest(".prev") && currentPage > 1) {
        currentPage--;
        renderShopWithPagination();
      } else if (e.target.closest(".next") && currentPage < totalPages) {
        currentPage++;
        renderShopWithPagination();
      }
    });
  } catch (err) {
    if (shopContainer)
      shopContainer.innerHTML = `<p style="color:red;">${err}</p>`;
  }
};

renderShopWithPagination();
