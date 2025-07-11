// Initialize EmailJS with your Public Key
(function() {
    emailjs.init('PzqKAe993x7KuPt_H');
})();

// DOM Elements
const projectForm = document.getElementById('projectForm');
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const closeBtn = document.querySelector('.close-btn');
const alertBox = document.getElementById('alertBox');
const purchaseForm = document.getElementById('purchaseForm');

// Set today's date in the hidden field
document.getElementById('date').value = new Date().toISOString().split('T')[0];

// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Arduino Starter Kit',
        price: '₹1,499',
        priceValue: 1499,
        image: 'https://m.media-amazon.com/images/I/71PhcdvqVLL._AC_UF1000,1000_QL80_.jpg',
        shortDescription: 'Perfect for beginners to learn electronics and programming.',
        fullDescription: 'This Arduino starter kit includes everything you need to begin your journey into electronics and programming. It contains an Arduino Uno board, breadboard, LEDs, resistors, sensors, and more. Comes with a detailed tutorial guide for 15+ projects.'
    },
    {
        id: 2,
        name: 'Raspberry Pi 4 Kit',
        price: '₹4,999',
        priceValue: 4999,
        image: 'https://m.media-amazon.com/images/I/61Bv5Y9MNML._AC_UF1000,1000_QL80_.jpg',
        shortDescription: 'Complete kit for Raspberry Pi 4 Model B with accessories.',
        fullDescription: 'This comprehensive kit includes a Raspberry Pi 4 Model B (4GB RAM), official case, power supply, micro HDMI cable, 32GB microSD card with pre-installed OS, and a beginner\'s guide. Perfect for learning programming, building projects, or as a desktop replacement.'
    },
    {
        id: 3,
        name: 'IoT Smart Home Kit',
        price: '₹3,299',
        priceValue: 3299,
        image: 'https://m.media-amazon.com/images/I/71Y1j2dD3JL._AC_UF1000,1000_QL80_.jpg',
        shortDescription: 'Build your own smart home devices with this IoT kit.',
        fullDescription: 'This IoT kit includes an ESP8266 development board, sensors (temperature, humidity, motion), relays, and other components to build smart home devices. Learn to control devices remotely via smartphone and create automation rules. Comes with sample code and tutorials.'
    },
    {
        id: 4,
        name: 'Robotics Starter Kit',
        price: '₹2,799',
        priceValue: 2799,
        image: 'https://m.media-amazon.com/images/I/71+UqKd8ZIL._AC_UF1000,1000_QL80_.jpg',
        shortDescription: 'Beginner-friendly kit to build and program robots.',
        fullDescription: 'This robotics kit includes motors, wheels, chassis, motor driver, ultrasonic sensor, and microcontroller board. Build various robot types like line-following, obstacle-avoiding, or remote-controlled robots. Includes step-by-step instructions for 5 different robot projects.'
    }
];

// Current product being viewed in modal
let currentProduct = null;

/**
 * Renders all products in the products grid
 */
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <p class="product-description">${product.shortDescription}</p>
                <button class="buy-btn" data-id="${product.id}">Buy Now</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to all Buy Now buttons
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', handleBuyButtonClick);
    });
}

/**
 * Handles click event on Buy Now buttons
 * @param {Event} e - The click event
 */
function handleBuyButtonClick(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    if (product) {
        openProductModal(product);
    }
}

/**
 * Opens the product modal with product details
 * @param {Object} product - The product to display
 */
function openProductModal(product) {
    currentProduct = product;
    
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductPrice').textContent = product.price;
    document.getElementById('modalProductDescription').textContent = product.fullDescription;
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

/**
 * Closes the product modal
 */
function closeModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    purchaseForm.reset();
    currentProduct = null;
}

/**
 * Shows an alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert ('success' or 'error')
 */
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;
    
    // Hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}

/**
 * Handles project form submission
 * @param {Event} e - The submit event
 */
function handleProjectFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        type: document.getElementById('type').value,
        budget: document.getElementById('budget').value,
        deadline: document.getElementById('deadline').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value
    };

    // Validate form data
    if (!formData.name || !formData.email || !formData.type || !formData.budget || !formData.deadline || !formData.description) {
        showAlert('❌ Please fill all required fields', 'error');
        return;
    }

    // Send email using EmailJS
    emailjs.send('service_pi2f9dl', 'template_ewzo99a', formData)
        .then(() => {
            showAlert('✅ Request submitted successfully!', 'success');
            projectForm.reset();
        }, (error) => {
            showAlert('❌ Error submitting request. Please try again.', 'error');
            console.error('EmailJS Error:', error);
        });
}

/**
 * Handles purchase form submission
 * @param {Event} e - The submit event
 */
function handlePurchaseFormSubmit(e) {
    e.preventDefault();
    
    const buyerName = document.getElementById('buyerName').value;
    const buyerEmail = document.getElementById('buyerEmail').value;

    if (!buyerName || !buyerEmail) {
        showAlert('❌ Please fill all required fields', 'error');
        return;
    }

    if (!currentProduct) {
        showAlert('❌ Product information missing', 'error');
        return;
    }

    const formData = {
        productName: currentProduct.name,
        productPrice: currentProduct.price,
        buyerName: buyerName,
        buyerEmail: buyerEmail,
        date: new Date().toISOString().split('T')[0]
    };

    // Send email using EmailJS
    emailjs.send('service_pi2f9dl', 'template_ewzo99a', formData)
        .then(() => {
            showAlert('✅ Purchase request submitted successfully!', 'success');
            closeModal();
        }, (error) => {
            showAlert('❌ Error submitting purchase. Please try again.', 'error');
            console.error('EmailJS Error:', error);
        });
}

/**
 * Initializes the page when DOM is fully loaded
 */
function initializePage() {
    // Set minimum date for deadline to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deadline').min = today;
    
    // Render products
    renderProducts();
    
    // Add event listeners
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });
    
    projectForm.addEventListener('submit', handleProjectFormSubmit);
    purchaseForm.addEventListener('submit', handlePurchaseFormSubmit);
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);