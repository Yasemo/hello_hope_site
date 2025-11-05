// Cart Modal - UI and Checkout Integration

document.addEventListener('DOMContentLoaded', function() {
    initCartModal();
    updateCartDisplay();
});

// Initialize cart modal
function initCartModal() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const overlay = cartModal.querySelector('.cart-modal-overlay');
    const checkoutButton = document.getElementById('checkout-button');

    // Open cart modal
    cartButton.addEventListener('click', function() {
        openCartModal();
    });

    // Close cart modal
    closeCart.addEventListener('click', function() {
        closeCartModal();
    });

    // Close on overlay click
    overlay.addEventListener('click', function() {
        closeCartModal();
    });

    // Checkout button
    checkoutButton.addEventListener('click', function() {
        handleCheckout();
    });

    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        updateCartDisplay();
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.classList.contains('open')) {
            closeCartModal();
        }
    });
}

// Open cart modal
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Update display to show latest cart state
    updateCartDisplay();
}

// Close cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.remove('open');
    document.body.style.overflow = '';
}

// Update cart display
function updateCartDisplay() {
    const cart = Cart.get();
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const checkoutButton = document.getElementById('checkout-button');

    // Display cart items
    if (cart.items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"/>
                </svg>
                <p>Your cart is empty</p>
                <button onclick="document.getElementById('cart-modal').classList.remove('open'); document.body.style.overflow = '';" class="btn-continue-shopping">
                    Continue Shopping
                </button>
            </div>
        `;
        checkoutButton.disabled = true;
    } else {
        cartItems.innerHTML = cart.items.map(item => createCartItemHTML(item)).join('');
        checkoutButton.disabled = false;

        // Add event listeners to quantity controls
        cartItems.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = this.dataset.variantId;
                const currentQty = Cart.getItemQuantity(variantId);
                Cart.updateQuantity(variantId, currentQty - 1);
            });
        });

        cartItems.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = this.dataset.variantId;
                const currentQty = Cart.getItemQuantity(variantId);
                Cart.updateQuantity(variantId, currentQty + 1);
            });
        });

        cartItems.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = this.dataset.variantId;
                const title = this.dataset.title;
                
                if (confirm(`Remove "${title}" from cart?`)) {
                    Cart.remove(variantId);
                }
            });
        });
    }

    // Update subtotal
    const total = Cart.getTotal();
    cartSubtotal.textContent = `$${total.toFixed(2)}`;
}

// Create cart item HTML
function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn quantity-decrease" data-variant-id="${item.variantId}" aria-label="Decrease quantity">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,13H5V11H19V13Z"/>
                        </svg>
                    </button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn quantity-increase" data-variant-id="${item.variantId}" aria-label="Increase quantity">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-total">$${itemTotal.toFixed(2)}</p>
                <button class="btn-remove-item" data-variant-id="${item.variantId}" data-title="${item.title}" aria-label="Remove item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Handle checkout - Create Shopify checkout and redirect
async function handleCheckout() {
    const checkoutButton = document.getElementById('checkout-button');
    const originalText = checkoutButton.innerHTML;
    
    // Disable button and show loading
    checkoutButton.disabled = true;
    checkoutButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;">
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
        Processing...
    `;

    try {
        const cart = Cart.get();
        
        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Create checkout via API
        const response = await fetch('/api/shopify/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart.items }),
        });

        const data = await response.json();

        if (!response.ok || !data.checkoutUrl) {
            throw new Error(data.error || 'Failed to create checkout');
        }

        // Track checkout event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                'event_category': 'ecommerce',
                'value': Cart.getTotal(),
                'items': cart.items.length
            });
        }

        // Redirect to Shopify checkout
        window.location.href = data.checkoutUrl;

    } catch (error) {
        console.error('Checkout error:', error);
        
        // Show error message
        showCheckoutError(error.message || 'Failed to proceed to checkout. Please try again.');
        
        // Re-enable button
        checkoutButton.disabled = false;
        checkoutButton.innerHTML = originalText;
    }
}

// Show checkout error
function showCheckoutError(message) {
    // Remove existing error
    const existing = document.querySelector('.checkout-error');
    if (existing) existing.remove();

    // Create error message
    const error = document.createElement('div');
    error.className = 'checkout-error';
    error.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
        <span>${message}</span>
    `;

    const cartFooter = document.querySelector('.cart-footer');
    cartFooter.insertBefore(error, cartFooter.firstChild);

    // Remove after 5 seconds
    setTimeout(() => error.remove(), 5000);
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
