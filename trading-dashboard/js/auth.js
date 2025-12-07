class LoginSystem {
    constructor() {
        this.failedAttempts = 0;
        this.maxAttempts = 3;
        this.lockoutUntil = 0;
        this.correctPIN = '123456'; // Change this in production
        
        this.initializeEventListeners();
        this.autoFocusFirstInput();
        
        // Check if already logged in
        this.checkExistingSession();
    }

    initializeEventListeners() {
        const form = document.getElementById('loginForm');
        const pinInputs = document.querySelectorAll('.pin-inputs input');
        
        form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Handle PIN input navigation
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value) {
                    if (index < pinInputs.length - 1) {
                        pinInputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    pinInputs[index - 1].focus();
                }
            });
        });

        // Prevent form submission on Enter in PIN inputs
        pinInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        });
    }

    checkExistingSession() {
        const isLoggedIn = sessionStorage.getItem('tradingLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');
        const sessionDuration = 30 * 60 * 1000; // 30 minutes
        
        if (isLoggedIn && loginTime) {
            const timeSinceLogin = Date.now() - parseInt(loginTime);
            if (timeSinceLogin < sessionDuration) {
                // Auto-redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Session expired
                sessionStorage.clear();
            }
        }
    }

    autoFocusFirstInput() {
        document.querySelector('.pin-inputs input').focus();
    }

    handleLogin(event) {
        event.preventDefault();
        
        if (this.isRateLimited()) {
            this.showRateLimitMessage();
            return;
        }

        const username = document.getElementById('username').value;
        const enteredPIN = this.getEnteredPIN();

        if (!username) {
            this.showError('Please enter a username');
            return;
        }

        if (enteredPIN.length !== 6) {
            this.showError('Please enter a complete 6-digit PIN');
            return;
        }

        if (this.validatePIN(enteredPIN)) {
            this.loginSuccess(username);
        } else {
            this.loginFailed();
        }
    }

    getEnteredPIN() {
        const pinInputs = document.querySelectorAll('.pin-inputs input');
        return Array.from(pinInputs).map(input => input.value).join('');
    }

    validatePIN(enteredPIN) {
        return enteredPIN === this.correctPIN;
    }

    isRateLimited() {
        return Date.now() < this.lockoutUntil;
    }

    loginSuccess(username) {
        this.failedAttempts = 0;
        this.hideAllMessages();

        const button = document.getElementById('loginButton');
        button.textContent = 'Access Granted!';
        button.style.background = 'linear-gradient(45deg, #00ff88, #00ccff)';
        
        // Store login session
        sessionStorage.setItem('tradingLoggedIn', 'true');
        sessionStorage.setItem('tradingUsername', username);
        sessionStorage.setItem('loginTime', Date.now().toString());

        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }

    loginFailed() {
        this.failedAttempts++;
        this.hideAllMessages();

        if (this.failedAttempts >= this.maxAttempts) {
            this.lockoutUntil = Date.now() + (5 * 60 * 1000);
            this.showRateLimitMessage();
            this.disableForm();
        } else {
            this.showError('Invalid PIN. Please try again.');
            const remaining = this.maxAttempts - this.failedAttempts;
            if (remaining <= 2) {
                this.showAttemptsWarning(remaining);
            }
        }

        this.clearPINInputs();
        this.autoFocusFirstInput();
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showAttemptsWarning(remaining) {
        const warningElement = document.getElementById('attemptsWarning');
        warningElement.textContent = `Warning: ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining`;
        warningElement.style.display = 'block';
    }

    showRateLimitMessage() {
        const rateLimitElement = document.getElementById('rateLimitMessage');
        rateLimitElement.style.display = 'block';
    }

    hideAllMessages() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('attemptsWarning').style.display = 'none';
        document.getElementById('rateLimitMessage').style.display = 'none';
    }

    disableForm() {
        const inputs = document.querySelectorAll('input');
        const button = document.getElementById('loginButton');
        
        inputs.forEach(input => input.disabled = true);
        button.disabled = true;
        button.textContent = 'Access Locked';

        setTimeout(() => {
            this.enableForm();
        }, 5 * 60 * 1000);
    }

    enableForm() {
        const inputs = document.querySelectorAll('input');
        const button = document.getElementById('loginButton');
        
        inputs.forEach(input => input.disabled = false);
        button.disabled = false;
        button.textContent = 'Access Dashboard';
        
        this.failedAttempts = 0;
        this.lockoutUntil = 0;
        this.hideAllMessages();
        this.clearPINInputs();
        this.autoFocusFirstInput();
    }

    clearPINInputs() {
        const pinInputs = document.querySelectorAll('.pin-inputs input');
        pinInputs.forEach(input => input.value = '');
    }
}

// Initialize login system
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});