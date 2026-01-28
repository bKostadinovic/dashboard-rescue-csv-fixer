// Filter Handler - Manages data filtering and UI interactions

const FilterHandler = {
    // Initialize filter event listeners
    init() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        applyBtn.addEventListener('click', () => this.applyFilters());
        resetBtn.addEventListener('click', () => this.resetFilters());
        
        console.log('✅ Filter handlers initialized');
    },
    
    // Apply all active filters
    applyFilters() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const location = document.getElementById('locationFilter').value;
        
        // Validate date range
        if (startDate && endDate && startDate > endDate) {
            showError('Start date cannot be after end date');
            return;
        }
        
        // Start with all data
        let filtered = [...DataLoader.rawData];
        
        // Apply date filter
        if (startDate) {
            filtered = filtered.filter(row => row.date >= startDate);
        }
        
        if (endDate) {
            filtered = filtered.filter(row => row.date <= endDate);
        }
        
        // Apply location filter
        if (location && location !== 'all') {
            filtered = filtered.filter(row => row.location === location);
        }
        
        // Update filtered data
        DataLoader.filteredData = filtered;
        
        // Update dashboard
        this.updateDashboard();
        
        // Show feedback
        const filterCount = this.getActiveFilterCount();
        if (filterCount > 0) {
            showSuccess(`Filters applied: ${filtered.length} records found`);
        }
        
        console.log('🔍 Filters applied:', {
            startDate,
            endDate,
            location,
            results: filtered.length
        });
    },
    
    // Reset all filters to default
    resetFilters() {
        // Reset form values
        document.getElementById('startDate').value = '2024-01-15';
        document.getElementById('endDate').value = '2024-01-24';
        document.getElementById('locationFilter').value = 'all';
        
        // Reset to all data
        DataLoader.filteredData = [...DataLoader.rawData];
        
        // Update dashboard
        this.updateDashboard();
        
        showSuccess('Filters reset');
        
        console.log('🔄 Filters reset');
    },
    
    // Update entire dashboard with filtered data
    updateDashboard() {
        // Update stats
        DataLoader.updateStats();
        
        // Re-render all charts
        ChartManager.renderAllCharts(DataLoader.filteredData);
    },
    
    // Count how many filters are active
    getActiveFilterCount() {
        let count = 0;
        
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const location = document.getElementById('locationFilter').value;
        
        if (startDate !== '2024-01-15') count++;
        if (endDate !== '2024-01-24') count++;
        if (location !== 'all') count++;
        
        return count;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other modules to load
    setTimeout(() => {
        FilterHandler.init();
    }, 100);
});

// Export for use in other files
window.FilterHandler = FilterHandler;

console.log('✅ Filter Handler module loaded');