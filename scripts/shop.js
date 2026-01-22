// Shop Page - Product Display and Management

document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
});

// Fetch and display products
async function loadProducts() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const productsGrid = document.getElementById('products-grid');

    try {
        const response = await fetch('/api/airtable/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Hide loading state
        loadingState.style.display = 'none';

        // Check if we have products
        if (!data.products || data.products.length === 0) {
            errorState.querySelector('h3').textContent = 'No Products Available';
            errorState.querySelector('p').textContent = 'Check back soon for new items!';
            errorState.style.display = 'flex';
            return;
        }

        // Display products
        renderProducts(data.products);
        productsGrid.style.display = 'grid';

    } catch (error) {
        console.error('Error loading products:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }
}

// Render products to the grid
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach((product) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Get product data from Airtable format
    const image = product.image || 'https://via.placeholder.com/400x400?text=No+Image';
    const title = product.title || 'Untitled Product';
    const price = product.price || '0.00';
    const currencyCode = product.currencyCode || 'CAD';
    const description = product.description ? truncateText(product.description, 100) : null;
    const productId = product.id;
    const availableForSale = product.availableForSale !== false;

    card.innerHTML = `
        <div class="product-image">
            <img src="${image}" alt="${title}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${title}</h3>
            ${description ? `<p class="product-description">${description}</p>` : ''}
            <div class="product-footer">
                <span class="product-price">$${parseFloat(price).toFixed(2)} ${currencyCode}</span>
                <div class="product-actions">
                    <div class="size-selector" ${!availableForSale ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                        <label for="size-${productId}" class="sr-only">Size</label>
                        <select id="size-${productId}" class="size-input">
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M" selected>M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    <div class="quantity-selector" ${!availableForSale ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                        <button class="qty-btn qty-minus" type="button">−</button>
                        <input type="number" class="qty-input" value="1" min="1" max="999">
                        <button class="qty-btn qty-plus" type="button">+</button>
                    </div>
                    <button
                        class="btn-add-to-cart ${!availableForSale ? 'out-of-stock' : ''}"
                        data-product-id="${productId}"
                        data-title="${title}"
                        data-price="${price}"
                        data-image="${image}"
                        ${!availableForSale ? 'disabled' : ''}
                    >
                        ${!availableForSale ? `
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                            </svg>
                            Out of Stock
                        ` : `
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                            </svg>
                            Add to Cart
                        `}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add quantity selector handlers
    const qtyInput = card.querySelector('.qty-input');
    const qtyMinus = card.querySelector('.qty-minus');
    const qtyPlus = card.querySelector('.qty-plus');
    const sizeInput = card.querySelector('.size-input');

    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', function() {
            const currentValue = parseInt(qtyInput.value) || 1;
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });

        qtyPlus.addEventListener('click', function() {
            const currentValue = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentValue + 1;
        });

        qtyInput.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            if (value < 1) value = 1;
            if (value > 999) value = 999;
            this.value = value;
        });

        if (sizeInput) {
            sizeInput.addEventListener('change', function() {
                updateButtonState(card.querySelector('.btn-add-to-cart'), productId, this.value);
            });
        }

        // Add add to cart click handler
        const addToCartBtn = card.querySelector('.btn-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                handleAddToCart(this);
            });
            // Initial button state
            updateButtonState(addToCartBtn, productId, sizeInput ? sizeInput.value : null);
        }
    }

    return card;
}

// Update add to cart button state based on whether variant is in cart
function updateButtonState(button, productId, size) {
    if (button.disabled) return;
    
    const variantId = size ? `${productId}-${size}` : productId;
    const inCart = Cart.hasProduct(variantId);
    
    if (inCart) {
        button.classList.add('in-cart');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
            In Cart
        `;
    } else {
        button.classList.remove('in-cart');
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
            Add to Cart
        `;
    }
}

// Handle add to cart
function handleAddToCart(button) {
    const productCard = button.closest('.product-card');
    const qtyInput = productCard.querySelector('.qty-input');
    const sizeInput = productCard.querySelector('.size-input');
    const quantity = parseInt(qtyInput.value) || 1;
    const size = sizeInput ? sizeInput.value : null;

    const productId = button.dataset.productId;
    const title = button.dataset.title;
    
    const productData = {
        id: productId,
        variantId: size ? `${productId}-${size}` : productId,
        title: size ? `${title} (${size})` : title,
        price: button.dataset.price,
        image: button.dataset.image,
        size: size
    };

    // Add to cart with selected quantity
    Cart.add(productData, quantity);

    // Reset quantity input
    qtyInput.value = 1;

    // Show success animation
    const message = quantity > 1 ? `${quantity} items added to cart!` : 'Item added to cart!';
    showNotification(message);

    // Update button state immediately
    updateButtonState(button, productId, size);

    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            'event_category': 'ecommerce',
            'event_label': productData.title,
            'value': parseFloat(productData.price) * quantity,
            'quantity': quantity
        });
    }
}

// Truncate text helper
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
        </svg>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update cart buttons when cart changes
window.addEventListener('cartUpdated', function() {
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        if (button.disabled) return;
        
        const productId = button.dataset.productId;
        const productCard = button.closest('.product-card');
        const sizeInput = productCard.querySelector('.size-input');
        const size = sizeInput ? sizeInput.value : null;
        
        updateButtonState(button, productId, size);
    });
});
