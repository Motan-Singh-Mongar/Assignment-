// Add at the top of dashboard.js
const DASHBOARD_CONFIG = window.AppConfig ? window.AppConfig.DASHBOARD : {
    REFRESH_INTERVAL: 5000, // 5 seconds
    CHART_UPDATE_INTERVAL: 2000,
    SESSION_DURATION: 30 * 60 * 1000
};

class DashboardSystem {
    constructor() {
        this.refreshInterval = DASHBOARD_CONFIG.REFRESH_INTERVAL;
        this.chartUpdateInterval = DASHBOARD_CONFIG.CHART_UPDATE_INTERVAL;
        this.sessionDuration = DASHBOARD_CONFIG.SESSION_DURATION;
        this.refreshTimer = null;
        this.lastRefresh = null;
        
        this.checkAuthentication();
        this.initializeDashboard();
        this.startAutoRefresh();
        this.initializeLogout();
        this.startChartUpdates();
    }

    // ... existing methods ...

    startAutoRefresh() {
        this.refreshTimer = setInterval(() => {
            this.refreshData();
        }, this.refreshInterval);
    }

    startChartUpdates() {
        // Separate faster updates for chart only
        setInterval(() => {
            if (window.tradingChart) {
                window.tradingChart.addNewDataPoint();
                // Occasionally add volatility spikes
                if (Math.random() > 0.8) { // 20% chance
                    window.tradingChart.addVolatilitySpike();
                }
            }
        }, this.chartUpdateInterval);
    }

    refreshData() {
        console.log('Refreshing dashboard data...');
        this.lastRefresh = new Date();
        this.updateRefreshIndicator();
        this.updateLastUpdatedTime();
        
        // Simulate data updates with more variation
        this.updateMarketData();
        this.updateAIAnalysis();
        this.updateIndicators();
        
        this.showRefreshAnimation();
    }

    updateMarketData() {
        const priceElements = document.querySelectorAll('.price-value');
        priceElements.forEach(element => {
            if (element.textContent.includes('$') && !element.textContent.includes('K')) {
                const currentPrice = parseFloat(element.textContent.replace('$', '').replace(',', ''));
                // More aggressive random changes
                const randomChange = (Math.random() - 0.5) * 200; // Increased from 100
                const newPrice = currentPrice + randomChange;
                element.textContent = `$${newPrice.toFixed(2)}`;
                
                if (randomChange > 0) {
                    element.className = 'price-value positive';
                } else {
                    element.className = 'price-value negative';
                }
            }
        });
    }

    updateIndicators() {
        // Update indicator values more dynamically
        const indicators = {
            'RSI': () => (30 + Math.random() * 40).toFixed(2),
            'MACD': () => (Math.random() - 0.5).toFixed(4),
            'EMA 9': () => `$${(35500 + (Math.random() - 0.5) * 500).toFixed(0)}`,
            'EMA 21': () => `$${(35500 + (Math.random() - 0.5) * 300).toFixed(0)}`
        };

        document.querySelectorAll('.indicator-card').forEach(card => {
            const nameElement = card.querySelector('.indicator-name');
            const valueElement = card.querySelector('.indicator-value');
            
            if (nameElement && valueElement) {
                const indicatorName = nameElement.textContent;
                if (indicators[indicatorName]) {
                    const newValue = indicators[indicatorName]();
                    valueElement.textContent = newValue;
                    
                    // Update colors based on values
                    if (indicatorName === 'RSI') {
                        const rsiValue = parseFloat(newValue);
                        if (rsiValue > 70) valueElement.className = 'indicator-value negative';
                        else if (rsiValue < 30) valueElement.className = 'indicator-value positive';
                        else valueElement.className = 'indicator-value';
                    } else if (indicatorName === 'MACD') {
                        const macdValue = parseFloat(newValue);
                        valueElement.className = macdValue >= 0 ? 'indicator-value positive' : 'indicator-value negative';
                    }
                }
            }
        });
    }

    // ... rest of the class
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSystem = new DashboardSystem();
});

window.addEventListener('beforeunload', () => {
    if (window.dashboardSystem) {
        window.dashboardSystem.destroy();
    }
    if (window.tradingChart) {
        window.tradingChart.stopUpdates();
    }
});