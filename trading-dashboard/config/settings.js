// Trading Dashboard Configuration Settings
const AppConfig = {
    // Authentication Settings
    AUTH: {
        PIN: '123456',
        MAX_ATTEMPTS: 3,
        LOCKOUT_DURATION: 5 * 60 * 1000,
        SESSION_DURATION: 30 * 60 * 1000,
        SESSION_WARNING_TIME: 1 * 60 * 1000
    },

    // Dashboard Settings - FASTER UPDATES
    DASHBOARD: {
        REFRESH_INTERVAL: 5000, // 5 seconds instead of 30
        CHART_UPDATE_INTERVAL: 2000, // 2 seconds for chart updates
        CHART_DATA_POINTS: 50, // Fewer points for faster rendering
        UPDATE_ANIMATION_DURATION: 1000
    },

    // Trading Settings
    TRADING: {
        SYMBOL: 'BTCUSDT',
        EXCHANGE: 'Binance Futures',
        DEFAULT_LEVERAGE: 10,
        RISK_PERCENTAGE: 2,
        MAX_POSITION_SIZE: 1000,
        VOLATILITY_MULTIPLIER: 2.5 // Increased volatility
    },

    // ... rest of the config remains the same
    // Technical Indicators Configuration
    INDICATORS: {
        RSI: {
            PERIOD: 14,
            OVERSOLD: 30,
            OVERBOUGHT: 70
        },
        MACD: {
            FAST_PERIOD: 12,
            SLOW_PERIOD: 26,
            SIGNAL_PERIOD: 9
        },
        EMA: {
            SHORT_PERIOD: 9,
            LONG_PERIOD: 21
        }
    },

    // ... rest of config
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
} else {
    window.AppConfig = AppConfig;
}