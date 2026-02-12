// Cart Modal - UI and Checkout Integration

let paypalButtons = null;

document.addEventListener('DOMContentLoaded', function() {
    initCartModal();
    updateCartDisplay();
});

// Initialize cart modal
function initCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const overlay = cartModal.querySelector('.cart-modal-overlay');
    const checkoutButton = document.getElementById('checkout-button');

    // Use event delegation for cart buttons (works even if header loads after this script)
    document.addEventListener('click', function(e) {
        // Check if clicked element is a cart button (or inside one)
        const cartButton = e.target.closest('#cart-button-header, #cart-button-mobile');
        if (cartButton) {
            e.preventDefault();
            openCartModal();
        }
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

    // Discount code functionality
    initDiscountCode();

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

    // Initialize PayPal
    initPayPal();
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
                showRemoveConfirmationModal(variantId, title);
            });
        });
    }

    // Update subtotal, shipping, discount, and total
    const subtotal = Cart.getTotal();
    const discountAmount = Cart.getDiscountAmount();
    const discountedTotal = Cart.getDiscountedTotal();
    const shipping = cart.items.length > 0 ? 15.00 : 0.00;
    const total = discountedTotal + shipping;

    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartDiscountElement = document.getElementById('cart-discount');
    const cartDiscountAmountElement = document.getElementById('cart-discount-amount');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTotalElement = document.getElementById('cart-total');

    if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Show/hide discount line
    if (cartDiscountElement && cartDiscountAmountElement) {
        if (discountAmount > 0) {
            cartDiscountElement.style.display = 'flex';
            cartDiscountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
        } else {
            cartDiscountElement.style.display = 'none';
        }
    }

    if (cartShippingElement) cartShippingElement.textContent = `$${shipping.toFixed(2)}`;
    if (cartTotalElement) cartTotalElement.textContent = `$${total.toFixed(2)}`;

    // Update discount UI
    updateDiscountUI();
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

// Initialize PayPal SDK and Buttons
async function initPayPal() {
    try {
        // Fetch config to get PayPal Client ID
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        
        if (!config.paypal || !config.paypal.clientId) {
            console.error('PayPal Client ID not found in config');
            return;
        }

        // Load PayPal SDK script
        if (!window.paypal) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://www.paypal.com/sdk/js?client-id=${config.paypal.clientId}&currency=CAD&components=buttons`;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // Render PayPal Buttons
        if (window.paypal && !paypalButtons) {
            paypalButtons = window.paypal.Buttons({
                createOrder: async (data, actions) => {
                    const cart = Cart.get();
                    const discountInfo = Cart.getDiscountInfo();
                    const payload = { items: cart.items };

                    if (discountInfo.code && discountInfo.freeItemId) {
                        payload.discountCode = discountInfo.code;
                        // Apply discount by setting free item price to 0
                        const freeItemIndex = payload.items.findIndex(item => item.variantId === discountInfo.freeItemId);
                        if (freeItemIndex > -1) {
                            payload.items[freeItemIndex].price = "0.00";
                        }
                    }

                    const response = await fetch('/api/paypal/create-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const order = await response.json();
                    if (order.id) {
                        return order.id;
                    } else {
                        const errorDetail = order?.details?.[0];
                        const errorMessage = errorDetail
                            ? `${errorDetail.issue} ${errorDetail.description} (${order.debug_id})`
                            : JSON.stringify(order);
                        throw new Error(errorMessage);
                    }
                },
                onApprove: async (data, actions) => {
                    try {
                        const response = await fetch('/api/paypal/capture-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderID: data.orderID })
                        });
                        
                        const details = await response.json();
                        
                        // Three cases to handle:
                        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                        //   (2) Other non-recoverable errors -> show a failure message
                        //   (3) Successful transaction -> show confirmation or thank you

                        const errorDetail = details?.details?.[0];

                        if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
                            return actions.restart();
                        } else if (errorDetail) {
                            throw new Error(`${errorDetail.description} (${details.debug_id})`);
                        } else if (!details.purchase_units) {
                            throw new Error('Transaction could not be processed.');
                        } else {
                            // Successful capture
                            console.log('Capture result', details);
                            const transaction = details.purchase_units[0].payments.captures[0];
                            
                            // Clear cart
                            Cart.clear();
                            
                            // Show success message
                            showSuccessMessage(`Transaction ${transaction.status}: ${transaction.id}\n\nThank you for your support!`);
                            
                            // Close modal after delay
                            setTimeout(() => {
                                closeCartModal();
                            }, 5000);
                        }
                    } catch (error) {
                        console.error('Capture error', error);
                        showCheckoutError('Sorry, your transaction could not be processed.');
                    }
                },
                onError: (err) => {
                    console.error('PayPal error', err);
                    showCheckoutError('An error occurred with PayPal. Please try again.');
                }
            });
            
            if (document.getElementById('paypal-button-container')) {
                paypalButtons.render('#paypal-button-container');
            }
        }
    } catch (error) {
        console.error('Failed to initialize PayPal:', error);
    }
}

// Show success message in cart
function showSuccessMessage(message) {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = `
        <div class="success-message-container" style="text-align: center; padding: 2rem;">
            <svg viewBox="0 0 24 24" fill="#28a745" style="width: 64px; height: 64px; margin-bottom: 1rem;">
                <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/>
            </svg>
            <h3>Payment Successful!</h3>
            <p style="margin-top: 1rem; color: var(--text-color);">${message}</p>
        </div>
    `;
    
    // Hide footer
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) cartFooter.style.display = 'none';
}

