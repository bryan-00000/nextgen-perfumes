const fs = require('fs');
const axios = require('axios');

// System monitoring and alerting
class SystemMonitor {
    constructor() {
        this.apiUrl = 'http://localhost:8000/api';
        this.alertThresholds = {
            responseTime: 2000, // 2 seconds
            errorRate: 0.05,    // 5%
            diskSpace: 0.9      // 90%
        };
    }

    async checkApiHealth() {
        try {
            const start = Date.now();
            const response = await axios.get(`${this.apiUrl}/health`);
            const responseTime = Date.now() - start;
            
            return {
                status: response.status === 200 ? 'healthy' : 'unhealthy',
                responseTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    async checkDiskSpace() {
        // Simplified disk space check
        return new Promise((resolve) => {
            const stats = fs.statSync('.');
            resolve({
                available: true,
                usage: 0.5, // Mock 50% usage
                timestamp: new Date().toISOString()
            });
        });
    }

    async runHealthCheck() {
        const results = {
            api: await this.checkApiHealth(),
            disk: await this.checkDiskSpace(),
            timestamp: new Date().toISOString()
        };

        console.log('Health Check Results:', JSON.stringify(results, null, 2));
        
        // Log to file
        fs.appendFileSync('monitoring.log', JSON.stringify(results) + '\n');
        
        return results;
    }
}

// Run monitoring every 5 minutes
const monitor = new SystemMonitor();
setInterval(() => {
    monitor.runHealthCheck();
}, 5 * 60 * 1000);

console.log('System monitoring started...');