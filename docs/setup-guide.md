# Setup Guide

## For Non-Technical Clients

### Quick Start (10 minutes)

1. **Download the AFTER folder**
   - Contains all working files and data

2. **Customize Your Data**
   - Replace `AFTER/data/sample-data.csv` with your actual business data
   - Keep the same column structure:
```
     date,location,revenue,category,customers
```
   - Date format must be: YYYY-MM-DD (e.g., 2024-01-15)
   - Revenue must be numbers only (no $ signs)

3. **Open the Dashboard**
   - Double-click `AFTER/index.html`
   - Or upload to your web hosting

4. **Use the Filters**
   - Select date range to view specific periods
   - Choose location to see individual store performance
   - Click "Apply Filters" to update charts
   - Click "Reset" to see all data again

5. **Export Reports**
   - Click "Export CSV" to download current view
   - File includes all filtered data
   - Opens in Excel, Google Sheets, or any spreadsheet app

### Uploading to Your Website

**For WordPress:**
- Install "Insert Headers and Footers" plugin
- Upload AFTER folder via FTP to `/wp-content/uploads/dashboard/`
- Create new page, add custom HTML block
- Embed: `<iframe src="/wp-content/uploads/dashboard/index.html" width="100%" height="800px"></iframe>`

**For Basic Web Hosting (cPanel/FTP):**
- Upload entire AFTER folder to `public_html/dashboard/`
- Access at: `yourdomain.com/dashboard/index.html`

**For Static Hosting (Netlify/Vercel):**
- Drag and drop AFTER folder
- Instant deployment with custom domain support

---

## For Developers

### Installation
```bash
# Clone repository
git clone https://github.com/bKostadinovic/dashboard-rescue-csv-fixer.git

# Navigate to working version
cd dashboard-rescue-csv-fixer/AFTER

# No build process needed - pure HTML/CSS/JS
# Use Live Server or any local server to avoid CORS issues
```

### Tech Stack

**Core Technologies:**
- HTML5 - Semantic structure
- CSS3 - Responsive design with gradients
- JavaScript (ES6+) - Modules, async/await
- Chart.js 4.4.0 - Data visualization
- PapaParse 5.4.1 - CSV parsing

**No frameworks, no build tools, no dependencies to install.**

---

### File Structure
```
AFTER/
├── index.html              # Main dashboard HTML
├── css/
│   └── styles.css          # All styling (responsive, modern)
├── js/
│   ├── data-loader.js      # CSV loading and data processing
│   ├── chart-manager.js    # Chart.js visualization rendering
│   ├── filter-handler.js   # Filter logic and UI updates
│   └── csv-exporter.js     # Clean CSV export functionality
└── data/
    └── sample-data.csv     # Example data (replace with real data)
```

---

### Customization

#### 1. Change Data Source

**Option A: Replace CSV file**
```bash
# Simply replace the CSV file
cp your-data.csv AFTER/data/sample-data.csv
```

**Option B: Load from API**

Edit `js/data-loader.js`:
```javascript
async loadData() {
    try {
        // Replace fetch URL with your API endpoint
        const response = await fetch('https://your-api.com/sales-data');
        const data = await response.json();
        
        // Transform API response to match expected format
        this.rawData = data.map(item => ({
            date: item.date,
            location: item.store_name,
            revenue: item.total_sales,
            category: item.product_type,
            customers: item.customer_count
        }));
        
        this.filteredData = [...this.rawData];
        this.initializeDashboard();
    } catch (error) {
        showError('Failed to load data from API');
    }
}
```

#### 2. Add New Chart Types

Edit `js/chart-manager.js`:
```javascript
// Add a new chart method
renderNewChart(data) {
    const ctx = document.getElementById('newChartCanvas');
    
    new Chart(ctx, {
        type: 'doughnut', // or 'radar', 'polarArea', etc.
        data: {
            labels: [...],
            datasets: [{
                data: [...],
                backgroundColor: [...]
            }]
        },
        options: {
            // Chart options
        }
    });
}

// Call it in renderAllCharts()
renderAllCharts(data) {
    this.renderRevenueChart(data);
    this.renderCategoryChart(data);
    this.renderCustomerChart(data);
    this.renderNewChart(data); // Add this line
}
```

Don't forget to add the canvas in `index.html`:
```html
<div class="chart-container">
    <h2>Your New Chart Title</h2>
    <canvas id="newChartCanvas"></canvas>
</div>
```

#### 3. Customize Colors and Theme

Edit `css/styles.css`:

**Change gradient background:**
```css
body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

**Change chart colors:**
Edit `js/chart-manager.js`:
```javascript
backgroundColor: [
    'rgba(102, 126, 234, 0.8)', // Replace with your colors
    'rgba(118, 75, 162, 0.8)'
]
```

#### 4. Add More Filter Options

Edit `index.html` - add new filter control:
```html
<div class="filter-item">
    <label for="categoryFilter">Category</label>
    <select id="categoryFilter">
        <option value="all">All Categories</option>
        <option value="Coffee">Coffee</option>
        <option value="Pastries">Pastries</option>
    </select>
