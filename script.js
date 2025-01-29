import products from "./productsDB.js";
const items = document.querySelector(".items");
const cartItems = document.querySelector(".cartItems");
const cartTotal = document.querySelector(".price");
const cart = [];
products.forEach((product) => {
  const item = CreateItem(product);
  items.appendChild(item);
});

cartItems.addEventListener("drop", dropped);
cartItems.addEventListener("dragenter", enterDrag);
cartItems.addEventListener("dragover", overDrag);
cartItems.addEventListener("dragleave", leaveDrag);

items.addEventListener("drop", dropped);
items.addEventListener("dragenter", enterDrag);
items.addEventListener("dragover", overDrag);
items.addEventListener("dragleave", leaveDrag);
function startDrag(e) {
  e.dataTransfer.setData("product-id", e.target.getAttribute("data-id"));
  e.dataTransfer.setData("source", `${e.target.parentElement.className}`);
  e.target.classList.add("dragging");
}
function endDrag(e) {
  e.target.classList.remove("dragging");
  e.preventDefault();
}
function dropped(e) {
  e.preventDefault();
  e.target.classList.remove("dragOver");
  const productId = e.dataTransfer.getData("product-id");
  const source = e.dataTransfer.getData("source");
  if (source === e.target.closest(`.items, .cartItems`).className) return;
  const product = products.find((product) => product.id === +productId);
  const cartProduct = cart.find((cartProduct) => cartProduct.id === +productId);
  if (source === "items") {
    if (cartProduct) {
      cartProduct.stock++;
    } else {
      cart.push({ ...product, stock: 1 });
    }
    product.stock--;
    cartTotal.textContent = (+cartTotal.textContent + product.price).toFixed(2);
  }
  if (source === "cartItems") {
    cartProduct.stock--;
    product.stock++;
    cartTotal.textContent = (+cartTotal.textContent - product.price).toFixed(2);
    if (cartProduct.stock === 0) {
      cart.splice(cart.indexOf(cartProduct), 1);
    }
  }
  renderItems(cartItems, cart);
  renderItems(items, products);
}
function overDrag(e) {
  e.preventDefault();
}
function enterDrag(e) {
  e.target.classList.add("dragOver");
  e.preventDefault();
}
function leaveDrag(e) {
  e.target.classList.remove("dragOver");
  e.preventDefault();
}
function CreateItem(product) {
  const item = document.createElement("div");
  if (product.stock === 0) {
    item.style.opacity = 0.3;
    item.setAttribute("draggable", "false");
  } else item.setAttribute("draggable", "true");
  item.setAttribute("data-id", product.id);
  item.innerHTML = `
    <span><img draggable="false" src="${product.image}" alt="${product.name}"></span>
    <div>
    <p>${product.name}</p>
    <div>
    <p>$${product.price}</p>
    <p3>Quantity: ${product.stock}</p3>
    </div>
    </div>
  `;
  item.addEventListener("dragstart", startDrag);
  item.addEventListener("dragend", endDrag);
  return item;
}

function renderItems(parentElement, products) {
  parentElement.innerHTML = "";
  products.forEach((product) => {
    const item = CreateItem(product);
    parentElement.appendChild(item);
  });
  if (
    parentElement.className === "cartItems" &&
    parentElement.innerHTML.trim() === ""
  ) {
    parentElement.innerHTML = "<h2>Drag items here to add them to cart</h2>";
  }
}
