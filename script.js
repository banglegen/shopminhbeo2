// ---------------- GIỎ HÀNG ----------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  let item = cart.find(p => p.name === name);
  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartUI();
}

function increaseQuantity(name) {
  let item = cart.find(p => p.name === name);
  if (item) item.quantity++;
  saveCart();
  updateCartUI();
}

function decreaseQuantity(name) {
  let item = cart.find(p => p.name === name);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(p => p.name !== name);
    }
  }
  saveCart();
  updateCartUI();
}

function removeItem(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  let cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);
  let total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  if (document.getElementById("cart-count")) {
    document.getElementById("cart-count").textContent = cartCount;
  }

  if (document.getElementById("cart-list")) {
    let cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";
    cart.forEach(item => {
      let li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `
        <span>${item.name} - ${item.price.toLocaleString()}đ x ${item.quantity}</span>
        <div class="cart-controls">
          <button onclick="decreaseQuantity('${item.name}')">➖</button>
          <button onclick="increaseQuantity('${item.name}')">➕</button>
          <button onclick="removeItem('${item.name}')">❌</button>
        </div>
      `;
      cartList.appendChild(li);
    });
  }

  if (document.getElementById("cart-total")) {
    document.getElementById("cart-total").textContent = total.toLocaleString();
  }
}

// ---------------- ĐẶT HÀNG ----------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("order-form")) {
    let orderList = document.getElementById("order-list");
    let orderTotal = document.getElementById("order-total");

    let total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    cart.forEach(item => {
      let li = document.createElement("li");
      li.textContent = `${item.name} - ${item.price.toLocaleString()}đ x ${item.quantity}`;
      orderList.appendChild(li);
    });
    orderTotal.textContent = total.toLocaleString();

    document.getElementById("order-form").addEventListener("submit", function (e) {
      e.preventDefault();

      let name = document.getElementById("customer-name").value.trim();
      let phone = document.getElementById("customer-phone").value.trim();
      let address = document.getElementById("customer-address").value.trim();
      let payment = document.getElementById("customer-payment").value;

      if (!name || !phone || !address) {
        showToast("❌ Vui lòng nhập đầy đủ thông tin!");
        return;
      }

      let order = {
        id: Date.now(),
        customer: { name, phone, address, payment },
        items: cart,
        total,
        date: new Date().toLocaleString()
      };

      let orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      showToast("🎉 Đặt hàng thành công!");

      localStorage.removeItem("cart");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  updateCartUI();
});

// ---------------- TOAST ----------------
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
