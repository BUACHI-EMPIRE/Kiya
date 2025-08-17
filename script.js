// Sales Management System - JavaScript

// Global variables
let products = [];
let sales = [];
let salesManagers = [];
let salesChart = null;
let productsChart = null;
let currentPin = '1234'; // Default PIN

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadData();
    setupEventListeners();
    setCurrentDate();
    updateDashboard();
    setupMobileFunctionality();
}

// Mobile Functionality
function setupMobileFunctionality() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.add('mobile-open');
            mobileOverlay.classList.add('active');
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        });
    }

    // Close mobile menu when clicking on navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        }
    });
}

// Data Management Functions
function loadData() {
    // Load saved PIN or use default
    currentPin = localStorage.getItem('salesManager_pin') || '1234';
    
    // Load data from localStorage
    products = JSON.parse(localStorage.getItem('salesManager_products')) || [];
    sales = JSON.parse(localStorage.getItem('salesManager_sales')) || [];
    salesManagers = JSON.parse(localStorage.getItem('salesManager_salesManagers')) || [];
}

function saveData() {
    localStorage.setItem('salesManager_products', JSON.stringify(products));
    localStorage.setItem('salesManager_sales', JSON.stringify(sales));
    localStorage.setItem('salesManager_salesManagers', JSON.stringify(salesManagers));
}

function clearAllData() {
    const pin = prompt(`Enter PIN to clear all data (current: ${currentPin}):`);
    
    if (pin === null) {
        // User cancelled
        return;
    }
    
    if (pin === currentPin) {
        if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
            localStorage.removeItem('salesManager_products');
            localStorage.removeItem('salesManager_sales');
            localStorage.removeItem('salesManager_salesManagers');
            
            products = [];
            sales = [];
            salesManagers = [];
            
            showNotification('All data cleared successfully!', 'success');
        }
    } else {
        showNotification('Incorrect PIN! Data not cleared.', 'error');
    }
}

function showChangePinModal() {
    document.getElementById('changePinModal').classList.remove('hidden');
    document.getElementById('changePinForm').reset();
}

function handleChangePin(event) {
    event.preventDefault();
    
    console.log('handleChangePin function called');
    
    const currentPinInput = document.getElementById('currentPin').value;
    const newPin = document.getElementById('newPin').value;
    const confirmPin = document.getElementById('confirmPin').value;
    
    console.log('Form values:', { currentPinInput, newPin, confirmPin, currentPin });
    
    // Validate current PIN
    if (currentPinInput !== currentPin) {
        console.log('Current PIN validation failed');
        showNotification('Current PIN is incorrect!', 'error');
        return;
    }
    
    // Validate new PIN
    if (newPin.length < 4) {
        console.log('New PIN length validation failed');
        showNotification('New PIN must be at least 4 digits!', 'error');
        return;
    }
    
    // Validate PIN confirmation
    if (newPin !== confirmPin) {
        console.log('PIN confirmation validation failed');
        showNotification('New PIN and confirmation do not match!', 'error');
        return;
    }
    
    // Update PIN
    currentPin = newPin;
    localStorage.setItem('salesManager_pin', currentPin);
    
    console.log('PIN updated successfully:', currentPin);
    
    closeModal('changePinModal');
    showNotification('PIN changed successfully!', 'success');
}

// UI Functions
function setupEventListeners() {
    // Add event listener for PIN change form
    const changePinForm = document.getElementById('changePinForm');
    if (changePinForm) {
        changePinForm.addEventListener('submit', handleChangePin);
        console.log('PIN change form event listener added');
    } else {
        console.error('Change PIN form not found!');
    }
    
    // Add event listeners for other forms
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
        console.log('Add product form event listener added');
    }
    
    const addSaleForm = document.getElementById('addSaleForm');
    if (addSaleForm) {
        addSaleForm.addEventListener('submit', handleAddSale);
        console.log('Add sale form event listener added');
    }
    
    const addSalesManagerForm = document.getElementById('addSalesManagerForm');
    if (addSalesManagerForm) {
        addSalesManagerForm.addEventListener('submit', handleAddSalesManager);
        console.log('Add sales manager form event listener added');
    }
    
    // Set current date for sale form
    const saleDateInput = document.getElementById('saleDate');
    if (saleDateInput) {
        saleDateInput.value = new Date().toISOString().split('T')[0];
    }
}

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDateElement = document.getElementById('currentDate');
    const mobileCurrentDateElement = document.getElementById('mobileCurrentDate');
    
    if (currentDateElement) {
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    if (mobileCurrentDateElement) {
        mobileCurrentDateElement.textContent = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
}

function showSection(sectionName) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.remove('hidden');
    event.target.classList.add('active');
    updatePageHeader(sectionName);
    
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
                    break;
        case 'products':
            renderProductsTable();
            break;
        case 'sales':
            renderSalesTable();
            break;
        case 'salesManagers':
            renderSalesManagersTable();
            break;
        case 'reports':
            populateFilterOptions();
                    break;
    }
}

