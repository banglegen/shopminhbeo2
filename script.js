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


if (document.getElementById("order-btn")) {
  document.getElementById("order-btn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        cart = [];
        saveCart();
        updateCartUI();
      })
      .catch(err => {
        console.error(err);
        alert("Có lỗi khi gửi đơn hàng!");
      });
  });
}


updateCartUI();
