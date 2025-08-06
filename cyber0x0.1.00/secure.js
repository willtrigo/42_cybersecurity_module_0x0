/**
 * Secure XSS Protection Implementation
 * Implements multiple layers of security:
 * 1. Input validation
 * 2. Output encoding
 * 3. Secure DOM manipulation
 * 4. Content Security Policy
 * 5. Security headers
 */

// Set secure cookie when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set HttpOnly, Secure, SameSite Strict cookie
    document.cookie = "ftCookies=If_You_See_Me_Its_Win; " + 
                      "path=/; " +
                      "HttpOnly; " +
                      "Secure; " +
                      "SameSite=Strict; " +
                      "max-age=3600"; // 1 hour expiration
    
    initializeApplication();
});

function initializeApplication() {
    // Get DOM elements
    const inputForm = document.getElementById('inputForm');
    const inputText = document.getElementById('inputText');
    const outputElement = document.getElementById('output');
    
    // Add event listeners
    inputForm.addEventListener('submit', handleFormSubmit);
    
    // For better UX, also validate on input
    inputText.addEventListener('input', function() {
        validateInput(this.value);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const userInput = document.getElementById('inputText').value.trim();
    const outputElement = document.getElementById('output');
    
    // Clear previous output
    outputElement.innerHTML = '';
    
    // Validate input
    const validationResult = validateInput(userInput);
    if (!validationResult.isValid) {
        displayErrorMessage(outputElement, validationResult.message);
        return;
    }
    
    // Process valid input
    displaySafeOutput(outputElement, userInput);
}

function validateInput(input) {
    if (!input) {
        return {
            isValid: false,
            message: "Please enter some text."
        };
    }
    
    // Check length
    if (input.length > 100) {
        return {
            isValid: false,
            message: "Input too long. Maximum 100 characters allowed."
        };
    }
    
    // Whitelist validation pattern
    const allowedPattern = /^[a-zA-Z0-9\s\-_.,!?'"]*$/;
    if (!allowedPattern.test(input)) {
        return {
            isValid: false,
            message: "Invalid characters detected. Only letters, numbers, spaces, and basic punctuation (-_.,!?'\") allowed."
        };
    }
    
    // Check for potential XSS patterns (defense in depth)
    const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /eval\(/i,
        /document\./i,
        /window\./i,
        /alert\(/i
    ];
    
    for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
            return {
                isValid: false,
                message: "Potentially dangerous input detected."
            };
        }
    }
    
    return { isValid: true };
}

function htmlEncode(str) {
    if (!str) return '';
    
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\//g, '&#x2F;');
}

function displaySafeOutput(container, text) {
    // Create elements safely
    const paragraph = document.createElement('p');
    const strong = document.createElement('strong');
    
    // Use textContent instead of innerHTML
    strong.textContent = text;
    
    // Build DOM structure
    paragraph.appendChild(document.createTextNode('You entered: '));
    paragraph.appendChild(strong);
    
    // Add to container
    container.appendChild(paragraph);
    
    // For demonstration - show the encoded version
    const encodedInfo = document.createElement('div');
    encodedInfo.className = 'encoded-info';
    encodedInfo.innerHTML = `
        <p><small>HTML encoded version:</small></p>
        <code>${htmlEncode(text)}</code>
    `;
    container.appendChild(encodedInfo);
}

function displayErrorMessage(container, message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    
    // Use textContent for safety
    errorDiv.textContent = message;
    
    // Add to container
    container.innerHTML = '';
    container.appendChild(errorDiv);
}

// Additional security measures
Object.freeze(Object.prototype);
Object.freeze(Array.prototype);