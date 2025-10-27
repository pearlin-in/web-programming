// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded!');
    
    // Get all the form elements
    const personalInfoForm = document.getElementById('personalInfoForm');
    const incomeForm = document.getElementById('incomeForm');
    const budgetForm = document.getElementById('budgetForm');
    const preferencesForm = document.getElementById('preferencesForm');
    
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
});

// Load saved data from browser storage
function loadSavedData() {
    console.log('Loading saved data...');
    // This will be filled in later
}

// Handle personal info form submission
function handlePersonalInfoSubmit(event) {
    event.preventDefault();
    console.log('Saving personal info...');
    alert('Personal information saved!');
}

// Handle income form submission  
function handleIncomeSubmit(event) {
    event.preventDefault();
    console.log('Saving income...');
    alert('Income saved!');
}

// Handle budget form submission
function handleBudgetSubmit(event) {
    event.preventDefault();
    console.log('Saving budget limits...');
    alert('Budget limits saved!');
}

// Handle preferences form submission
function handlePreferencesSubmit(event) {
    event.preventDefault();
    console.log('Saving preferences...');
    alert('Preferences saved!'); }