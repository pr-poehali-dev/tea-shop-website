let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount, .cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product, quantity = 1) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCart();
    
    if (typeof showAddedModal === 'function') {
        showAddedModal();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    if (typeof renderCart === 'function') {
        renderCart();
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            if (typeof renderCart === 'function') {
                renderCart();
            }
        }
    }
}

function createProductCard(product) {
    return `
        <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
            <div class="product-image">${product.image}</div>
            <div class="product-content">
                <span class="product-badge">${getCategoryName(product.category)}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString()} ₽</span>
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(products.find(p => p.id === ${product.id}))">
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const names = {
        'green': 'Зелёный чай',
        'black': 'Чёрный чай',
        'oolong': 'Улун',
        'white': 'Белый чай',
        'puerh': 'Пуэр'
    };
    return names[category] || category;
}

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/public/')) {
    const popularProductsContainer = document.getElementById('popularProducts');
    if (popularProductsContainer && typeof products !== 'undefined') {
        const popularProducts = products.slice(0, 6);
        popularProductsContainer.innerHTML = popularProducts.map(createProductCard).join('');
    }
    
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Спасибо за подписку! Проверьте вашу почту.');
            subscribeForm.reset();
        });
    }
}

if (window.location.pathname.includes('catalog.html')) {
    const catalogProductsContainer = document.getElementById('catalogProducts');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const originCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const noResults = document.getElementById('noResults');
    const clearSearchBtn = document.getElementById('clearSearch');
    
    function renderCatalog() {
        let filtered = [...products];
        
        const selectedCategory = document.querySelector('input[name="category"]:checked')?.value;
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        const selectedOrigins = Array.from(originCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        if (selectedOrigins.length > 0) {
            filtered = filtered.filter(p => selectedOrigins.includes(p.origin));
        }
        
        const minPrice = parseInt(minPriceInput?.value) || 0;
        const maxPrice = parseInt(maxPriceInput?.value) || Infinity;
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
        
        const searchTerm = searchInput?.value.toLowerCase() || '';
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.description.toLowerCase().includes(searchTerm)
            );
        }
        
        const sortValue = sortSelect?.value;
        if (sortValue === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        if (filtered.length === 0) {
            catalogProductsContainer.style.display = 'none';
            noResults.style.display = 'block';
        } else {
            catalogProductsContainer.style.display = 'grid';
            noResults.style.display = 'none';
            catalogProductsContainer.innerHTML = filtered.map(createProductCard).join('');
        }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const categoryRadio = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
        if (categoryRadio) {
            categoryRadio.checked = true;
        }
    }
    
    if (typeof products !== 'undefined') {
        renderCatalog();
    }
    
    searchInput?.addEventListener('input', renderCatalog);
    sortSelect?.addEventListener('change', renderCatalog);
    categoryRadios.forEach(radio => radio.addEventListener('change', renderCatalog));
    originCheckboxes.forEach(cb => cb.addEventListener('change', renderCatalog));
    minPriceInput?.addEventListener('input', renderCatalog);
    maxPriceInput?.addEventListener('input', renderCatalog);
    
    resetFiltersBtn?.addEventListener('click', () => {
        document.querySelector('input[name="category"][value="all"]').checked = true;
        originCheckboxes.forEach(cb => cb.checked = false);
        minPriceInput.value = '0';
        maxPriceInput.value = '10000';
        searchInput.value = '';
        sortSelect.value = 'default';
        renderCatalog();
    });
    
    clearSearchBtn?.addEventListener('click', () => {
        searchInput.value = '';
        renderCatalog();
    });
}

if (window.location.pathname.includes('product.html')) {
    const productDetailContainer = document.getElementById('productDetail');
    const relatedProductsContainer = document.getElementById('relatedProducts');
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId && typeof products !== 'undefined') {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            let quantity = 1;
            
            productDetailContainer.innerHTML = `
                <div class="product-main-image">${product.image}</div>
                <div class="product-info">
                    <div class="product-tags">
                        <span class="product-tag">${getCategoryName(product.category)}</span>
                        <span class="product-tag">${product.origin}</span>
                    </div>
                    <h1>${product.name}</h1>
                    <span class="product-price">${product.price.toLocaleString()} ₽</span>
                    <p class="product-full-description">${product.fullDescription}</p>
                    ${product.characteristics ? `
                        <div class="product-characteristics">
                            <h3>Характеристики</h3>
                            <div class="characteristic-row">
                                <span>Вес:</span>
                                <span>${product.characteristics.weight}</span>
                            </div>
                            <div class="characteristic-row">
                                <span>Заваривание:</span>
                                <span>${product.characteristics.brewing}</span>
                            </div>
                            <div class="characteristic-row">
                                <span>Температура:</span>
                                <span>${product.characteristics.temperature}</span>
                            </div>
                            <div class="characteristic-row">
                                <span>Вкус:</span>
                                <span>${product.characteristics.taste}</span>
                            </div>
                        </div>
                    ` : ''}
                    <div class="quantity-selector">
                        <div class="quantity-controls">
                            <button class="quantity-btn" id="decreaseBtn">−</button>
                            <span class="quantity-value" id="quantityValue">1</span>
                            <button class="quantity-btn" id="increaseBtn">+</button>
                        </div>
                        <button class="btn btn-primary" style="flex: 1" id="addToCartBtn">
                            Добавить в корзину
                        </button>
                    </div>
                    <div class="product-guarantees">
                        <div class="guarantee-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                            <span>Бесплатная доставка от 5 000 ₽</span>
                        </div>
                        <div class="guarantee-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span>Гарантия свежести и качества</span>
                        </div>
                        <div class="guarantee-item">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="8" r="7"/>
                                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
                            </svg>
                            <span>Сертифицированная продукция</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('decreaseBtn').addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    document.getElementById('quantityValue').textContent = quantity;
                }
            });
            
            document.getElementById('increaseBtn').addEventListener('click', () => {
                quantity++;
                document.getElementById('quantityValue').textContent = quantity;
            });
            
            document.getElementById('addToCartBtn').addEventListener('click', () => {
                addToCart(product, quantity);
            });
            
            const relatedProducts = products
                .filter(p => p.category === product.category && p.id !== product.id)
                .slice(0, 3);
            
            if (relatedProducts.length > 0) {
                relatedProductsContainer.innerHTML = relatedProducts.map(createProductCard).join('');
            }
        }
    }
    
    window.showAddedModal = function() {
        const modal = document.getElementById('addedModal');
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => {
                modal.classList.remove('active');
            }, 2000);
        }
    };
    
    window.closeModal = function() {
        const modal = document.getElementById('addedModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };
}

if (window.location.pathname.includes('cart.html')) {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItemsContainer.style.display = 'block';
            cartSummary.style.display = 'block';
            cartEmpty.style.display = 'none';
            
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">${item.price.toLocaleString()} ₽</p>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                                <span class="quantity-value">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                        </button>
                        <span class="cart-item-total">${(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                </div>
            `).join('');
            
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const deliveryCost = subtotal >= 5000 ? 0 : 300;
            const total = subtotal + deliveryCost;
            
            document.getElementById('totalItems').textContent = totalItems;
            document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} ₽`;
            document.getElementById('delivery').textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`;
            document.getElementById('total').textContent = `${total.toLocaleString()} ₽`;
        }
    }
    
    renderCart();
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkoutModal.classList.add('active');
        });
    }
    
    window.closeCheckoutModal = function() {
        checkoutModal.classList.remove('active');
    };
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            checkoutModal.classList.remove('active');
            document.getElementById('successModal').classList.add('active');
            cart = [];
            saveCart();
            setTimeout(() => {
                location.href = 'index.html';
            }, 3000);
        });
    }
}

if (window.location.pathname.includes('contacts.html')) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('contactSuccessModal').classList.add('active');
            contactForm.reset();
        });
    }
    
    window.closeContactModal = function() {
        document.getElementById('contactSuccessModal').classList.remove('active');
    };
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

updateCartCount();