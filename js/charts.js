// Enhanced Pie Chart Implementation
class PieChart {
    constructor(canvas, data, colors) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.colors = colors;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.radius = Math.min(canvas.width, canvas.height) / 2 - 25;

        // Set canvas size for better quality
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.radius = Math.min(rect.width, rect.height) / 2 - 25;
    }

    draw() {
        const total = this.data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2; // Start from top

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            // Create gradient for each slice
            const gradient = this.ctx.createRadialGradient(
                this.centerX, this.centerY, 0,
                this.centerX, this.centerY, this.radius
            );
            gradient.addColorStop(0, this.colors[index]);
            gradient.addColorStop(1, this.adjustBrightness(this.colors[index], -20));

            // Draw slice with shadow
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;

            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.restore();

            // Add white stroke
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, currentAngle, currentAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            currentAngle += sliceAngle;
        });
    }

    adjustBrightness(color, amount) {
        const usePound = color[0] === '#';
        const col = usePound ? color.slice(1) : color;
        const num = parseInt(col, 16);
        let r = (num >> 16) + amount;
        let g = (num >> 8 & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        // Check if we're on the Andhra Pradesh page
        if (document.body.dataset.currentState === 'andhra-pradesh') {
            initializeAPCharts();
        }
        // Check if we're on the Uttar Pradesh page
        if (document.body.dataset.currentState === 'uttar-pradesh') {
            initializeUPCharts();
        }
        // Check if we're on the Bihar page
        if (document.body.dataset.currentState === 'bihar') {
            initializeBiharCharts();
        }
    }, 100);
});

function initializeAPCharts() {
    // Predicted data
    const predictedData = [
        { label: 'YSRCP', value: 36 },
        { label: 'TDP', value: 116 },
        { label: 'JSP', value: 19 },
        { label: 'BJP', value: 4 }
    ];

    // Actual data
    const actualData = [
        { label: 'YSRCP', value: 11 },
        { label: 'TDP', value: 135 },
        { label: 'JSP', value: 21 },
        { label: 'BJP', value: 8 }
    ];

    // Colors matching the party themes
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#ff6b35'];

    // Draw predicted pie chart
    const predictedCanvas = document.querySelector('#predicted-pie canvas');
    if (predictedCanvas) {
        const predictedChart = new PieChart(predictedCanvas, predictedData, colors);
        predictedChart.draw();
    }

    // Draw actual pie chart
    const actualCanvas = document.querySelector('#actual-pie canvas');
    if (actualCanvas) {
        const actualChart = new PieChart(actualCanvas, actualData, colors);
        actualChart.draw();
    }
}
function initializeUPCharts() {
    // UP 2017 Predicted data (after calculations on 09-03-2017)
    const upPredictedData = [
        { label: 'BJP', value: 300 },
        { label: 'SP', value: 45 },
        { label: 'BSP', value: 30 },
        { label: 'Congress', value: 10 },
        { label: 'Others', value: 18 }
    ];

    // UP 2017 Actual results data (11-03-2017)
    const upActualData = [
        { label: 'BJP', value: 312 },
        { label: 'SP', value: 47 },
        { label: 'BSP', value: 19 },
        { label: 'Congress', value: 7 },
        { label: 'Others', value: 18 }
    ];

    // Colors for UP parties
    const upColors = ['#ff6b35', '#10b981', '#6366f1', '#3b82f6', '#8b5cf6'];

    // Draw UP predicted pie chart
    const upPredictedCanvas = document.querySelector('#up-predicted-pie canvas');
    if (upPredictedCanvas) {
        const upPredictedChart = new PieChart(upPredictedCanvas, upPredictedData, upColors);
        upPredictedChart.draw();
    }

    // Draw UP actual pie chart
    const upActualCanvas = document.querySelector('#up-actual-pie canvas');
    if (upActualCanvas) {
        const upActualChart = new PieChart(upActualCanvas, upActualData, upColors);
        upActualChart.draw();
    }

    // Also support old canvas IDs for backward compatibility
    const upCalculatedCanvas = document.querySelector('#up-calculated-pie canvas');
    if (upCalculatedCanvas) {
        const upCalculatedChart = new PieChart(upCalculatedCanvas, upPredictedData, upColors);
        upCalculatedChart.draw();
    }
}

function initializeBiharCharts() {
    // Bihar 2025 Predicted data - All 11 parties
    const biharPredictedData = [
        { label: 'BJP', value: 125 },
        { label: 'JDU', value: 48 },
        { label: 'RJD', value: 52 },
        { label: 'INC', value: 18 },
        { label: 'LJP(RV)', value: 5 },
        { label: 'HAMS', value: 4 },
        { label: 'RLM', value: 3 },
        { label: 'CPI(ML)', value: 3 },
        { label: 'VIP', value: 2 },
        { label: 'CPI(M)', value: 2 },
        { label: 'CPI', value: 1 }
    ];

    // Colors for Bihar parties - Diverse and distinguishable colors
    const biharColors = [
        '#FF6B35',  // BJP - Bright Orange
        '#16A34A',  // JDU - Forest Green
        '#0EA5E9',  // RJD - Sky Blue
        '#2563EB',  // INC - Royal Blue
        '#9333EA',  // LJP(RV) - Purple
        '#F59E0B',  // HAMS - Amber
        '#EC4899',  // RLM - Pink
        '#DC2626',  // CPI(ML) - Red
        '#7C3AED',  // VIP - Violet
        '#14B8A6',  // CPI(M) - Teal
        '#EF4444'   // CPI - Bright Red
    ];

    // Draw Bihar predicted pie chart
    const biharPredictedCanvas = document.querySelector('#bihar-predicted-pie canvas');
    if (biharPredictedCanvas) {
        const biharPredictedChart = new PieChart(biharPredictedCanvas, biharPredictedData, biharColors);
        biharPredictedChart.draw();
    }
}
