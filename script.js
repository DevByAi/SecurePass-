// קבועים
const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// אלמנטים
const elements = {
    passwordInput: document.getElementById('password-input'),
    strengthIndicator: document.getElementById('strength-indicator'),
    crackTime: document.getElementById('crack-time'),
    lengthSlider: document.getElementById('length-slider'),
    lengthValue: document.getElementById('length-value'),
    generateBtn: document.getElementById('generate-btn'),
    generatedPassword: document.getElementById('generated-password'),
    passwordText: document.getElementById('password-text'),
    copyBtn: document.getElementById('copy-btn'),
    uppercase: document.getElementById('uppercase'),
    lowercase: document.getElementById('lowercase'),
    numbers: document.getElementById('numbers'),
    symbols: document.getElementById('symbols')
};

// עדכון ראשוני של ערך הסליידר
document.addEventListener('DOMContentLoaded', () => {
    elements.lengthValue.textContent = elements.lengthSlider.value;
});

// פונקציה לבדיקת מספר האפשרויות שנבחרו
function countSelectedOptions() {
    let count = 0;
    if (elements.uppercase.checked) count++;
    if (elements.lowercase.checked) count++;
    if (elements.numbers.checked) count++;
    if (elements.symbols.checked) count++;
    return count;
}

// פונקציה להצגת התראה
function showAlert(message, type = 'warning') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `password-alert ${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            ⚠️ ${message}
        </div>
    `;
    
    const existingAlert = document.querySelector('.password-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    elements.generateBtn.parentNode.insertBefore(alertDiv, elements.generateBtn);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// חישוב חוזק סיסמה
function calculateStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
}

// קבלת תווית חוזק
function getStrengthLabel(strength) {
    if (strength <= 2) return ['חלשה מאוד', 'very-weak'];
    if (strength <= 3) return ['חלשה', 'weak'];
    if (strength <= 4) return ['בינונית', 'medium'];
    if (strength <= 5) return ['חזקה', 'strong'];
    return ['חזקה מאוד', 'very-strong'];
}

// הערכת זמן פריצה
function estimateCrackTime(password) {
    const strength = calculateStrength(password);
    const possibilities = Math.pow(password.length, strength * 10);
    const guessesPerSecond = 1000000000;
    const seconds = possibilities / guessesPerSecond;
    
    if (seconds < 60) return 'פחות מדקה';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} דקות`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} שעות`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} ימים`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} חודשים`;
    return `${Math.floor(seconds / 31536000)} שנים`;
}

// יצירת סיסמה
function generatePassword() {
    const length = parseInt(elements.lengthSlider.value);
    const selectedOptions = countSelectedOptions();
    
    if (length < 8) {
        showAlert('מומלץ להשתמש בסיסמה באורך 8 תווים לפחות לאבטחה טובה יותר');
        return;
    }
    
    if (selectedOptions < 2) {
        showAlert('מומלץ לבחור לפחות 2 סוגי תווים שונים לאבטחה טובה יותר');
        return;
    }

    let chars = '';
    if (elements.uppercase.checked) chars += CHARS.uppercase;
    if (elements.lowercase.checked) chars += CHARS.lowercase;
    if (elements.numbers.checked) chars += CHARS.numbers;
    if (elements.symbols.checked) chars += CHARS.symbols;

    if (!chars) {
        showAlert('יש לבחור לפחות סוג תווים אחד');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    elements.generatedPassword.style.display = 'flex';
    elements.passwordText.textContent = password;

    if (length < 10 || selectedOptions < 3) {
        showAlert('הסיסמה שנוצרה עומדת בדרישות המינימום, אך מומלץ להוסיף אורך ומורכבות לאבטחה טובה יותר', 'info');
    }
}

// מאזיני אירועים
elements.passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    if (!password) {
        elements.strengthIndicator.innerHTML = '';
        elements.crackTime.innerHTML = '';
        return;
    }

    const strength = calculateStrength(password);
    const [label, className] = getStrengthLabel(strength);
    
    elements.strengthIndicator.innerHTML = `
        <span class="strength-meter ${className}">${label}</span>
    `;
    elements.crackTime.innerHTML = `זמן פריצה משוער: ${estimateCrackTime(password)}`;
});

// מאזין אירועים לסליידר
elements.lengthSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    elements.lengthValue.textContent = value;
    
    if (parseInt(value) < 8) {
        showAlert('אורך מומלץ: 8 תווים לפחות');
    }
});

// מאזין אירועים לכפתור היצירה
elements.generateBtn.addEventListener('click', generatePassword);

// מאזין אירועים לכפתור ההעתקה
elements.copyBtn.addEventListener('click', async () => {
    const password = elements.passwordText.textContent;
    await navigator.clipboard.writeText(password);
    elements.copyBtn.textContent = 'הועתק!';
    setTimeout(() => {
        elements.copyBtn.textContent = 'העתק';
    }, 2000);
});

// מאזיני אירועים למתגים
[elements.uppercase, elements.lowercase, elements.numbers, elements.symbols].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selectedOptions = countSelectedOptions();
        if (selectedOptions < 2) {
            showAlert('מומלץ לבחור לפחות 2 סוגי תווים');
        }
    });
});

// PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
