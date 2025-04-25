// State management
let display = '0';
let firstOperand = null;
let operation = null;
let shouldResetDisplay = true;

// DOM elements
const currentValueElement = document.querySelector('.current-value');
const previousOperationElement = document.querySelector('.previous-operation');

// Utility functions
const formatNumber = (num) => {
    const number = parseFloat(num);
    if (isNaN(number)) return 'Error';
    
    if (Math.abs(number) >= 1e9) {
        return number.toExponential(3);
    }
    
    const formatted = number.toString();
    return formatted.length > 10 ? number.toPrecision(6) : formatted;
};

// Calculator operations
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => b !== 0 ? a / b : NaN;

// Event handlers
const handleNumber = (num) => {
    if (shouldResetDisplay) {
        display = num;
        shouldResetDisplay = false;
    } else {
        display = display === '0' ? num : display + num;
    }
    updateDisplay();
};

const handleOperator = (op) => {
    const currentValue = parseFloat(display);
    
    if (firstOperand === null) {
        firstOperand = currentValue;
    } else if (operation) {
        const result = calculateResult(firstOperand, currentValue, operation);
        firstOperand = result;
        display = String(result);
    }
    
    operation = op;
    shouldResetDisplay = true;
    updateDisplay();
};

const calculateResult = (a, b, op) => {
    switch (op) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '×': return multiply(a, b);
        case '÷': return divide(a, b);
        default: return b;
    }
};

const handleEquals = () => {
    if (firstOperand === null || !operation) return;
    
    const secondOperand = parseFloat(display);
    const result = calculateResult(firstOperand, secondOperand, operation);
    
    display = String(result);
    firstOperand = null;
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
};

const handleClear = () => {
    display = '0';
    firstOperand = null;
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
};

// Display update
const updateDisplay = () => {
    currentValueElement.textContent = formatNumber(display);
    previousOperationElement.textContent = firstOperand !== null 
        ? `${formatNumber(String(firstOperand))} ${operation || ''}`
        : '';
};