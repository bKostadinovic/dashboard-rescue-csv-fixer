// CSV Exporter - Handles clean CSV export functionality

const CSVExporter = {
    // Initialize export button
    init() {
        const exportBtn = document.getElementById('exportCSV');
        exportBtn.addEventListener('click', () => this.exportToCSV());
        
        console.log('✅ CSV Exporter initialized');
    },
    
    // Export current filtered data to CSV
    exportToCSV() {
        try {
            const data = DataLoader.filteredData;
            
            if (data.length === 0) {
                showError('No data to export');
                return;
            }
            
            // Convert data to CSV format
            const csv = this.convertToCSV(data);
            
            // Create download
            this.downloadCSV(csv, this.generateFilename());
            
            showSuccess(`Exported ${data.length} records successfully`);
            
            console.log('📥 CSV exported:', data.length, 'records');
            
        } catch (error) {
            console.error('Export error:', error);
            showError('Failed to export CSV. Please try again.');
        }
    },
    
    // Convert data array to CSV string
    convertToCSV(data) {
        if (data.length === 0) return '';
        
        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Create header row
        const headerRow = headers.join(',');
        
        // Create data rows
        const dataRows = data.map(row => {
            return headers.map(header => {
                let value = row[header];
                
                // Handle different data types
                if (value === null || value === undefined) {
                    return '';
                }
                
                // Format numbers
                if (typeof value === 'number') {
                    // Keep 2 decimal places for revenue
                    if (header === 'revenue') {
                        return value.toFixed(2);
                    }
                    return value;
                }
                
                // Escape strings with commas or quotes
                if (typeof value === 'string') {
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        // Escape quotes and wrap in quotes
                        return '"' + value.replace(/"/g, '""') + '"';
                    }
                }
                
                return value;
            }).join(',');
        });
        
        // Combine header and data
        return [headerRow, ...dataRows].join('\n');
    },
    
    // Trigger download of CSV file
    downloadCSV(csvContent, filename) {
        // Create blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            // Modern browsers
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            
            // Trigger download
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            setTimeout(() => {
                URL.revokeObjectURL(link.href);
            }, 100);
        }
    },
    
    // Generate filename with timestamp
    generateFilename() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `sales-data-${year}${month}${day}-${hours}${minutes}.csv`;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other modules to load
    setTimeout(() => {
        CSVExporter.init();
    }, 100);
});

// Export for use in other files
window.CSVExporter = CSVExporter;

console.log('✅ CSV Exporter module loaded');