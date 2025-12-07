class DashboardSystem {
    constructor() {
        this.refreshInterval = 30000; // 30 seconds
        this.refreshTimer = null;
        this.lastRefresh = null;
        
        this.checkAuthentication();
        this.initializeDashboard();
        this.startAutoRefresh();
        this.initializeLogout();
    }

    checkAuthentication() {
        const isLoggedIn = sessionStorage.getItem('tradingLoggedIn');
        const loginTime = sessionStorage.getItem('loginTime');
        const sessionDuration = 30 * 60 * 1000; // 30 minutes
        
        if (!isLoggedIn || !loginTime) {
            this.redirectToLogin();
            return;
        }

        const timeSinceLogin = Date.now() - parseInt(loginTime);
        if (timeSinceLogin >= sessionDuration) {
            sessionStorage.clear();
            this.redirectToLogin();
            return;
        }

        // Update user info
        this.updateUserInfo();
    }

    updateUserInfo() {
        const username = sessionStorage.getItem('tradingUsername');
        const loginTime = parseInt(sessionStorage.getItem('loginTime'));
        const sessionDuration = 30 * 60 * 1000;
        const remainingTime = sessionDuration - (Date.now() - loginTime);
        
        document.getElementById('usernameDisplay').textContent = username;
        
        // Update session timer
        this.updateSessionTimer(remainingTime);
    }

    updateSessionTimer(remainingTime) {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        
        document.getElementById('sessionTimer').textContent = 
            `Session: ${minutes}m ${seconds}s`;
        
        if (remainingTime <= 60000) { // 1 minute warning
            document.getElementById('sessionTimer').style.color = '#ff4444';
        }
        
        if (remainingTime > 0) {
            setTimeout(() => this.updateSessionTimer(remainingTime - 1000), 1000);
        } else {
            this.redirectToLogin();
        }
    }

    initializeDashboard() {
        this.lastRefresh = new Date();
        this.updateRefreshIndicator();
        this.updateLastUpdatedTime();
        
        // Load initial data
        this.refreshData();
    }

    startAutoRefresh() {
        this.refreshTimer = setInterval(() => {
            this.refreshData();
        }, this.refreshInterval);
    }

    refreshData() {
        console.log('Refreshing dashboard data...');
        this.lastRefresh = new Date();
        this.updateRefreshIndicator();
        this.updateLastUpdatedTime();
        
        // Simulate data updates
        this.updateMarketData();
        this.updateChartData();
        this.updateAIAnalysis();
        
        // Show refresh animation
        this.showRefreshAnimation();
    }

    updateRefreshIndicator() {
        const indicator = document.getElementById('refreshIndicator');
        if (indicator) {
            const timeString = this.lastRefresh.toLocaleTimeString();
            indicator.textContent = `Last refresh: ${timeString}`;
        }
    }

    updateLastUpdatedTime() {
        const timeElement = document.getElementById('lastUpdatedTime');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleString();
        }
    }

    showRefreshAnimation() {
        const indicator = document.getElementById('refreshIndicator');
        if (indicator) {
            indicator.style.color = '#00ff88';
            setTimeout(() => {
                indicator.style.color = '#ccc';
            }, 2000);
        }
    }

    updateMarketData() {
        // Simulate market data updates
        const priceElements = document.querySelectorAll('.price-value');
        priceElements.forEach(element => {
            if (element.textContent.includes('$')) {
                const currentPrice = parseFloat(element.textContent.replace('$', '').replace(',', ''));
                const randomChange = (Math.random() - 0.5) * 100;
                const newPrice = currentPrice + randomChange;
                element.textContent = `$${newPrice.toFixed(2)}`;
                
                // Update color based on change
                if (randomChange > 0) {
                    element.className = 'price-value positive';
                } else if (randomChange < 0) {
                    element.className = 'price-value negative';
                }
            }
        });
    }

    updateChartData() {
        // Chart updates handled by chart.js
        if (window.tradingChart) {
            window.tradingChart.addNewDataPoint();
        }
    }

    updateAIAnalysis() {
        // Simulate AI analysis updates
        const analysisElement = document.getElementById('aiAnalysisText');
        if (analysisElement) {
            const analyses = [
                "Market showing consolidation patterns with neutral momentum. RSI at mid-level suggests balanced buying/selling pressure.",
                "Volume indicators suggest accumulation phase may be starting. Watch for breakout above resistance levels.",
                "Technical setup favors range-bound trading in short term. EMA crossover suggests potential trend change.",
                "Key resistance levels being tested with moderate buying pressure. MACD histogram shows weakening bearish momentum."
            ];
            const randomAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
            analysisElement.textContent = randomAnalysis;
        }
    }

    initializeLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.clear();
                this.redirectToLogin();
            });
        }
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    // Cleanup on page unload
    destroy() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSystem = new DashboardSystem();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.dashboardSystem) {
        window.dashboardSystem.destroy();
    }
});