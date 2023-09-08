// Elementos do DOM
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");
const cartContent = document.querySelector(".cart-content");
const totalElement = document.querySelector(".total-price");

// Eventos de clique
cartIcon.addEventListener("click", () => toggleCart());
closeCart.addEventListener("click", () => toggleCart());

// Verifique se o documento está pronto antes de chamar a função "ready"
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

// Função para mostrar/ocultar o carrinho
function toggleCart() {
    cart.classList.toggle("active");
}

// Função para configurar eventos de clique nos botões "Adicionar ao Carrinho"
function ready() {
    const addCartButtons = document.querySelectorAll(".add-cart");
    addCartButtons.forEach(button => {
        button.addEventListener("click", () => addProductToCart(button));
    });

    // Carregue os itens salvos no localStorage ao carregar a página
    loadCartItems();
}

// Função para adicionar um produto ao carrinho
function addProductToCart(button) {
    const shopProduct = button.closest(".product-box");
    const title = shopProduct.querySelector(".product-title").innerText;
    const priceText = shopProduct.querySelector(".price").innerText.replace("R$", "").replace(",", ".");
    const price = parseFloat(priceText);
    const productImg = shopProduct.querySelector(".product-img").src;

    // Verifique se o carrinho já tem 4 produtos
    if (getCartItemCount() >= 4) {
        alert("O carrinho está cheio. Não é possível adicionar mais produtos.");
        return;
    }

    const existingCartItem = findCartItemByTitle(title);
    if (existingCartItem) {
        increaseCartItemQuantity(existingCartItem);
    } else {
        addNewCartItem(title, price, productImg);
    }

    updateCartIcon();
}

// Função para obter a quantidade de itens no carrinho
function getCartItemCount() {
    const cartBoxes = document.querySelectorAll(".cart-box");
    return cartBoxes.length;
}

// Função para encontrar um item no carrinho pelo título
function findCartItemByTitle(title) {
    const cartBoxes = document.querySelectorAll(".cart-box");
    return Array.from(cartBoxes).find(cartBox => {
        const cartProductTitle = cartBox.querySelector(".cart-product-title").innerText;
        return cartProductTitle === title;
    });
}

// Função para aumentar a quantidade de um item no carrinho
function increaseCartItemQuantity(cartItem) {
    const quantityElement = cartItem.querySelector(".cart-quantity");
    let quantity = parseInt(quantityElement.value);
    quantity++;
    quantityElement.value = quantity;
    updateTotal();
    saveCartItems();
}

// Função para adicionar um novo item ao carrinho
function addNewCartItem(title, price, productImg) {
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    const cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${formatMoney(price)}</div>
            <input type="number" name="" id="" value="1" class="cart-quantity">
        </div>
        <i class="fas fa-trash cart-remove"></i>
    `;

    cartShopBox.innerHTML = cartBoxContent;
    cartContent.appendChild(cartShopBox);

    cartShopBox.querySelector(".cart-remove").addEventListener("click", () => removeCartItem(cartShopBox));
    cartShopBox.querySelector(".cart-quantity").addEventListener("change", () => quantityChanged(cartShopBox));

    updateTotal();
    saveCartItems();
}

// Função para remover um item do carrinho
function removeCartItem(cartBox) {
    cartBox.remove();
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

// Função para atualizar o total do carrinho
function updateTotal() {
    const cartBoxes = document.querySelectorAll(".cart-box");
    let total = 0;

    cartBoxes.forEach(cartBox => {
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".cart-quantity");

        const priceText = priceElement.innerText.replace("R$", "").replace(",", ".");
        const price = parseFloat(priceText);
        const quantity = parseInt(quantityElement.value);

        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });

    total = Math.round(total * 100) / 100;
    totalElement.innerText = formatMoney(total);
    localStorage.setItem("cartTotal", total); // Atualize o valor total no localStorage
}

// Função para formatar o dinheiro
function formatMoney(amount) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

// Função para salvar os itens do carrinho no localStorage
function saveCartItems() {
    const cartBoxes = document.querySelectorAll(".cart-box");
    const cartItems = [];

    cartBoxes.forEach(cartBox => {
        const title = cartBox.querySelector(".cart-product-title").innerText;
        const price = cartBox.querySelector(".cart-price").innerText;
        const quantity = cartBox.querySelector(".cart-quantity").value;
        const productImg = cartBox.querySelector(".cart-img").src;

        cartItems.push({
            title,
            price,
            quantity,
            productImg,
        });
    });

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Função para carregar os itens do carrinho do localStorage
function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    cartItems.forEach(item => {
        addNewCartItem(item.title, parseFloat(item.price), item.productImg);
        const cartBoxes = document.querySelectorAll(".cart-box");
        const cartBox = cartBoxes[cartBoxes.length - 1];
        cartBox.querySelector(".cart-quantity").value = item.quantity;
        updateCartIcon();
    });
}

// Função para atualizar o ícone do carrinho com a quantidade de itens
function updateCartIcon() {
    const cartBoxes = document.querySelectorAll(".cart-box");
    let quantity = 0;

    cartBoxes.forEach(cartBox => {
        const quantityElement = cartBox.querySelector(".cart-quantity");
        quantity += parseInt(quantityElement.value);
    });

    cartIcon.setAttribute("data-quantity", quantity.toString());
}


