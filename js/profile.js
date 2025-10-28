document.addEventListener('DOMContentLoaded', () => {
    const personalForm = document.getElementById('personalInfoForm');
    const incomeForm = document.getElementById('incomeForm');
    const budgetForm = document.getElementById('budgetForm');
    const preferencesForm = document.getElementById('preferencesForm');
    const editBtn = document.getElementById('editProfileBtn');
    const darkModeInput = document.querySelector('input[data-preference="darkMode"]');

    // Load data from localStorage
    loadData();

    // Toggle edit mode
    editBtn.addEventListener('click', () => {
        const inputs = personalForm.querySelectorAll('input, select');
        inputs.forEach(i => {
            i.readOnly = !i.readOnly;
            if (i.tagName === 'SELECT') i.disabled = !i.disabled;
        });
        editBtn.textContent = inputs[0].readOnly ? 'Edit Profile' : 'Cancel';
    });

    personalForm.addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            currency: document.getElementById('currency').value
        };
        localStorage.setItem('personalInfo', JSON.stringify(data));
        document.getElementById('userName').textContent = data.fullName;
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('profileInitials').textContent = data.fullName.split(' ').map(n => n[0]).join('');
        showNotification('Personal info saved ✅');
    });

    incomeForm.addEventListener('submit', e => {
        e.preventDefault();
        const income = document.getElementById('monthlyIncome').value;
        localStorage.setItem('monthlyIncome', income);
        showNotification('Income saved ✅');
    });

    budgetForm.addEventListener('submit', e => {
        e.preventDefault();
        const limits = {};
        budgetForm.querySelectorAll('input[data-category]').forEach(input => {
            limits[input.dataset.category] = input.value;
        });
        localStorage.setItem('budgetLimits', JSON.stringify(limits));
        showNotification('Budget limits saved ✅');
    });

    preferencesForm.addEventListener('submit', e => {
        e.preventDefault();
        const prefs = {};
        preferencesForm.querySelectorAll('input[type="checkbox"]').forEach(input => {
            prefs[input.dataset.preference] = input.checked;
        });
        localStorage.setItem('preferences', JSON.stringify(prefs));
        applyDarkMode(prefs.darkMode);
        showNotification('Preferences saved ✅');
    });

    darkModeInput.addEventListener('change', e => {
        applyDarkMode(e.target.checked);
        const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
        prefs.darkMode = e.target.checked;
        localStorage.setItem('preferences', JSON.stringify(prefs));
    });

    function loadData() {
        // Personal info
        const info = JSON.parse(localStorage.getItem('personalInfo') || '{}');
        if (info.fullName) {
            document.getElementById('fullName').value = info.fullName;
            document.getElementById('email').value = info.email || '';
            document.getElementById('phone').value = info.phone || '';
            document.getElementById('currency').value = info.currency || 'USD';
            document.getElementById('userName').textContent = info.fullName;
            document.getElementById('userEmail').textContent = info.email || '';
            document.getElementById('profileInitials').textContent = info.fullName.split(' ').map(n => n[0]).join('');
        }

        // Income
        document.getElementById('monthlyIncome').value = localStorage.getItem('monthlyIncome') || '';

        // Budget
        const budget = JSON.parse(localStorage.getItem('budgetLimits') || '{}');
        Object.keys(budget).forEach(cat => {
            const input = document.querySelector(`input[data-category="${cat}"]`);
            if (input) input.value = budget[cat];
        });

        // Preferences
        const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
        Object.keys(prefs).forEach(p => {
            const input = document.querySelector(`input[data-preference="${p}"]`);
            if (input) input.checked = prefs[p];
        });
        applyDarkMode(prefs.darkMode);
    }

    function applyDarkMode(enabled) {
        if (enabled) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
    }

    function showNotification(msg) {
        const n = document.createElement('div');
        n.className = 'notification';
        n.textContent = msg;
        Object.assign(n.style, {
            position: 'fixed', top: '20px', right: '20px',
            background: '#4caf50', color: '#fff', padding: '10px 20px',
            borderRadius: '5px', zIndex: 1000
        });
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 2500);
    }
});
