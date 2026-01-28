// Data Loader - Handles CSV loading, parsing, and cleaning

const DataLoader = {
    rawData: [],
    filteredData: [],
    
    // Load CSV file and parse it
    async loadData() {
        try {
            showLoading(true);
            
            const response = await fetch('data/sample-data.csv');
            
            if (!response.ok) {
                throw new Error('Failed to load CSV file');
            }
            
            const csvText = await response.text();
            
            // Parse CSV using PapaParse
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    this.rawData = this.cleanData(results.data);
                    this.filteredData = [...this.rawData];
                    
                    console.log('✅ Data loaded successfully:', this.rawData.length, 'records');
                    
                    // Initialize dashboard
                    this.initializeDashboard();
                    showLoading(false);
                },
                error: (error) => {
                    console.error('CSV parsing error:', error);
                    showError('Failed to parse CSV data');
                    showLoading(false);
                }
            });
            
        } catch (error) {
            console.error('Data loading error:', error);
            showError('Failed to load dashboard data. Please refresh the page.');
            showLoading(false);
        }
    },
    
    // Clean and validate data
    cleanData(data) {
        return data.filter(row => {
            // Remove rows with missing critical data
            if (!row.date || !row.revenue || !row.customers) {
                console.warn('Skipping incomplete row:', row);
                return false;
            }
            
            // Ensure revenue is a number
            if (typeof row.revenue === 'string') {
                row.revenue = parseFloat(row.revenue.replace(/[$,]/g, ''));
            }
            
            // Ensure customers is a number
            if (typeof row.customers === 'string') {
                row.customers = parseInt(row.customers);
            }
            
            // Validate date format
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(row.date)) {
                console.warn('Invalid date format:', row.date);
                return false;
            }
            
            return true;
        });
    },
    
    // Initialize dashboard with data
    initializeDashboard() {
        this.updateStats();
        ChartManager.renderAllCharts(this.filteredData);
    },
    
    // Calculate and update summary statistics
    updateStats() {
        const data = this.filteredData;
        
        const totalRevenue = data.reduce((sum, row) => sum + row.revenue, 0);
        const totalCustomers = data.reduce((sum, row) => sum + row.customers, 0);
        const totalTransactions = data.length;
        const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
        
        // Update DOM elements
        document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);
        document.getElementById('totalCustomers').textContent = totalCustomers.toLocaleString();
        document.getElementById('avgTransaction').textContent = '$' + avgTransaction.toFixed(2);
        document.getElementById('totalTransactions').textContent = totalTransactions;
    },
    
    // Get data grouped by date
    getRevenueByDate() {
        const grouped = {};
        
        this.filteredData.forEach(row => {
            if (!grouped[row.date]) {
                grouped[row.date] = 0;
            }
            grouped[row.date] += row.revenue;
        });
        
        // Convert to array and sort by date
        return Object.entries(grouped)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, revenue]) => ({ date, revenue }));
    },
    
    // Get data grouped by category
    getRevenueByCategory() {
        const grouped = {};
        
        this.filteredData.forEach(row => {
            if (!grouped[row.category]) {
                grouped[row.category] = 0;
            }
            grouped[row.category] += row.revenue;
        });
        
        return Object.entries(grouped).map(([category, revenue]) => ({ 
            category, 
            revenue 
        }));
    },
    
    // Get data grouped by location
    getCustomersByLocation() {
        const grouped = {};
        
        this.filteredData.forEach(row => {
            if (!grouped[row.location]) {
                grouped[row.location] = 0;
            }
            grouped[row.location] += row.customers;
        });
        
        return Object.entries(grouped).map(([location, customers]) => ({ 
            location, 
            customers 
        }));
    }
};

// Helper functions for UI feedback
function showLoading(show) {
    const loader = document.getElementById('loadingIndicator');
    loader.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const container = document.getElementById('errorContainer');
    container.innerHTML = `<div class="error-message">${message}</div>`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function showSuccess(message) {
    const container = document.getElementById('errorContainer');
    container.innerHTML = `<div class="success-message">${message}</div>`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 3000);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Dashboard initializing...');
    DataLoader.loadData();
});

// Export for use in other files
window.DataLoader = DataLoader;

console.log('✅ Data Loader module loaded');