function updatePageHeader(sectionName) {
    const titles = {
        dashboard: { title: 'Dashboard', subtitle: 'Welcome to your sales management dashboard' },
        products: { title: 'Products Management', subtitle: 'Manage your product inventory' },
        sales: { title: 'Sales Transactions', subtitle: 'Record and view sales data' },
        salesManagers: { title: 'Sales Managers', subtitle: 'Manage your sales team and track performance' },
        reports: { title: 'Reports & Analytics', subtitle: 'Generate detailed sales reports' }
    };
    
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const mobilePageTitle = document.getElementById('mobilePageTitle');
    const mobilePageSubtitle = document.getElementById('mobilePageSubtitle');
    
    if (pageTitle && pageSubtitle && titles[sectionName]) {
        pageTitle.textContent = titles[sectionName].title;
        pageSubtitle.textContent = titles[sectionName].subtitle;
    }
    
    if (mobilePageTitle && mobilePageSubtitle && titles[sectionName]) {
        mobilePageTitle.textContent = titles[sectionName].title;
        mobilePageSubtitle.textContent = titles[sectionName].subtitle;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleBtn = document.getElementById('toggleSidebar');
    
    if (sidebar && mainContent && toggleBtn) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        if (sidebar.classList.contains('collapsed')) {
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right text-sm"></i><span class="sidebar-text text-sm">Expand</span>';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left text-sm"></i><span class="sidebar-text text-sm">Collapse</span>';
        }
    }
}

// Modal Functions
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const form = document.getElementById('addProductForm');
    if (modal && form) {
        modal.classList.remove('hidden');
        form.reset();
    }
}

function showAddSaleModal() {
    const modal = document.getElementById('addSaleModal');
    const form = document.getElementById('addSaleForm');
    if (modal && form) {
        modal.classList.remove('hidden');
        form.reset();
        const saleDateInput = document.getElementById('saleDate');
        if (saleDateInput) {
            saleDateInput.value = new Date().toISOString().split('T')[0];
        }
        populateSaleDropdowns();
    }
}

function showAddSalesManagerModal() {
    const modal = document.getElementById('addSalesManagerModal');
    const form = document.getElementById('addSalesManagerForm');
    if (modal && form) {
        modal.classList.remove('hidden');
        form.reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function populateSaleDropdowns() {
    const productSelect = document.getElementById('saleProduct');
    const salesManagerSelect = document.getElementById('saleSalesManager');
    
    if (productSelect) {
        productSelect.innerHTML = '<option value="">Select a product</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - GH₵${product.price} (Stock: ${product.stock})`;
            productSelect.appendChild(option);
        });
    }
    
    if (salesManagerSelect) {
        salesManagerSelect.innerHTML = '<option value="">Select a sales manager</option>';
        salesManagers.forEach(salesManager => {
            const option = document.createElement('option');
            option.value = salesManager.id;
            option.textContent = salesManager.name;
            salesManagerSelect.appendChild(option);
        });
    }
}

function populateFilterOptions() {
    const productFilter = document.getElementById('productFilter');
    const salesManagerFilter = document.getElementById('customerFilter'); // Keep ID for compatibility
    
    if (productFilter) {
        productFilter.innerHTML = '<option value="">All Products</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            productFilter.appendChild(option);
        });
    }
    
    if (salesManagerFilter) {
        salesManagerFilter.innerHTML = '<option value="">All Sales Managers</option>';
        salesManagers.forEach(salesManager => {
            const option = document.createElement('option');
            option.value = salesManager.id;
            option.textContent = salesManager.name;
            salesManagerFilter.appendChild(option);
        });
    }
}

