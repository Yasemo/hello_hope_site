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
        const response = await fetch('/api/shopify/products');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Hide loading state
        loadingState.style.display = 'none';

        // Check if we have products
        if (!data.products || data.products.edges.length === 0) {
            errorState.querySelector('h3').textContent = 'No Products Available';
            errorState.querySelector('p').textContent = 'Check back soon for new items!';
            errorState.style.display = 'flex';
            return;
        }

        // Display products
        renderProducts(data.products.edges);
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

    products.forEach(({ node: product }) => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Get product data
    const image = product.images.edges[0]?.node.url || 'https://via.placeholder.com/400x400?text=No+Image';
    const title = product.title || 'Untitled Product';
    const price = product.priceRange.minVariantPrice.amount;
    const currencyCode = product.priceRange.minVariantPrice.currencyCode;
    const description = product.description ? truncateText(product.description, 100) : null;
    const variant = product.variants.edges[0]?.node;
    const variantId = variant?.id;
    const availableForSale = variant?.availableForSale !== false;

    // Check if product is in cart
    const inCart = Cart.hasProduct(variantId);

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
                    <div class="quantity-selector" style="opacity: 0.5; pointer-events: none;">
                        <button class="qty-btn qty-minus" type="button" disabled>−</button>
                        <input type="number" class="qty-input" value="1" min="1" max="999" disabled>
                        <button class="qty-btn qty-plus" type="button" disabled>+</button>
                    </div>
                    <button
                        class="btn-add-to-cart"
                        data-product-id="${product.id}"
                        data-variant-id="${variantId}"
                        data-title="${title}"
                        data-price="${price}"
                        data-image="${image}"
                        disabled
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                        Available soon
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add quantity selector handlers
    const qtyInput = card.querySelector('.qty-input');
    const qtyMinus = card.querySelector('.qty-minus');
    const qtyPlus = card.querySelector('.qty-plus');

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
    }

    return card;
}

// Handle add to cart
function handleAddToCart(button) {
    const productCard = button.closest('.product-card');
    const qtyInput = productCard.querySelector('.qty-input');
    const quantity = parseInt(qtyInput.value) || 1;

    const productData = {
        id: button.dataset.productId,
        variantId: button.dataset.variantId,
        title: button.dataset.title,
        price: button.dataset.price,
        image: button.dataset.image
    };

    // Add to cart with selected quantity
    Cart.add(productData, quantity);

    // Reset quantity input
    qtyInput.value = 1;

    // Update button state
    button.classList.add('in-cart');
    button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
        </svg>
        In Cart
    `;

    // Show success animation
    const message = quantity > 1 ? `${quantity} items added to cart!` : 'Item added to cart!';
    showNotification(message);

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
    // Update all add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        const variantId = button.dataset.variantId;
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
    });
});
