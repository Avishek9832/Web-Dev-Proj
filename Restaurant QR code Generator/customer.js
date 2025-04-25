import menuData from './menuData.js';

let currentOrder = [];

document.addEventListener('DOMContentLoaded', () => {
    // Check for shared order in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sharedOrder = urlParams.get('order');
    
    if (sharedOrder) {
        try {
            currentOrder = JSON.parse(decodeURIComponent(sharedOrder));
            updateOrderDisplay();
            showToast('Order loaded from shared QR code');
        } catch (e) {
            console.error('Invalid order data in URL');
            showToast('Error loading shared order');
        }
    } else {
        // Check if there's an existing order in localStorage
        const savedOrder = localStorage.getItem('orderItems');
        if (savedOrder) {
            currentOrder = JSON.parse(savedOrder);
            updateOrderDisplay();
        }
    }

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

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (currentOrder.length === 0) {
            showToast('Please add items to your order before proceeding to payment');
            return;
        }
        document.getElementById('payment-options').classList.remove('hidden');
        document.getElementById('checkout-btn').classList.add('hidden');
    });

    // Generate QR Code button
    document.getElementById('generate-qr-btn').addEventListener('click', generateOrderQR);
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
        // Save to localStorage
        localStorage.setItem('orderItems', JSON.stringify(currentOrder));
        localStorage.setItem('orderTotal', calculateTotal());
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
    // Update localStorage
    localStorage.setItem('orderItems', JSON.stringify(currentOrder));
    localStorage.setItem('orderTotal', calculateTotal());
};

window.selectPaymentMethod = (method) => {
    localStorage.setItem('selectedPaymentMethod', method);
    window.location.href = 'payment.html';
};

function calculateTotal() {
    return currentOrder.reduce((total, item) => total + item.price, 0);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Generate QR Code for current order
function generateOrderQR() {
    // Get the base URL (domain and path up to the last '/')
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const customerUrl = baseUrl + 'customer.html';
    
    // Create URL with order parameters
    const url = new URL(customerUrl);
    if (currentOrder.length > 0) {
        const orderData = encodeURIComponent(JSON.stringify(currentOrder));
        url.searchParams.set('order', orderData);
    }
    
    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';
    
    // Generate QR code
    $(qrcodeDiv).qrcode({
        text: url.toString(),
        width: 200,
        height: 200
    });
    
    document.getElementById('qr-section').classList.remove('hidden');
    showToast('QR Code generated with current order');
} 