</div>
```

Edit `js/filter-handler.js` - add filter logic:
```javascript
applyFilters() {
    // ... existing code ...
    
    // Add category filter
    const category = document.getElementById('categoryFilter').value;
    if (category && category !== 'all') {
        filtered = filtered.filter(row => row.category === category);
    }
    
    // ... rest of code ...
}
```

---

### Data Requirements

**CSV Format:**
```csv
date,location,revenue,category,customers
2024-01-15,Downtown,1250.50,Coffee,45
```

**Column Requirements:**

| Column | Type | Format | Required | Example |
|--------|------|--------|----------|---------|
| date | String | YYYY-MM-DD | Yes | 2024-01-15 |
| location | String | Any text | Yes | Downtown |
| revenue | Number | Decimal, no $ | Yes | 1250.50 |
| category | String | Any text | Yes | Coffee |
| customers | Integer | Whole number | Yes | 45 |

**Data Validation:**
- Dates must be valid and in YYYY-MM-DD format
- Revenue must be numeric ($ signs and commas are removed)
- Missing values in required columns will skip that row
- Duplicate entries are allowed (useful for multiple transactions per day)

---

### Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE 11 | - | ❌ Not supported |

**Note:** Chart.js and modern JavaScript features require modern browsers.

---

### Performance Optimization

**For Large Datasets (1000+ rows):**

1. **Implement pagination or virtualization**
2. **Aggregate data on backend before sending**
3. **Use Web Workers for heavy calculations**

Example data aggregation:
```javascript
// Instead of loading all raw transactions
// Aggregate on server and send summary data
{
    daily_totals: [...],
    category_totals: [...],
    location_totals: [...]
}
```

---

### Common Issues & Solutions

#### Issue: Charts not rendering
**Solution:** 
- Check browser console for errors
- Ensure Chart.js CDN is loading
- Verify canvas elements have correct IDs
- Check that data is loaded (console should show "✅ Data loaded successfully")

#### Issue: CSV not loading (CORS error)
**Solution:**
- Don't open HTML file directly (`file://`)
- Use a local server (Live Server extension in VS Code)
- Or use the inline data workaround (see data-loader.js comments)

#### Issue: Filters not working
**Solution:**
- Check console for JavaScript errors
- Verify filter element IDs match JavaScript
- Ensure FilterHandler.init() is called

#### Issue: CSV export downloads empty file
**Solution:**
- Check that filteredData has records
- Try applying filters first, then export
- Check console for export errors

---

### Testing

**Manual Testing Checklist:**

- [ ] Data loads without errors
- [ ] All three charts render correctly
- [ ] Stats cards show correct totals
- [ ] Date filter works (updates charts)
- [ ] Location filter works (updates charts)
- [ ] Reset button restores all data
- [ ] CSV export downloads valid file
- [ ] Exported CSV opens correctly in Excel
- [ ] Responsive design works on mobile (resize browser)
- [ ] No console errors

---

### Deployment

**Static Hosting (Recommended):**

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd AFTER
netlify deploy --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd AFTER
vercel --prod
```

**GitHub Pages:**
1. Push AFTER folder to GitHub
2. Go to repository Settings → Pages
3. Select branch and /AFTER folder
4. Save

**Traditional Hosting:**
- Upload AFTER folder via FTP
- Access at your-domain.com/folder-name/

---

### Security Considerations

**Client-Side Dashboard (Current Implementation):**
- ✅ No backend needed
- ✅ No database to maintain
- ✅ No authentication needed
- ⚠️ All data visible in browser
- ⚠️ CSV file is publicly accessible

**For Production with Sensitive Data:**

1. **Add authentication** (Basic Auth, OAuth)
2. **Move data to backend API** (protected endpoint)
3. **Implement user roles** (admin, viewer, etc.)
4. **Use HTTPS** (SSL certificate)
5. **Add rate limiting** (prevent abuse)

Example basic auth with Netlify:
```toml
# netlify.toml
[[redirects]]
  from = "/dashboard/*"
  to = "/dashboard/:splat"
  status = 200
  force = true
  headers = {X-Frame-Options = "DENY"}
  conditions = {Role = ["admin"]}
```

---

## Support

For questions about this code:
- **GitHub:** https://github.com/bKostadinovic/dashboard-rescue-csv-fixer
- **Email:** bkostadinovic1990@gmail.com

---

## Hire Me

Need help customizing this dashboard or building something similar?

**Upwork:** https://www.upwork.com/freelancers/~0131475cd060f3f7ea  
**Fiverr:** https://www.fiverr.com/b_kostadinovic  
**Email:** bkostadinovic1990@gmail.com

I specialize in:
- ✅ Completing abandoned dashboard projects
- ✅ Fixing broken data visualizations
- ✅ CSV/Excel data integration
- ✅ Custom Chart.js implementations
- ✅ Dashboard customization and enhancement

**Typical turnaround:** 3-5 days for dashboard completion projects

---

## License

MIT License - Free to use for personal and client projects