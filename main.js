const cart = [];

//Chargement des produits depuis un fichier JSON
fetch("./data.json")
  .then((res) => res.json())
  .then((products) => {
    const productList = document.getElementById("product-list");
    products.forEach((product) => {
      const card = createProductCard(product);
      productList.appendChild(card);
    });
  })
  .catch((err) => console.error("Erreur chargement produits :", err));

// Création de la carte produit :

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("card");

  card.innerHTML = `
    <div class="card-image-container">
      <picture>
        <source media="(min-width:1440px)" srcset="${product.image.desktop}">
        <source media="(min-width:768px)" srcset="${product.image.tablet}">
        <source media="(min-width:375px)" srcset="${product.image.mobile}">
        <img src="${product.image.thumbnail}" alt="${
    product.name
  }" class="card-image">
      </picture>
      <button class="add-to-cart-btn">
        <img src="./assets/images/icon-add-to-cart.svg" alt="icon add to cart">
        Add to Cart
      </button>
    </div>
    <header class="card-header">
      <p class="card-category">${product.category}</p>
      <h4 class="card-title">${product.name}</h4>
    </header>
    <footer class="card-footer">
      <p class="card-price">$${product.price.toFixed(2)}</p>
    </footer>
  `;

  const button = card.querySelector(".add-to-cart-btn");
  const imageContainer = card.querySelector(".card-image-container");

  button.addEventListener("click", () => {
    // Empêche d'ajouter plusieurs compteurs si déjà actif
    if (imageContainer.querySelector(".counter-container")) return;

    imageContainer.classList.add("active-border");

    const counterContainer = document.createElement("div");
    counterContainer.classList.add("counter-container");

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("counter-btn");
    minusBtn.innerHTML = `<img src="./assets/images/icon-decrement-quantity.svg" class="counter-icon" alt="Moins">`;

    const countDisplay = document.createElement("span");
    countDisplay.classList.add("counter-number");
    countDisplay.textContent = "1";

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("counter-btn");
    plusBtn.innerHTML = `<img src="./assets/images/icon-increment-quantity.svg" class="counter-icon" alt="Plus">`;

    counterContainer.append(minusBtn, countDisplay, plusBtn);
    button.replaceWith(counterContainer);

    let count = 1;
    addProductToCart(product, count); // Ajout initial au panier

    plusBtn.addEventListener("click", () => {
      count++;
      countDisplay.textContent = count;
      updateProductQuantity(product.name, count);
    });

    minusBtn.addEventListener("click", () => {
      count--;
      if (count <= 0) {
        removeFromCart(product.name);
        counterContainer.replaceWith(button);
        imageContainer.classList.remove("active-border");
      } else {
        countDisplay.textContent = count;
        updateProductQuantity(product.name, count);
      }
    });
  });

  return card;
}

function addProductToCart(product, quantity) {
  const existing = cart.find((item) => item.name === product.name);
  if (existing) {
    existing.quantity = quantity;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      quantity,
    });
  }
  updateCartUI();
}

function updateProductQuantity(productName, newQty) {
  const item = cart.find((p) => p.name === productName);
  if (item) {
    item.quantity = newQty;
  }
  updateCartUI();
}

function removeFromCart(productName) {
  const index = cart.findIndex((p) => p.name === productName);
  if (index !== -1) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.querySelector(".cart");
  if (!cartContainer) return;

  cartContainer.innerHTML = `
    <h2>Cart</h2>
    ${
      cart.length === 0
        ? "<p>Your cart is empty</p>"
        : cart
            .map(
              (item) => `
        <div class="cart-item">
          <span>${item.name} x ${item.quantity}</span>
          <span>$${(item.quantity * item.price).toFixed(2)}</span>
        </div>`
            )
            .join("")
    }
  `;
}