// Handle checkout - Now handled by PayPal Buttons
async function handleCheckout() {
    // This function is kept for backward compatibility but the button is hidden
    console.log('Using PayPal Buttons for checkout');
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

// Show remove confirmation modal
function showRemoveConfirmationModal(variantId, title) {
    // Remove any existing confirmation modal
    const existingModal = document.querySelector('.remove-confirmation-modal');
    if (existingModal) existingModal.remove();

    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'remove-confirmation-modal';
    modal.innerHTML = `
        <div class="remove-confirmation-overlay"></div>
        <div class="remove-confirmation-content">
            <h3>Remove Item?</h3>
            <p>Are you sure you want to remove <strong>"${title}"</strong> from your cart?</p>
            <div class="remove-confirmation-actions">
                <button class="btn-cancel-remove">Cancel</button>
                <button class="btn-confirm-remove">Remove</button>
            </div>
        </div>
    `;

    // Add to document body to ensure proper z-index and centering
    document.body.appendChild(modal);

    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);

    // Handle cancel button
    modal.querySelector('.btn-cancel-remove').addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 200);
    });

    // Handle confirm button
    modal.querySelector('.btn-confirm-remove').addEventListener('click', function() {
        Cart.remove(variantId);
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 200);
    });

    // Handle overlay click
    modal.querySelector('.remove-confirmation-overlay').addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 200);
    });

    // Handle escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 200);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Initialize discount code functionality
function initDiscountCode() {
    const discountInput = document.getElementById('discount-code');
    const applyButton = document.getElementById('apply-discount');

    if (!discountInput || !applyButton) return;

    // Enable/disable apply button based on input
    discountInput.addEventListener('input', function() {
        const code = this.value.trim().toUpperCase();
        applyButton.disabled = code.length === 0;
    });

    // Apply discount on button click
    applyButton.addEventListener('click', function() {
        applyDiscountCode();
    });

    // Apply discount on Enter key
    discountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !applyButton.disabled) {
            e.preventDefault();
            applyDiscountCode();
        }
    });
}

// Apply discount code
async function applyDiscountCode() {
    const discountInput = document.getElementById('discount-code');
    const discountMessage = document.getElementById('discount-message');
    const applyButton = document.getElementById('apply-discount');

    if (!discountInput || !discountMessage || !applyButton) return;

    const code = discountInput.value.trim().toUpperCase();

    if (!code) {
        discountMessage.textContent = 'Please enter a discount code';
        discountMessage.className = 'discount-message error';
        return;
    }

    // Disable button during validation
    applyButton.disabled = true;
    applyButton.textContent = 'Validating...';

    try {
        const response = await fetch('/api/discounts/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (data.success && data.valid) {
            // Valid code - apply it
            Cart.applyDiscountCode(code);
            discountMessage.textContent = 'Discount code applied!';
            discountMessage.className = 'discount-message success';
            discountInput.value = '';
        } else {
            // Invalid code
            discountMessage.textContent = 'Invalid or expired discount code';
            discountMessage.className = 'discount-message error';
        }
    } catch (error) {
        console.error('Error validating discount code:', error);
        discountMessage.textContent = 'Error validating discount code. Please try again.';
        discountMessage.className = 'discount-message error';
    } finally {
        // Re-enable button
        applyButton.disabled = discountInput.value.trim() === '';
        applyButton.textContent = 'Apply';
    }
}

// Update discount UI based on current cart state
function updateDiscountUI() {
    const cart = Cart.get();
    const freeItemSelector = document.getElementById('free-item-selector');
    const freeItemOptions = document.getElementById('free-item-options');
    const discountInput = document.getElementById('discount-code');
    const applyButton = document.getElementById('apply-discount');
    const discountMessage = document.getElementById('discount-message');

    if (!freeItemSelector || !freeItemOptions || !discountInput || !applyButton || !discountMessage) return;

    // If we have a valid discount code but no free item selected
    if (cart.discountCode && !cart.freeItemId && cart.items.length > 0) {
        // Show free item selector
        freeItemSelector.style.display = 'block';

        // Generate free item options
        freeItemOptions.innerHTML = cart.items.map(item => `
            <label class="free-item-option">
                <input type="radio" name="free-item" value="${item.variantId}" class="free-item-radio">
                <div class="free-item-info">
                    <img src="${item.image}" alt="${item.title}" class="free-item-image">
                    <div class="free-item-details">
                        <span class="free-item-title">${item.title}</span>
                        <span class="free-item-price">Original: $${item.price.toFixed(2)}</span>
                    </div>
                </div>
            </label>
        `).join('');

        // Add event listeners for free item selection
        freeItemOptions.querySelectorAll('.free-item-radio').forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    Cart.setFreeItem(this.value);
                }
            });
        });

        // Show current selection
        if (cart.freeItemId) {
            const selectedRadio = freeItemOptions.querySelector(`input[value="${cart.freeItemId}"]`);
            if (selectedRadio) {
                selectedRadio.checked = true;
            }
        }
    } else {
        // Hide free item selector
        freeItemSelector.style.display = 'none';

        // Clear message if no discount applied
        if (!cart.discountCode) {
            discountMessage.textContent = '';
            discountMessage.className = 'discount-message';
            discountInput.value = '';
        }

        // Remove discount if no items in cart
        if (cart.items.length === 0 && cart.discountCode) {
            Cart.removeDiscountCode();
        }
    }

    // Update button state
    applyButton.disabled = discountInput.value.trim() === '';
}

// Add spin animation
{
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
