const products = [
  { name: "Headphone Studio Pro", category: "Audio", price: 899000, badge: "Baru", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85" },
  { name: "Sneakers Urban 01", category: "Fashion", price: 749000, badge: "Populer", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85" },
  { name: "Smartwatch Pulse", category: "Elektronik", price: 1299000, badge: "Baru", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85" },
  { name: "Kamera Retro X", category: "Elektronik", price: 3499000, badge: "Eksklusif", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=700&q=85" },
  { name: "Tas Totebag Leather", category: "Fashion", price: 459000, badge: "Baru", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85" },
  { name: "Kacamata Classic", category: "Fashion", price: 289000, badge: "Favorit", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85" },
  { name: "Sepatu Trail 2026", category: "Olahraga", price: 1099000, badge: "Baru", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" },
  { name: "Speaker Portable", category: "Audio", price: 649000, badge: "Populer", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=85" }
];

const grid = document.getElementById("productGrid");
const cart = [];

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function renderProducts(items) {
  grid.innerHTML = items.map((product, index) => `
    <article class="product-card" data-category="${product.category}">
      <div class="product-image">
        <span class="product-badge">${product.badge}</span>
        <button class="favorite-button" aria-label="Simpan ${product.name}" data-favorite="${index}">♡</button>
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-meta">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="product-bottom">
          <strong>${formatRupiah(product.price)}</strong>
          <button class="product-add" data-add="${product.name}" aria-label="Tambah ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

renderProducts(products);

function addToCart(name) {
  const product = products.find(item => item.name === name) || { name, price: 1499000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85" };
  cart.push(product);
  document.getElementById("cartCount").textContent = cart.length;
  renderCart();

  const toast = document.getElementById("toast");
  toast.textContent = `${product.name} ditambahkan`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cartTotal").textContent = formatRupiah(total);

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="" />
      <div><strong>${item.name}</strong><span>${formatRupiah(item.price)}</span></div>
      <button class="cart-remove" data-remove="${index}" aria-label="Hapus ${item.name}">×</button>
    </div>
  `).join("");
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    favoriteButton.classList.toggle("saved");
    favoriteButton.textContent = favoriteButton.classList.contains("saved") ? "♥" : "♡";
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart.splice(Number(removeButton.dataset.remove), 1);
    document.getElementById("cartCount").textContent = cart.length;
    renderCart();
  }
});

const drawer = document.getElementById("cartDrawer");
function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

document.getElementById("searchButton").addEventListener("click", applySearch);
document.getElementById("searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") applySearch();
});
document.querySelectorAll("[data-search]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("searchInput").value = button.dataset.search;
    applySearch();
  });
});

function applySearch() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(product =>
    !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
  document.getElementById("produk").scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll(".category-card[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-card[data-category]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.category;
    renderProducts(category === "Semua" ? products : products.filter(product => product.category === category));
  });
});

document.getElementById("showAll").addEventListener("click", () => renderProducts(products));
document.getElementById("promoButton").addEventListener("click", () => document.getElementById("produk").scrollIntoView({ behavior: "smooth" }));
document.getElementById("themeButton").addEventListener("click", () => document.body.classList.toggle("dark"));
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) return;
  const toast = document.getElementById("toast");
  toast.textContent = "Checkout berhasil! Demo marketplace.";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
});
