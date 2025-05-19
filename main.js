const cart = [];
updateCartUI();

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
  <!-- Grand écran (desktop) -->
  <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
  
  <!-- Tablette -->
  <source media="(min-width: 768px)" srcset="${product.image.tablet}">
  
  <!-- Mobile -->
  <source media="(min-width: 480px)" srcset="${product.image.mobile}">
  
  <!-- Fallback thumbnail (par défaut pour petits écrans ou si source échoue) -->
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

  cartContainer.innerHTML = ""; // Vide le contenu

  // Calculer le nombre total d'items dans le panier
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const title = document.createElement("h2");
  title.classList.add("cart-title");

  title.textContent = `Your Cart (${totalItems})`;

  cartContainer.appendChild(title);

  if (cart.length === 0) {
    // Crée l'image et le message panier vide
    const emptyImage = document.createElement("img");
    emptyImage.src = "./assets/images/illustration-empty-cart.svg";
    emptyImage.alt = "Empty cart";
    emptyImage.classList.add("empty-cart-image");

    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "Your added items will appear here";
    emptyMsg.classList.add("empty-cart-message");

    cartContainer.appendChild(emptyImage);
    cartContainer.appendChild(emptyMsg);

    return;
  }

  cart.forEach((item) => {
    // Conteneur de l’article
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    // Première ligne : nom + icône de suppression
    const line1 = document.createElement("div");
    line1.classList.add("cart-line");

    const name = document.createElement("span");
    name.textContent = item.name;

    const removeBtn = document.createElement("img");
    removeBtn.src = "./assets/images/icon-remove-item.svg";
    removeBtn.alt = "remove item";
    removeBtn.classList.add("remove-item");

    // Action de suppression
    removeBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        updateCartUI();

        // Mettre à jour aussi le compteur dans la carte produit (si visible)
        const countDisplays = document.querySelectorAll(".counter-number");
        countDisplays.forEach((span) => {
          const cardTitle = span
            .closest(".card")
            .querySelector(".card-title").textContent;
          if (cardTitle === item.name) {
            span.textContent = item.quantity;
          }
        });
      } else {
        removeFromCart(item.name);
      }
    });

    line1.appendChild(name);
    line1.appendChild(removeBtn);

    // Deuxième ligne : quantité × prix unitaire = total
    const line2 = document.createElement("div");
    line2.classList.add("cart-line-second");

    const quantitySpan = document.createElement("span");
    quantitySpan.textContent = `x${item.quantity}`;
    quantitySpan.classList.add("quantity");

    const atSpan = document.createElement("span");
    atSpan.textContent = ` × $${item.price.toFixed(2)}  `;
    atSpan.classList.add("at-price");

    const totalSpan = document.createElement("span");
    totalSpan.textContent = `  $${(item.quantity * item.price).toFixed(2)}`;
    totalSpan.classList.add("total");

    line2.append(quantitySpan, atSpan, totalSpan);

    // Séparateur
    const separator = document.createElement("hr");

    cartItem.append(line1, line2, separator);
    cartContainer.appendChild(cartItem);
  });
}