// Form Handlers
function handleAddProduct(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('productName');
    const categoryInput = document.getElementById('productCategory');
    const priceInput = document.getElementById('productPrice');
    const stockInput = document.getElementById('productStock');
    
    if (!nameInput || !categoryInput || !priceInput || !stockInput) {
        showNotification('Product form elements not found!', 'error');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: nameInput.value,
        category: categoryInput.value,
        price: parseFloat(priceInput.value),
        stock: parseInt(stockInput.value)
    };
    
    products.push(product);
    saveData();
    
    closeModal('addProductModal');
    updateDashboard();
    renderProductsTable();
    populateFilterOptions();
    
    showNotification('Product added successfully!', 'success');
}

function handleAddSale(event) {
    event.preventDefault();
    
    const productId = parseInt(document.getElementById('saleProduct').value);
    const salesManagerId = parseInt(document.getElementById('saleSalesManager').value);
    const customerName = document.getElementById('saleCustomer').value;
    const quantity = parseInt(document.getElementById('saleQuantity').value);
    const date = document.getElementById('saleDate').value;
    
    const product = products.find(p => p.id === productId);
    const salesManager = salesManagers.find(sm => sm.id === salesManagerId);
    
    if (!product || !salesManager) {
        showNotification('Please select valid product and sales manager', 'error');
        return;
    }
    
    if (product.stock < quantity) {
        showNotification('Insufficient stock!', 'error');
        return;
    }
    
    const sale = {
        id: Date.now(),
        productId: productId,
        salesManagerId: salesManagerId,
        customerName: customerName,
        quantity: quantity,
        date: date,
        total: product.price * quantity
    };
    
    product.stock -= quantity;
    
    sales.push(sale);
    saveData();
    
    closeModal('addSaleModal');
    updateDashboard();
    renderSalesTable();
    renderProductsTable();
    
    showNotification('Sale recorded successfully!', 'success');
}

function handleAddSalesManager(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('salesManagerName');
    const emailInput = document.getElementById('salesManagerEmail');
    const phoneInput = document.getElementById('salesManagerPhone');
    const addressInput = document.getElementById('salesManagerAddress');
    
    if (!nameInput || !emailInput || !phoneInput || !addressInput) {
        showNotification('Sales manager form elements not found!', 'error');
        return;
    }
    
    const salesManager = {
        id: Date.now(),
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        address: addressInput.value
    };
    
    salesManagers.push(salesManager);
    saveData();
    
    closeModal('addSalesManagerModal');
    updateDashboard();
    renderSalesManagersTable();
    populateFilterOptions();
    
    showNotification('Sales manager added successfully!', 'success');
}

