// Menu Responsivo
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

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

    const navLinksAnchors = document.querySelectorAll('.nav-links a');

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
});

// Adicionando ícones ao menu mobile
navLinks.forEach((link) => {
    const linkText = link.querySelector('a');
    let iconClass;
    switch (linkText.innerText) {
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

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const imageSrc = item.querySelector('img').src;
        const title = item.querySelector('h3').innerText;
        const description = item.querySelector('p').innerText;
        const price = item.querySelector('span').innerText;

        modalImage.src = imageSrc;
        modalTitle.innerText = title;
        modalDescription.innerText = description;
        modalPrice.innerText = price;

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
