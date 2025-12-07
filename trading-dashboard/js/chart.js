class TradingChart {
    constructor() {
        this.chart = null;
        this.candleSeries = null;
        this.ema9Series = null;
        this.ema21Series = null;
        this.sampleData = [];
        this.updateInterval = null;
        
        this.initChart();
        this.startRealTimeUpdates();
    }

    initChart() {
        const chartContainer = document.getElementById('tradingChart');
        if (!chartContainer) return;

        this.chart = LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 400,
            layout: {
                background: { color: 'transparent' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: true, // Show seconds for faster updates
            },
        });

        // Candlestick series
        this.candleSeries = this.chart.addCandlestickSeries({
            upColor: '#00ff88',
            downColor: '#ff4444',
            borderDownColor: '#ff4444',
            borderUpColor: '#00ff88',
            wickDownColor: '#ff4444',
            wickUpColor: '#00ff88',
        });

        // EMA lines
        this.ema9Series = this.chart.addLineSeries({
            color: '#ffaa00',
            lineWidth: 2,
            title: 'EMA 9',
        });

        this.ema21Series = this.chart.addLineSeries({
            color: '#00ccff',
            lineWidth: 2,
            title: 'EMA 21',
        });

        // Generate initial data with more volatility
        this.sampleData = this.generateSampleData();
        this.candleSeries.setData(this.sampleData);

        // Calculate and set EMA data
        this.updateEMAs();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.chart.applyOptions({
                width: chartContainer.clientWidth,
            });
        });
    }

    generateSampleData() {
        const data = [];
        let time = new Date();
        let price = 35500;
        
        // Generate more volatile data
        for (let i = 0; i < 50; i++) { // Fewer points for faster updates
            time.setSeconds(time.getSeconds() - 30); // 30-second intervals instead of 5 minutes
            const open = price;
            const volatility = Math.random() * 400 + 100; // Increased volatility
            const trend = Math.random() > 0.4 ? 1 : -1; // Random trend direction
            const close = open + (trend * Math.random() * volatility);
            const high = Math.max(open, close) + Math.random() * volatility * 0.5;
            const low = Math.min(open, close) - Math.random() * volatility * 0.5;
            
            data.unshift({
                time: time.getTime() / 1000,
                open: open,
                high: high,
                low: low,
                close: close,
            });
            
            price = close;
        }
        return data;
    }

    calculateEMA(data, period) {
        const emaData = [];
        let ema = data[0].close;
        const multiplier = 2 / (period + 1);
        
        data.forEach((item, index) => {
            if (index === 0) {
                ema = item.close;
            } else {
                ema = (item.close - ema) * multiplier + ema;
            }
            emaData.push({ time: item.time, value: ema });
        });
        return emaData;
    }

    updateEMAs() {
        const ema9Data = this.calculateEMA(this.sampleData, 9);
        const ema21Data = this.calculateEMA(this.sampleData, 21);
        this.ema9Series.setData(ema9Data);
        this.ema21Series.setData(ema21Data);
    }

    addNewDataPoint() {
        const lastPoint = this.sampleData[this.sampleData.length - 1];
        const newTime = lastPoint.time + 30; // 30 seconds later instead of 5 minutes
        
        // More aggressive price movements
        const volatility = Math.random() * 300 + 150;
        const trend = Math.random() > 0.45 ? 1 : -1; // Slight bias
        const newClose = lastPoint.close + (trend * Math.random() * volatility);
        
        const newPoint = {
            time: newTime,
            open: lastPoint.close,
            high: Math.max(lastPoint.close, newClose) + Math.random() * volatility * 0.3,
            low: Math.min(lastPoint.close, newClose) - Math.random() * volatility * 0.3,
            close: newClose,
        };
        
        this.sampleData.push(newPoint);
        
        // Keep only last 50 points for performance
        if (this.sampleData.length > 50) {
            this.sampleData.shift();
        }
        
        this.candleSeries.update(newPoint);
        this.updateEMAs();
        
        // Update price display in real-time
        this.updatePriceDisplay(newClose);
    }

    updatePriceDisplay(price) {
        const priceElements = document.querySelectorAll('.price-value');
        priceElements.forEach(element => {
            if (!element.textContent.includes('%')) { // Don't update percentage elements
                const change = price - 35500; // Calculate change from base
                const changePercent = ((change / 35500) * 100).toFixed(2);
                
                element.textContent = `$${price.toFixed(2)}`;
                
                // Update color based on change
                if (change > 0) {
                    element.className = 'price-value positive';
                } else if (change < 0) {
                    element.className = 'price-value negative';
                }
                
                // Update 24h change if exists
                const changeElement = document.querySelector('.price-value.negative, .price-value.positive');
                if (changeElement && changeElement.textContent.includes('%')) {
                    changeElement.textContent = `${changePercent}%`;
                    changeElement.className = change >= 0 ? 'price-value positive' : 'price-value negative';
                }
            }
        });
    }

    startRealTimeUpdates() {
        // Update every 2 seconds for fast movement
        this.updateInterval = setInterval(() => {
            this.addNewDataPoint();
        }, 2000);
    }

    // Add dramatic price movements occasionally
    addVolatilitySpike() {
        if (Math.random() > 0.7) { // 30% chance of spike
            const lastPoint = this.sampleData[this.sampleData.length - 1];
            const spikeDirection = Math.random() > 0.5 ? 1 : -1;
            const spikeSize = Math.random() * 1000 + 500; // Large spike
            
            const spikePoint = {
                time: lastPoint.time + 30,
                open: lastPoint.close,
                high: lastPoint.close + spikeSize,
                low: lastPoint.close - spikeSize,
                close: lastPoint.close + (spikeDirection * spikeSize * 0.8),
            };
            
            this.sampleData.push(spikePoint);
            if (this.sampleData.length > 50) {
                this.sampleData.shift();
            }
            
            this.candleSeries.update(spikePoint);
            this.updateEMAs();
            this.updatePriceDisplay(spikePoint.close);
        }
    }

    stopUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tradingChart = new TradingChart();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
    if (window.tradingChart) {
        window.tradingChart.stopUpdates();
    }
});