// Table Rendering Functions
function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-3 md:px-6 py-4 text-center text-gray-500">No products found</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        const statusClass = product.stock > 10 ? 'status-active' : product.stock > 0 ? 'status-pending' : 'status-inactive';
        const statusText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
        
        row.innerHTML = `
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${product.name}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${product.category}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">GH₵${product.price.toFixed(2)}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${product.stock}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <span class="status-badge ${statusClass}">${statusText}</span>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editProduct(${product.id})" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderSalesTable() {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-3 md:px-6 py-4 text-center text-gray-500">No sales found</td></tr>';
        return;
    }
    
    sales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const salesManager = salesManagers.find(sm => sm.id === sale.salesManagerId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${formatDate(sale.date)}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${product ? product.name : 'Unknown'}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${salesManager ? salesManager.name : 'Unknown'}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${sale.customerName}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${sale.quantity}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">GH₵${sale.total.toFixed(2)}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteSale(${sale.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderSalesManagersTable() {
    const tbody = document.getElementById('salesManagersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (salesManagers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-3 md:px-6 py-4 text-center text-gray-500">No sales managers found</td></tr>';
        return;
    }
    
    salesManagers.forEach(salesManager => {
        const managerSales = sales.filter(s => s.salesManagerId === salesManager.id);
        const totalSales = managerSales.length;
        const totalRevenue = managerSales.reduce((sum, sale) => sum + sale.total, 0);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${salesManager.name}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${salesManager.email}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${salesManager.phone}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${totalSales}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">GH₵${totalRevenue.toFixed(2)}</div>
            </td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editSalesManager(${salesManager.id})" class="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                <button onclick="deleteSalesManager(${salesManager.id})" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Dashboard Functions
function updateDashboard() {
    updateStats();
    updateRecentSales();
    updateLowStockAlert();
}

function updateStats() {
    const totalSalesAmount = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = sales.length;
    const totalProducts = products.length;
    const totalSalesManagers = salesManagers.length;
    
    const totalSalesElement = document.getElementById('totalSales');
    const totalOrdersElement = document.getElementById('totalOrders');
    const totalProductsElement = document.getElementById('totalProducts');
    const totalCustomersElement = document.getElementById('totalCustomers'); // Keep ID for compatibility
    
    if (totalSalesElement) totalSalesElement.textContent = `GH₵${totalSalesAmount.toFixed(2)}`;
    if (totalOrdersElement) totalOrdersElement.textContent = totalOrders;
    if (totalProductsElement) totalProductsElement.textContent = totalProducts;
    if (totalCustomersElement) totalCustomersElement.textContent = totalSalesManagers;
}

function updateRecentSales() {
    const recentSalesContainer = document.getElementById('recentSales');
    if (!recentSalesContainer) return;
    
    const recentSales = sales.slice(-5).reverse();
    
    if (recentSales.length === 0) {
        recentSalesContainer.innerHTML = `
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-shopping-cart text-3xl md:text-4xl mb-2"></i>
                <p class="text-sm md:text-base">No recent sales</p>
            </div>
        `;
        return;
    }
    
    recentSalesContainer.innerHTML = '';
    recentSales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const salesManager = salesManagers.find(sm => sm.id === sale.salesManagerId);
        
        const saleElement = document.createElement('div');
        saleElement.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        saleElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-shopping-cart text-blue-600 text-sm"></i>
            </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">${product ? product.name : 'Unknown'}</p>
                    <p class="text-xs text-gray-500">${salesManager ? salesManager.name : 'Unknown'} • ${sale.customerName} • ${formatDate(sale.date)}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium text-gray-900">GH₵${sale.total.toFixed(2)}</p>
                <p class="text-xs text-gray-500">Qty: ${sale.quantity}</p>
            </div>
        `;
        recentSalesContainer.appendChild(saleElement);
    });
}

