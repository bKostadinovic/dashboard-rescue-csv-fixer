// BROKEN DASHBOARD - Abandoned by previous developer
// Multiple critical bugs that prevent charts from rendering

// Bug #1: Data is hard-coded and wrong structure
var salesData = [
    { date: '2024-01-15', revenue: 1250 },
    // Incomplete data - previous dev never finished this
];

// Bug #2: CSV file referenced but never loaded
// File path is wrong, and no error handling
function loadCSVData() {
    // This function was supposed to load broken-data.csv but was never implemented
    console.log('TODO: Load CSV file');
    // Returns nothing, so data is undefined
}

// Bug #3: Chart initialization references wrong IDs
function initCharts() {
    // Canvas elements exist but this tries to initialize non-existent elements
    const ctx1 = document.getElementById('revenueChartWRONG_ID').getContext('2d');
    // This will throw error: Cannot read property 'getContext' of null
    
    // Chart.js is loaded but never actually used
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],  // Empty - no data
            datasets: [{
                label: 'Revenue',
                data: []  // Empty - no data
            }]
        }
    });
    
    // Other charts never even attempted
}

// Bug #4: filterData function referenced in HTML but not defined
// Clicking "Apply Filters" button throws error
// Function name is misspelled or missing entirely

// Bug #5: exportToCSV function referenced but not defined
// Clicking "Export CSV" throws error

// Bug #6: No error handling anywhere
// When things fail, they fail silently or crash loudly

// Bug #7: Data processing functions incomplete
function processData(data) {
    // Was supposed to clean and format data
    // Never finished
    return data; // Just returns whatever was passed (probably undefined)
}

// Bug #8: Attempted to calculate totals but logic is wrong
function calculateTotals() {
    var total = 0;
    // Tries to loop over undefined data
    for (var i = 0; i < salesData.length; i++) {
        total += salesData[i].revenue;
    }
    return total; // Returns 1250 (only one item in array)
}

// Bug #9: This runs on page load and immediately throws errors
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loading...');
    
    // Try to load data (doesn't work)
    loadCSVData();
    
    // Try to initialize charts (fails with error)
    initCharts();
    
    // Calculate totals (wrong result)
    var total = calculateTotals();
    console.log('Total revenue:', total);
    
    // Nothing actually displays because everything failed
});

// Bug #10: Console shows multiple errors:
// - Uncaught TypeError: Cannot read property 'getContext' of null
// - Uncaught ReferenceError: filterData is not defined
// - Uncaught ReferenceError: exportToCSV is not defined

console.log('Broken dashboard script loaded (but nothing works)');