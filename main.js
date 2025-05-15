// Sélection du conteneur où insérer les cartes produits
const productList = document.getElementById("product-list");

// Charger les données depuis le fichier JSON
fetch("./data.json")
  .then((response) => response.json())
  .then((products) => {
    products.forEach((product) => {
      const card = document.createElement("article");
      card.classList.add("card");

      card.innerHTML = `
  <div class="card-image-container">
    <picture>
      <source media="(min-width:1440px)" srcset="${product.image.desktop}">
      <source media="(min-width:768px)" srcset="${product.image.tablet}">
      <source media="(min-width:375px)" srcset="${product.image.mobile}">
      <img src="${product.image.thumbnail}" alt="${product.name}" class="card-image">
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
    <p class="card-price">${product.price}$</p>
  </footer>
`;

      // Ajouter la carte au conteneur
      productList.appendChild(card);

      // Récupérer le bouton et le conteneur image
      const button = card.querySelector(".add-to-cart-btn");
      const imageContainer = card.querySelector(".card-image-container");

      // Ajouter un event listener pour le clic
      button.addEventListener("click", () => {
        imageContainer.classList.toggle("active-border"); // Ajoute ou enlève la classe
      });
    });
  })
  .catch((error) => {
    console.error("Erreur lors du chargement des produits :", error);
  });