function updateLowStockAlert() {
    const lowStockContainer = document.getElementById('lowStockAlert');
    if (!lowStockContainer) return;
    
    const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0);
    
    if (lowStockProducts.length === 0) {
        lowStockContainer.innerHTML = `
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-exclamation-triangle text-3xl md:text-4xl mb-2"></i>
                <p class="text-sm md:text-base">No low stock items</p>
            </div>
        `;
        return;
    }
    
    lowStockContainer.innerHTML = '';
    lowStockProducts.forEach(product => {
        const alertElement = document.createElement('div');
        alertElement.className = 'flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg';
        alertElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle text-yellow-600 text-sm"></i>
            </div>
                <div>
                    <p class="text-sm font-medium text-gray-900">${product.name}</p>
                    <p class="text-xs text-gray-500">Only ${product.stock} left in stock</p>
                </div>
            </div>
            <div class="text-right">
                <p class="text-sm font-medium text-gray-900">GH₵${product.price.toFixed(2)}</p>
            </div>
        `;
        lowStockContainer.appendChild(alertElement);
    });
}

// Report Functions
function generateReport() {
    const dateRange = parseInt(document.getElementById('dateRange').value) || 0;
    const productFilter = document.getElementById('productFilter').value;
    const salesManagerFilter = document.getElementById('customerFilter').value; // Keep ID for compatibility
    
    const filteredSales = filterSales(dateRange, productFilter, salesManagerFilter);
    displaySalesSummary(filteredSales);
    displayTopPerformers(filteredSales);
    displayDetailedReport(filteredSales);
}

function filterSales(dateRange, productFilter, salesManagerFilter) {
    let filtered = [...sales];
    
    if (dateRange) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateRange);
        filtered = filtered.filter(sale => new Date(sale.date) >= cutoffDate);
    }
    
    if (productFilter) {
        filtered = filtered.filter(sale => sale.productId === parseInt(productFilter));
    }
    
    if (salesManagerFilter) {
        filtered = filtered.filter(sale => sale.salesManagerId === parseInt(salesManagerFilter));
    }
    
    return filtered;
}

function displaySalesSummary(filteredSales) {
    const summaryContainer = document.getElementById('salesSummary');
    if (!summaryContainer) return;
    
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    summaryContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">GH₵${totalRevenue.toFixed(2)}</p>
                <p class="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">${totalOrders}</p>
                <p class="text-sm text-gray-600">Total Orders</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">GH₵${avgOrderValue.toFixed(2)}</p>
                <p class="text-sm text-gray-600">Average Order Value</p>
            </div>
        </div>
    `;
}

function displayTopPerformers(filteredSales) {
    const performersContainer = document.getElementById('topPerformers');
    if (!performersContainer) return;
    
    const productSales = {};
    filteredSales.forEach(sale => {
        if (productSales[sale.productId]) {
            productSales[sale.productId] += sale.quantity;
        } else {
            productSales[sale.productId] = sale.quantity;
        }
    });
    
    const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([productId, quantity]) => {
            const product = products.find(p => p.id === parseInt(productId));
            return { name: product ? product.name : 'Unknown', quantity };
        });
    
    const salesManagerSales = {};
    filteredSales.forEach(sale => {
        if (salesManagerSales[sale.salesManagerId]) {
            salesManagerSales[sale.salesManagerId] += sale.total;
    } else {
            salesManagerSales[sale.salesManagerId] = sale.total;
        }
    });
    
    const topSalesManagers = Object.entries(salesManagerSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([salesManagerId, total]) => {
            const salesManager = salesManagers.find(sm => sm.id === parseInt(salesManagerId));
            return { name: salesManager ? salesManager.name : 'Unknown', total };
        });
    
    performersContainer.innerHTML = `
        <div class="space-y-4">
            <div>
                <h4 class="font-medium text-gray-800 mb-2">Top Products</h4>
                ${topProducts.map((product, index) => `
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-600">#${index + 1}</span>
                            <span class="text-sm text-gray-900">${product.name}</span>
        </div>
                        <span class="text-sm font-medium text-gray-900">${product.quantity} sold</span>
        </div>
                `).join('')}
        </div>
            <div>
                <h4 class="font-medium text-gray-800 mb-2">Top Sales Managers</h4>
                ${topSalesManagers.map((salesManager, index) => `
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-600">#${index + 1}</span>
                            <span class="text-sm text-gray-900">${salesManager.name}</span>
                        </div>
                        <span class="text-sm font-medium text-gray-900">GH₵${salesManager.total.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function displayDetailedReport(filteredSales) {
    const tbody = document.getElementById('reportTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (filteredSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-3 md:px-6 py-4 text-center text-gray-500">No sales found for the selected filters</td></tr>';
        return;
    }
    
    filteredSales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        const salesManager = salesManagers.find(sm => sm.id === sale.salesManagerId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(sale.date)}</td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product ? product.name : 'Unknown'}</td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">${salesManager ? salesManager.name : 'Unknown'}</td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.customerName}</td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">${sale.quantity}</td>
            <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">GH₵${sale.total.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Delete Functions
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveData();
        updateDashboard();
        renderProductsTable();
        populateFilterOptions();
        showNotification('Product deleted successfully!', 'success');
    }
}

function deleteSale(saleId) {
    if (confirm('Are you sure you want to delete this sale?')) {
        const sale = sales.find(s => s.id === saleId);
        if (sale) {
            const product = products.find(p => p.id === sale.productId);
            if (product) {
                product.stock += sale.quantity;
            }
        }
        
        sales = sales.filter(s => s.id !== saleId);
        saveData();
        updateDashboard();
        renderSalesTable();
        renderProductsTable();
        showNotification('Sale deleted successfully!', 'success');
    }
}

function deleteSalesManager(salesManagerId) {
    if (confirm('Are you sure you want to delete this sales manager?')) {
        salesManagers = salesManagers.filter(sm => sm.id !== salesManagerId);
        saveData();
        updateDashboard();
        renderSalesManagersTable();
        populateFilterOptions();
        showNotification('Sales manager deleted successfully!', 'success');
    }
}

// Edit Functions (placeholder for future implementation)
function editProduct(productId) {
    showNotification('Edit functionality coming soon!', 'info');
}

function editSalesManager(salesManagerId) {
    showNotification('Edit functionality coming soon!', 'info');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

// Notification Function
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    
    // Add icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            </div>
    `;
    
    document.body.appendChild(notification);
    
    // Force reflow
    notification.offsetHeight;
    
    // Slide in
    notification.classList.remove('translate-x-full');
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
