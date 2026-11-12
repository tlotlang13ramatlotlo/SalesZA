const stores = ["Checkers", "Pick n Pay", "Woolworths"];

const products = [
  { id: "milk", name: "Full Cream Milk", detail: "2L · Fresh dairy", category: "Dairy", emoji: "🥛", prices: [34.99, 36.99, 39.99] },
  { id: "bread", name: "White Sliced Bread", detail: "700g · Bakery fresh", category: "Bakery", emoji: "🍞", prices: [17.99, 18.99, 21.99] },
  { id: "eggs", name: "Large Free Range Eggs", detail: "18 pack · Large", category: "Dairy", emoji: "🥚", prices: [64.99, 69.99, 74.99] },
  { id: "coffee", name: "Rich Roast Coffee", detail: "200g · Instant", category: "Pantry", emoji: "☕", prices: [89.99, 94.99, 99.99] },
  { id: "bananas", name: "Bananas", detail: "Per kg · Loose", category: "Produce", emoji: "🍌", prices: [19.99, 22.99, 24.99] },
  { id: "rice", name: "Long Grain Rice", detail: "2kg · White rice", category: "Pantry", emoji: "🍚", prices: [39.99, 44.99, 49.99] },
  { id: "tomatoes", name: "Tomatoes", detail: "Per kg · Fresh produce", category: "Produce", emoji: "🍅", prices: [24.99, 29.99, 34.99] },
  { id: "washing", name: "Laundry Detergent", detail: "2L · Concentrated", category: "Household", emoji: "🧺", prices: [79.99, 84.99, 94.99] },
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const basketCount = document.querySelector("#basket-count");
const toast = document.querySelector("#toast");
const basket = new Set();
let activeCategory = "All";
let toastTimer;

const money = (amount) => new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 2,
}).format(amount).replace(/\u00a0/g, " ");

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const visibleProducts = products
    .filter((product) => activeCategory === "All" || product.category === activeCategory)
    .filter((product) => `${product.name} ${product.detail} ${product.category}`.toLocaleLowerCase().includes(query))
    .sort((a, b) => {
      if (sortSelect.value === "name") return a.name.localeCompare(b.name);
      if (sortSelect.value === "price-low") return Math.min(...a.prices) - Math.min(...b.prices);
      return (b.prices[2] - Math.min(...b.prices)) - (a.prices[2] - Math.min(...a.prices));
    });

  resultsCount.innerHTML = `${query || activeCategory !== "All" ? "Matching groceries" : "Popular picks"} <span>· ${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"}</span>`;
  productGrid.hidden = visibleProducts.length === 0;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.innerHTML = visibleProducts.map((product) => {
    const lowestPrice = Math.min(...product.prices);
    const saving = Math.max(...product.prices) - lowestPrice;
    const inBasket = basket.has(product.id);
    const priceOptions = product.prices.map((price, index) => {
      const isBest = price === lowestPrice;
      return `<div class="store-price${isBest ? " best" : ""}">
        <span class="store-name">${stores[index]}</span>
        <span class="price-value">${money(price)}</span>
        ${isBest ? '<span class="best-tag">BEST PRICE</span>' : ""}
      </div>`;
    }).join("");

    return `<article class="product-card">
      <div class="product-top">
        <div class="product-image" aria-hidden="true">${product.emoji}</div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h4 class="product-name">${product.name}</h4>
          <p class="product-detail">${product.detail}</p>
        </div>
        <span class="product-savings">Save ${money(saving)}</span>
      </div>
      <div class="price-row" aria-label="Sample prices">${priceOptions}</div>
      <div class="card-bottom">
        <span class="price-note">Illustrative sample prices</span>
        <button class="add-button${inBasket ? " added" : ""}" type="button" data-product="${product.id}" aria-pressed="${inBasket}">
          <span aria-hidden="true">${inBasket ? "✓" : "+"}</span>${inBasket ? "Added" : "Add to basket"}
        </button>
      </div>
    </article>`;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelector("#category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product]");
  if (!button) return;
  const productId = button.dataset.product;
  if (basket.has(productId)) {
    basket.delete(productId);
  } else {
    basket.add(productId);
  }
  basketCount.textContent = basket.size;
  renderProducts();
  const product = products.find((item) => item.id === productId);
  showToast(basket.has(productId) ? `${product.name} added to your basket` : `${product.name} removed from your basket`);
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "All";
  document.querySelectorAll(".category-chip").forEach((chip) => {
    const isActive = chip.dataset.category === "All";
    chip.classList.toggle("active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
  searchInput.focus();
});

document.querySelector("#basket-button").addEventListener("click", () => {
  const total = [...basket].reduce((sum, id) => {
    const product = products.find((item) => item.id === id);
    return sum + Math.min(...product.prices);
  }, 0);
  showToast(basket.size ? `${basket.size} item${basket.size === 1 ? "" : "s"} · best-price total ${money(total)}` : "Your basket is empty — add a few favourites.");
});

document.querySelector("#location-select").addEventListener("change", (event) => {
  showToast(`Area set to ${event.target.value}. Sample prices remain illustrative.`);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    renderProducts();
    searchInput.blur();
  }
});

document.querySelectorAll(".category-chip").forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.category === "All")));
renderProducts();
