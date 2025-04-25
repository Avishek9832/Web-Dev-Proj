// Get order details from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const orderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    const orderTotal = localStorage.getItem('orderTotal') || '0';
    
    // Redirect to menu if no items in order
    if (!orderItems || orderItems.length === 0) {
        showToast('No items in order. Redirecting to menu...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    displayOrderSummary(orderItems, orderTotal);
    setupEventListeners();
});

function displayOrderSummary(items, total) {
    const orderItemsDiv = document.getElementById('payment-order-items');
    const totalDiv = document.getElementById('payment-total');

    orderItemsDiv.innerHTML = items.map(item => `
        <div class="order-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
        </div>
    `).join('');

    totalDiv.textContent = `Total: ₹${total}`;
}

function selectPaymentMethod(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
    });

    // Show selected payment form
    document.getElementById(`${method}-payment-form`).classList.remove('hidden');

    // Update active state of payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function setupEventListeners() {
    // Card form validation and submission
    document.getElementById('card-form').addEventListener('submit', handleCardPayment);
    
    // UPI form submission
    document.getElementById('upi-form').addEventListener('submit', handleUPIPayment);
    
    // Net Banking form submission
    document.getElementById('netbanking-form').addEventListener('submit', handleNetBankingPayment);
    
    // Wallet form submission
    document.getElementById('wallet-form').addEventListener('submit', handleWalletPayment);

    // Card number formatting
    const cardInput = document.querySelector('#card-form input[placeholder="1234 5678 9012 3456"]');
    if (cardInput) {
        cardInput.addEventListener('input', formatCardNumber);
    }

    // Expiry date formatting
    const expiryInput = document.querySelector('#card-form input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
}

function handleCardPayment(e) {
    e.preventDefault();
    showToast('Processing card payment...');
    simulatePayment('card');
}

function handleUPIPayment(e) {
    e.preventDefault();
    showToast('Processing UPI payment...');
    simulatePayment('UPI');
}

function handleNetBankingPayment(e) {
    e.preventDefault();
    showToast('Redirecting to bank...');
    simulatePayment('net banking');
}

function handleWalletPayment(e) {
    e.preventDefault();
    showToast('Processing wallet payment...');
    simulatePayment('wallet');
}

function simulatePayment(method) {
    // Simulate payment processing
    setTimeout(() => {
        showToast('Payment successful! Redirecting to confirmation page...');
        setTimeout(() => {
            // Clear order from localStorage
            localStorage.removeItem('orderItems');
            localStorage.removeItem('orderTotal');
            // Redirect to confirmation page or back to menu
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
} 