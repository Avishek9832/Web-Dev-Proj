import menuData from './menuData.js';

let currentOrder = [];

// Initialize the menu display
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems('starters');
    setupEventListeners();
});

function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            displayMenuItems(e.target.dataset.category);
        });
    });

    // Generate QR Code button
    document.getElementById('generateQRButton').addEventListener('click', generateQRCode);

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        // Save order details to localStorage
        localStorage.setItem('orderItems', JSON.stringify(currentOrder));
        localStorage.setItem('orderTotal', calculateTotal());
        // Redirect to payment page
        window.location.href = 'payment.html';
    });

    // Payment buttons
    document.querySelectorAll('.payment-btn').forEach(button => {
        button.addEventListener('click', handlePayment);
    });
}

function displayMenuItems(category) {
    const menuGrid = document.getElementById('menu-items');
    menuGrid.innerHTML = '';

    menuData[category].forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'menu-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-details">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price}</div>
                <div class="menu-item-description">${item.description}</div>
                <button class="btn" onclick="addToOrder(${item.id})">Add to Order</button>
            </div>
        `;
        menuGrid.appendChild(itemElement);
    });
}

// Add item to order
window.addToOrder = (itemId) => {
    let item = findMenuItem(itemId);
    if (item) {
        currentOrder.push(item);
        updateOrderDisplay();
        showToast('Item added to order');
    }
};

function findMenuItem(id) {
    for (let category in menuData) {
        const item = menuData[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

function updateOrderDisplay() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    orderItems.innerHTML = '';
    let total = 0;

    currentOrder.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <button class="btn" onclick="removeFromOrder(${index})">Remove</button>
        `;
        orderItems.appendChild(itemElement);
        total += item.price;
    });

    orderTotal.textContent = `Total: ₹${total}`;
}

// Remove item from order
window.removeFromOrder = (index) => {
    currentOrder.splice(index, 1);
    updateOrderDisplay();
    showToast('Item removed from order');
};

function triggerConfetti() {
    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['star'],
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    function shoot() {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star']
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ['circle']
        });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
}

function handlePayment(e) {
    const method = e.target.closest('.payment-btn').dataset.method;
    showToast(`Processing ${method} payment...`);
    
    // Simulate payment processing
    setTimeout(() => {
        showToast('Payment successful! Order confirmed.');
        triggerConfetti();
        currentOrder = [];
        updateOrderDisplay();
        document.getElementById('payment-section').classList.add('hidden');
    }, 2000);
}

function generateQRCode() {
    // Get the base URL (domain and path up to the last '/')
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const customerUrl = baseUrl + 'customer.html';
    
    // Generate QR code with current order data
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';
    
    // Add order data to URL if there are items in the order
    if (currentOrder.length > 0) {
        const orderData = encodeURIComponent(JSON.stringify(currentOrder));
        const urlWithOrder = `${customerUrl}?order=${orderData}`;
        $(qrcodeDiv).qrcode({
            text: urlWithOrder,
            width: 200,
            height: 200
        });
    } else {
        $(qrcodeDiv).qrcode({
            text: customerUrl,
            width: 200,
            height: 200
        });
    }
    
    showToast('QR Code generated successfully');
    triggerConfetti();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function calculateTotal() {
    return currentOrder.reduce((total, item) => total + item.price, 0);
}
