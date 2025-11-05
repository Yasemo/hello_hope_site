// Cart Management System - LocalStorage Based
// This handles all cart operations: add, remove, update, get

const Cart = {
    // Get cart from localStorage
    get() {
        const cart = localStorage.getItem('hellohope_cart');
        return cart ? JSON.parse(cart) : { items: [] };
    },

    // Save cart to localStorage
    save(cart) {
        localStorage.setItem('hellohope_cart', JSON.stringify(cart));
        // Dispatch event so other parts of the app can react
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    },

    // Add item to cart
    add(product) {
        const cart = this.get();
        
        // Check if item already exists
        const existingItemIndex = cart.items.findIndex(
            item => item.variantId === product.variantId
        );

        if (existingItemIndex > -1) {
            // Item exists, increase quantity
            cart.items[existingItemIndex].quantity += 1;
        } else {
            // New item, add to cart
            cart.items.push({
                id: product.id,
                variantId: product.variantId,
                title: product.title,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }

        this.save(cart);
        return cart;
    },

    // Remove item from cart
    remove(variantId) {
        const cart = this.get();
        cart.items = cart.items.filter(item => item.variantId !== variantId);
        this.save(cart);
        return cart;
    },

    // Update item quantity
    updateQuantity(variantId, quantity) {
        const cart = this.get();
        const itemIndex = cart.items.findIndex(item => item.variantId === variantId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
        }

        this.save(cart);
        return cart;
    },

    // Get total count of items
    getCount() {
        const cart = this.get();
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    },

    // Get total price
    getTotal() {
        const cart = this.get();
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Clear cart
    clear() {
        this.save({ items: [] });
    },

    // Check if product is in cart
    hasProduct(variantId) {
        const cart = this.get();
        return cart.items.some(item => item.variantId === variantId);
    },

    // Get item quantity
    getItemQuantity(variantId) {
        const cart = this.get();
        const item = cart.items.find(item => item.variantId === variantId);
        return item ? item.quantity : 0;
    }
};

// Make Cart globally available
window.Cart = Cart;

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Listen for cart updates
window.addEventListener('cartUpdated', function() {
    updateCartCount();
});

// Update cart count badge
function updateCartCount() {
    const count = Cart.getCount();
    
    // Update desktop header cart button
    const countElementHeader = document.getElementById('cart-count-header');
    if (countElementHeader) {
        countElementHeader.textContent = count;
        countElementHeader.style.display = count > 0 ? 'flex' : 'none';
    }

    const cartButtonHeader = document.getElementById('cart-button-header');
    if (cartButtonHeader) {
        if (count > 0) {
            cartButtonHeader.classList.add('has-items');
        } else {
            cartButtonHeader.classList.remove('has-items');
        }
    }

    // Update mobile header cart button
    const countElementMobile = document.getElementById('cart-count-mobile');
    if (countElementMobile) {
        countElementMobile.textContent = count;
        countElementMobile.style.display = count > 0 ? 'flex' : 'none';
    }

    const cartButtonMobile = document.getElementById('cart-button-mobile');
    if (cartButtonMobile) {
        if (count > 0) {
            cartButtonMobile.classList.add('has-items');
        } else {
            cartButtonMobile.classList.remove('has-items');
        }
    }
}
