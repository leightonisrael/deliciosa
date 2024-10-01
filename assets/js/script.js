// Menu Responsivo
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const navLinksAnchors = document.querySelectorAll('.nav-links a');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('active');

    // Animação dos Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Fechar menu ao clicar em um link (para telas menores)
navLinksAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Fecha o menu se estiver em telas menores
        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            burger.classList.remove('active');
            navLinks.forEach((link) => {
                link.style.animation = '';
            });
        }
    });
});

// Adicionando ícones ao menu mobile
navLinks.forEach((link) => {
    const linkText = link.querySelector('a');
    let iconClass;
    switch (linkText.innerText.trim()) {
        case 'Início':
            iconClass = 'fas fa-home';
            break;
        case 'Sobre Nós':
            iconClass = 'fas fa-info-circle';
            break;
        case 'Cardápio':
            iconClass = 'fas fa-utensils';
            break;
        case 'Contato':
            iconClass = 'fas fa-envelope';
            break;
        default:
            iconClass = '';
    }
    linkText.innerHTML = `<i class="${iconClass}"></i> ${linkText.innerText}`;
});

// Modal de Detalhes do Produto
const menuItems = document.querySelectorAll('.menu-item');
const modal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const closeButton = document.querySelector('.close-button');
const modalQuantityInput = document.getElementById('modal-quantity');
const modalAddToCartButton = document.getElementById('modal-add-to-cart');

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.quantity-selector')) {
            return;
        }
        const imageSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').innerText;
        const description = item.querySelector('p').innerText;
        const price = item.querySelector('span').innerText;
        const itemId = item.getAttribute('data-id');
        const itemPrice = item.getAttribute('data-price');

        modalImage.src = imageSrc;
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalPrice.innerText = price;
        modalQuantityInput.value = 1;
        modalQuantityInput.setAttribute('data-id', itemId);
        modalQuantityInput.setAttribute('data-name', title);
        modalQuantityInput.setAttribute('data-price', itemPrice);
        modalQuantityInput.setAttribute('data-image', imageSrc);

        modal.style.display = 'block';
    });
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filtro por Categoria
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');
        menuItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
            } else {
                if (item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Barra de Busca
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('keyup', () => {
    const searchValue = searchInput.value.toLowerCase().trim();
    menuItems.forEach(item => {
        const itemTitle = item.querySelector('h3').innerText.toLowerCase();
        if (itemTitle.includes(searchValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Carrinho de Compras
let cart = [];

const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.querySelector('.close-cart-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');

// Área de notificações
const notificationContainer = document.getElementById('notification-container');

// Função para mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notificationContainer.appendChild(notification);

    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Adicionar ao carrinho a partir do cardápio
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuItem = button.parentElement;
        const itemId = menuItem.getAttribute('data-id');
        const itemName = menuItem.getAttribute('data-name');
        const itemPrice = parseFloat(menuItem.getAttribute('data-price'));
        const itemImage = menuItem.querySelector('img').src;
        const quantityInput = menuItem.querySelector('.quantity-selector input');
        const quantity = parseInt(quantityInput.value);

        addToCart(itemId, itemName, itemPrice, itemImage, quantity);
    });
});

// Adicionar ao carrinho a partir do modal
modalAddToCartButton.addEventListener('click', () => {
    const itemId = modalQuantityInput.getAttribute('data-id');
    const itemName = modalQuantityInput.getAttribute('data-name');
    const itemPrice = parseFloat(modalQuantityInput.getAttribute('data-price'));
    const itemImage = modalQuantityInput.getAttribute('data-image');
    const quantity = parseInt(modalQuantityInput.value);

    addToCart(itemId, itemName, itemPrice, itemImage, quantity);

    modal.style.display = 'none';
});

function addToCart(itemId, itemName, itemPrice, itemImage, quantity) {
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            image: itemImage
        });
    }

    updateCart();
    showNotification(`"${itemName}" foi adicionado ao carrinho.`);
}

cartButton.addEventListener('click', () => {
    cartModal.style.display = 'block';
    displayCartItems();
});

closeCartButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

function updateCart() {
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    displayCartItems();
    calculateTotal();
}

function displayCartItems() {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="quantity-controls">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;

        cartItemsContainer.appendChild(cartItemDiv);
    });

    // Controle de quantidade
    const increaseButtons = cartItemsContainer.querySelectorAll('.increase-quantity');
    const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease-quantity');

    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            item.quantity += 1;
            updateCart();
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            const item = cart.find(item => item.id === itemId);
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== itemId);
            }
            updateCart();
        });
    });

    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        });
    });
}

function calculateTotal() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotal.innerText = total.toFixed(2);
}

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let message = 'Olá, gostaria de fazer o seguinte pedido:\n\n';
    cart.forEach(item => {
        message += `*${item.quantity}x ${item.name}* - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total: R$ ${cartTotal.innerText}*`;

    const whatsappNumber = '5511999999999'; // Coloque o número do WhatsApp aqui
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, '_blank');
});

// Evita que o modal feche ao clicar dentro dele
cartModal.querySelector('.cart-content').addEventListener('click', (e) => {
    e.stopPropagation();
});
