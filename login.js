import api from './api.js';
import notifications from './notifications.js';
import loading from './loading.js';

// Initialize AOS
AOS.init({ duration: 800, once: true, offset: 100 });

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        await loading.wrap(async () => {
            const response = await api.login(email, password);
            notifications.success('Successfully logged in!');
            
            // Store remember me preference
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    } catch (error) {
        notifications.error(error.message || 'Failed to login. Please try again.');
    }
});

// Check for remember me
if (localStorage.getItem('rememberMe') === 'true') {
    document.getElementById('remember').checked = true;
} 