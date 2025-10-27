// ===== DATABASE FUNCTIONS =====
// These will connect to your backend later
// For now, they return empty/default values

// Fetch user data from database
function getUserData() {
    // TODO: Replace with actual API call
    // Example: return fetch('/api/user').then(res => res.json());
    return {
        name: 'User',
        email: 'user@example.com'
    };
}

// Fetch total balance from database
function getTotalBalance() {
    // TODO: Replace with actual API call
    // Example: return fetch('/api/balance').then(res => res.json());
    return 0.00;
}

// Fetch monthly stats from database
function getMonthlyStats() {
    // TODO: Replace with actual API call
    // Example: return fetch('/api/stats/monthly').then(res => res.json());
    return {
        income: 0.00,
        expenses: 0.00,
        saved: 0.00,
        change: 0.00
    };
}

// Fetch active goal from database
function getActiveGoal() {
    // TODO: Replace with actual API call
    // Example: return fetch('/api/goals/active').then(res => res.json());
    return null;
}

// Fetch recent transactions from database
function getRecentTransactions() {
    // TODO: Replace with actual API call
    // Example: return fetch('/api/transactions/recent').then(res => res.json());
    return [];
}

// ===== HELPER FUNCTIONS =====

// Format number as currency
function formatMoney(amount) {
    return parseFloat(amount).toFixed(2);
}

// Format date nicely
function formatDate(date) {
    const d = new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

// Get current date string
function getCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Calculate percentage
function calcPercent(current, target) {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
}

// ===== UPDATE UI FUNCTIONS =====

// Update welcome section
function updateWelcome() {
    const user = getUserData();
    $('#user-name').text(user.name);
    $('#current-date').text(getCurrentDate());
}

// Update balance card
function updateBalance() {
    const balance = getTotalBalance();
    const stats = getMonthlyStats();
    
    $('#total-balance').text(formatMoney(balance));
    
    // Update monthly change
    const change = stats.change;
    const arrow = change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
    const sign = change >= 0 ? '+' : '';
    
    $('#monthly-change').html(`
        <i class="fas ${arrow}"></i> ${sign}$${formatMoney(Math.abs(change))} this month
    `);
}

// Update stats boxes
function updateStats() {
    const stats = getMonthlyStats();
    
    $('#income').text(formatMoney(stats.income));
    $('#expenses').text(formatMoney(stats.expenses));
    $('#saved').text(formatMoney(stats.saved));
}

// Update goal section
function updateGoal() {
    const goal = getActiveGoal();
    const container = $('#goal-container');
    
    if (!goal) {
        container.html(`
            <div class="no-data">
                <i class="fas fa-bullseye"></i>
                <p>No active goals</p>
                <button class="btn-primary">Set a Goal</button>
            </div>
        `);
        return;
    }
    
    const percent = calcPercent(goal.current, goal.target);
    
    container.html(`
        <div class="goal-item">
            <div class="goal-header">
                <span class="goal-title">${goal.title}</span>
                <span class="goal-amount">
                    $${formatMoney(goal.current)} / $${formatMoney(goal.target)}
                </span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
            <div class="progress-text">${percent.toFixed(0)}% complete</div>
        </div>
    `);
}

// Update transactions list
function updateTransactions() {
    const txns = getRecentTransactions();
    const list = $('#transactions-list');
    
    if (!txns || txns.length === 0) {
        list.html(`
            <div class="no-data">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    txns.forEach(t => {
        const type = t.type === 'income' ? 'income' : 'expense';
        const icon = t.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up';
        const sign = t.type === 'income' ? '+' : '-';
        
        html += `
            <div class="transaction-item">
                <div class="transaction-icon ${type}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-title">${t.title}</div>
                    <div class="transaction-category">${t.category}</div>
                </div>
                <div class="transaction-amount">
                    <div class="amount ${type}">${sign}$${formatMoney(t.amount)}</div>
                    <div class="transaction-date">${formatDate(t.date)}</div>
                </div>
            </div>
        `;
    });
    
    list.html(html);
}

// ===== ANIMATION FUNCTIONS =====

// Fade in elements with delay
function fadeInElements() {
    $('.welcome').hide().fadeIn(600);
    $('.balance-card').hide().fadeIn(800);
    $('.goal-section').hide().fadeIn(1000);
    $('.stats').hide().fadeIn(1200);
    $('.transactions-section').hide().fadeIn(1400);
    $('.actions').hide().fadeIn(1600);
}

// Animate numbers counting up
function animateNumber(elem, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        $(elem).text(formatMoney(current));
    }, 16);
}

// ===== EVENT HANDLERS =====

// Logout button
$('.logout-btn').click(function() {
    if (confirm('Are you sure you want to logout?')) {
        // TODO: Add logout API call
        alert('Logout functionality will be connected to backend');
        // window.location.href = 'login.html';
    }
});

// Quick action buttons
$('.action-btn').click(function() {
    const text = $(this).find('span').text();
    alert(`${text} functionality will be added soon!`);
});

// Set goal button
$(document).on('click', '.btn-primary', function() {
    alert('Goal setting functionality will be added soon!');
});

// ===== INITIALIZATION =====

// Run when page loads
$(document).ready(function() {
    console.log('Finance App Homepage Loaded');
    
    // Update all sections
    updateWelcome();
    updateBalance();
    updateStats();
    updateGoal();
    updateTransactions();
    
    // Add animations
    fadeInElements();
    
    // Log for testing
    console.log('All functions ready for database connection');
    console.log('Update these functions in script.js when backend is ready:');
    console.log('- getUserData()');
    console.log('- getTotalBalance()');
    console.log('- getMonthlyStats()');
    console.log('- getActiveGoal()');
    console.log('- getRecentTransactions()');
});

// ===== FOR TESTING: Sample Data Loader =====
// Remove this section when connecting to real database

function loadSampleData() {
    // Override database functions with sample data
    getUserData = function() {
        return {
            name: 'Pearlin',
            email: 'pearlin@example.com'
        };
    };
    
    getTotalBalance = function() {
        return 2450.00;
    };
    
    getMonthlyStats = function() {
        return {
            income: 3500.00,
            expenses: 1260.00,
            saved: 2240.00,
            change: 340.00
        };
    };
    
    getActiveGoal = function() {
        return {
            title: 'Emergency Fund',
            current: 2450,
            target: 5000,
            category: 'Savings'
        };
    };
    
    getRecentTransactions = function() {
        return [
            {
                title: 'Salary',
                amount: 3000,
                type: 'income',
                category: 'Salary',
                date: '2024-10-01'
            },
            {
                title: 'Rent Payment',
                amount: 800,
                type: 'expense',
                category: 'Housing',
                date: '2024-10-05'
            },
            {
                title: 'Groceries',
                amount: 150,
                type: 'expense',
                category: 'Food',
                date: '2024-10-10'
            },
            {
                title: 'Freelance Work',
                amount: 500,
                type: 'income',
                category: 'Freelance',
                date: '2024-10-15'
            },
            {
                title: 'Gym Membership',
                amount: 50,
                type: 'expense',
                category: 'Health',
                date: '2024-10-20'
            }
        ];
    };
    
    // Refresh UI with sample data
    updateWelcome();
    updateBalance();
    updateStats();
    updateGoal();
    updateTransactions();
}

// Uncomment this line to test with sample data
// loadSampleData();