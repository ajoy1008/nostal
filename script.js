// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Load products from localStorage or use default products
function getProducts() {
    // Try to get products from localStorage
    const storedProducts = localStorage.getItem('products');
    
    if (storedProducts) {
        return JSON.parse(storedProducts);
    }
    
    // Default products if none in localStorage
    return [
        {
            id: 1,
            name: 'Premium Chronograph',
            price: 299.99,
            image: 'https://via.placeholder.com/300x400'
        },
        {
            id: 2,
            name: 'Classic Digital',
            price: 149.99,
            image: 'https://via.placeholder.com/300x400'
        },
        {
            id: 3,
            name: 'Luxury Analog',
            price: 199.99,
            image: 'https://via.placeholder.com/300x400'
        }
    ];
}

// Load wish list from localStorage
function getWishlist() {
    const storedWishlist = localStorage.getItem('wishlist');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
}

// Save wish list to localStorage
function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Dynamically populate products
function populateProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return; // Exit if product grid doesn't exist
    
    productGrid.innerHTML = ''; // Clear existing content
    
    const products = getProducts();
    const wishlist = getWishlist();

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Use the first image from the product's images array, or fallback to a placeholder
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/300x400';
            
        // Check if product is in wishlist
        const isInWishlist = wishlist.includes(product.id);
        const wishlistIconClass = isInWishlist ? 'fas fa-heart wishlist-active' : 'far fa-heart';
            
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${product.name}">
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <i class="${wishlistIconClass}"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Toggle wish list
function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    
    if (index === -1) {
        // Add to wishlist
        wishlist.push(productId);
        saveWishlist(wishlist);
        showNotification('Product added to wish list!');
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        saveWishlist(wishlist);
        showNotification('Product removed from wish list');
    }
    
    // Update wishlist icon
    updateWishlistIcon(productId);
}

// Update wishlist icon
function updateWishlistIcon(productId) {
    const wishlist = getWishlist();
    const isInWishlist = wishlist.includes(productId);
    const wishlistBtn = document.querySelector(`.wishlist-btn[onclick="toggleWishlist(${productId})"] i`);
    
    if (wishlistBtn) {
        wishlistBtn.className = isInWishlist ? 'fas fa-heart wishlist-active' : 'far fa-heart';
    }
}

// Update wishlist icon in navbar
function updateWishlistNavIcon() {
    const wishlist = getWishlist();
    const wishlistIcon = document.querySelector('.fa-heart');
    
    if (wishlistIcon && wishlist.length > 0) {
        wishlistIcon.style.color = '#ff5252';
    } else if (wishlistIcon) {
        wishlistIcon.style.color = '#333';
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add styles for notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#9c8a4d';
    notification.style.color = 'white';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.animation = 'slideIn 0.5s ease-out';

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .wishlist-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    }
    
    .wishlist-btn:hover {
        transform: scale(1.1);
    }
    
    .wishlist-btn i {
        font-size: 1.2rem;
        color: #666;
        transition: color 0.3s ease;
    }
    
    .wishlist-btn .wishlist-active {
        color: #ff5252;
    }
    
    .product-image {
        position: relative;
    }
`;
document.head.appendChild(style);

// Remove cart-related styles
const cartCountStyle = document.createElement('style');
cartCountStyle.textContent = `
    .nav-icons a {
        position: relative;
    }
`;
document.head.appendChild(cartCountStyle);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    populateProducts();
    updateWishlistNavIcon();
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');
    
    // Insert mobile menu button before nav-links
    navContainer.insertBefore(mobileMenuBtn, navLinks);
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navContainer.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
    
    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
});

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Performance Optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize scroll events
    const scrollHandler = debounce(() => {
        // Add your scroll-based functionality here
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
    
    // Optimize resize events
    const resizeHandler = debounce(() => {
        // Add your resize-based functionality here
    }, 100);
    
    window.addEventListener('resize', resizeHandler);
});

// Touch Event Optimizations
document.addEventListener('DOMContentLoaded', function() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe right
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn i');
                    mobileMenuBtn.classList.add('fa-bars');
                    mobileMenuBtn.classList.remove('fa-times');
                }
            }
        }
    }
}); 