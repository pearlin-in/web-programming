// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded!');
    
    // Get all the form elements
    const personalInfoForm = document.getElementById('personalInfoForm');
    const incomeForm = document.getElementById('incomeForm');
    const budgetForm = document.getElementById('budgetForm');
    const preferencesForm = document.getElementById('preferencesForm');
    const darkModeToggle = document.querySelector('input[data-preference="darkMode"]');
    
    // Load any saved data when page loads
    loadSavedData();
    
    // Set up form submissions
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', handlePersonalInfoSubmit);
    }
    if (incomeForm) {
        incomeForm.addEventListener('submit', handleIncomeSubmit);
    }
    if (budgetForm) {
        budgetForm.addEventListener('submit', handleBudgetSubmit);
    }
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    }
    
    // Set up dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', handleDarkModeToggle);
    }
});

// Load saved data from browser storage
function loadSavedData() {
    console.log('Loading saved data...');
    
    // Load preferences including dark mode
    const savedPreferences = localStorage.getItem('preferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        const preferenceInputs = document.querySelectorAll('.preference-item input');
        
        preferenceInputs.forEach(input => {
            const preference = input.getAttribute('data-preference');
            if (preferences[preference] !== undefined) {
                input.checked = preferences[preference];
                
                // Apply dark mode immediately if it was saved as enabled
                if (preference === 'darkMode' && preferences[preference]) {
                    document.body.classList.add('dark-mode');
                }
            }
        });
    }
    
    // Load personal info
    const savedPersonalInfo = localStorage.getItem('personalInfo');
    if (savedPersonalInfo) {
        const personalInfo = JSON.parse(savedPersonalInfo);
        document.getElementById('fullName').value = personalInfo.fullName;
        document.getElementById('email').value = personalInfo.email;
        document.getElementById('phone').value = personalInfo.phone;
        document.getElementById('currency').value = personalInfo.currency;
        
        // Update the profile header with the saved name and email
        document.getElementById('userName').textContent = personalInfo.fullName;
        document.getElementById('userEmail').textContent = personalInfo.email;
    }

    // Load monthly income
    const savedIncome = localStorage.getItem('monthlyIncome');
    if (savedIncome) {
        document.getElementById('monthlyIncome').value = savedIncome;
    }

    // Load budget limits
    const savedBudgetLimits = localStorage.getItem('budgetLimits');
    if (savedBudgetLimits) {
        const budgetLimits = JSON.parse(savedBudgetLimits);
        
        // Update each budget input field
        const budgetInputs = document.querySelectorAll('.budget-category input');
        budgetInputs.forEach(input => {
            const category = input.getAttribute('data-category');
            if (budgetLimits[category]) {
                input.value = budgetLimits[category];
            }
        });
    }
}

// Handle dark mode toggle
function handleDarkModeToggle(event) {
    const isDarkMode = event.target.checked;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        console.log('Dark mode enabled');
    } else {
        document.body.classList.remove('dark-mode');
        console.log('Dark mode disabled');
    }
}

// Handle personal info form submission
function handlePersonalInfoSubmit(event) {
    event.preventDefault();
    
    // Get the form values
    const personalInfo = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        currency: document.getElementById('currency').value
    };
    
    // Save to localStorage
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    
    // Update the profile header
    document.getElementById('userName').textContent = personalInfo.fullName;
    document.getElementById('userEmail').textContent = personalInfo.email;
    
    // Show a success message
    showNotification('Personal information saved successfully!', 'success');
}

// Handle income form submission
function handleIncomeSubmit(event) {
    event.preventDefault();
    
    const monthlyIncome = document.getElementById('monthlyIncome').value;
    
    // Save to localStorage
    localStorage.setItem('monthlyIncome', monthlyIncome);
    
    showNotification('Monthly income saved successfully!', 'success');
}

// Handle budget form submission
function handleBudgetSubmit(event) {
    event.preventDefault();
    
    // Create an object to store all budget limits
    const budgetLimits = {};
    
    // Get all budget input fields
    const budgetInputs = document.querySelectorAll('.budget-category input');
    
    // Loop through each input and save its value
    budgetInputs.forEach(input => {
        const category = input.getAttribute('data-category');
        budgetLimits[category] = input.value;
    });
    
    // Save to localStorage
    localStorage.setItem('budgetLimits', JSON.stringify(budgetLimits));
    
    showNotification('Budget limits saved successfully!', 'success');
}

// Handle preferences form submission
function handlePreferencesSubmit(event) {
    event.preventDefault();
    
    // Create an object to store all preferences
    const preferences = {};
    
    // Get all preference toggle inputs
    const preferenceInputs = document.querySelectorAll('.preference-item input');
    
    // Loop through each input and save its checked state
    preferenceInputs.forEach(input => {
        const preference = input.getAttribute('data-preference');
        preferences[preference] = input.checked;
    });
    
    // Save to localStorage
    localStorage.setItem('preferences', JSON.stringify(preferences));
    
    showNotification('Preferences saved successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    
    // Style the notification
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '5px',
        color: 'white',
        zIndex: '1000',
        fontWeight: '500',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    };
    
    // Apply styles
    Object.assign(notification.style, styles);
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    // Add to the page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}