document.addEventListener('DOMContentLoaded', () => {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const currencyInput = document.getElementById('currency');
    const incomeInput = document.getElementById('monthlyIncome');
    const darkModeToggle = document.getElementById('darkModeToggle');

    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const profileInitials = document.getElementById('profile-initials');

    // Load saved data
    const savedInfo = JSON.parse(localStorage.getItem('personalInfo'));
    if (savedInfo) {
        fullNameInput.value = savedInfo.fullName;
        emailInput.value = savedInfo.email;
        phoneInput.value = savedInfo.phone;
        currencyInput.value = savedInfo.currency;

        displayName.textContent = savedInfo.fullName;
        displayEmail.textContent = savedInfo.email;
        profileInitials.textContent = savedInfo.fullName.split(' ').map(n => n[0]).join('');
    }

    const savedIncome = localStorage.getItem('monthlyIncome');
    if (savedIncome) incomeInput.value = savedIncome;

    const darkModePref = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = darkModePref;
    if (darkModePref) document.body.classList.add('dark-mode');

    // Save personal info
    document.getElementById('personalInfoForm').addEventListener('submit', e => {
        e.preventDefault();
        const info = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            currency: currencyInput.value
        };
        localStorage.setItem('personalInfo', JSON.stringify(info));
        displayName.textContent = info.fullName;
        displayEmail.textContent = info.email;
        profileInitials.textContent = info.fullName.split(' ').map(n => n[0]).join('');
        alert('Personal info saved!');
    });

    // Save income
    document.getElementById('incomeForm').addEventListener('submit', e => {
        e.preventDefault();
        localStorage.setItem('monthlyIncome', incomeInput.value);
        alert('Income saved!');
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('change', e => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', true);
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', false);
        }
    });
});
