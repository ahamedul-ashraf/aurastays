/* ==========================================================================
   AURA STAYS - AUTHENTICATION INTERACTIVE LOGIC (js/auth.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggle Engine
    const togglePasswordIcons = document.querySelectorAll('.password-toggle');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const inputField = icon.previousElementSibling;
            if (inputField) {
                if (inputField.type === 'password') {
                    inputField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    inputField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // 2. Login Form Validation & Fake Redirection
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('#email').value.trim();
            const password = loginForm.querySelector('#password').value;
            const rememberMe = loginForm.querySelector('#remember-me')?.checked;

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }

            // Simulate authentication based on login email
            showToast('Authenticating security credentials...', 'info');

            setTimeout(() => {
                // Setup mock session
                const userSession = {
                    email: email,
                    name: email.split('@')[0],
                    role: 'guest',
                    isLoggedIn: true
                };
                
                // Let user log in as admin or partner with specific emails
                if (email.startsWith('admin')) {
                    userSession.role = 'admin';
                    localStorage.setItem('user_session', JSON.stringify(userSession));
                    showToast('Welcome, Administrator!', 'success');
                    setTimeout(() => window.location.href = 'admin/dashboard.html', 1000);
                } else if (email.startsWith('partner')) {
                    userSession.role = 'partner';
                    localStorage.setItem('user_session', JSON.stringify(userSession));
                    showToast('Welcome, Luxury Partner!', 'success');
                    setTimeout(() => window.location.href = 'partner/dashboard.html', 1000);
                } else {
                    localStorage.setItem('user_session', JSON.stringify(userSession));
                    showToast(`Welcome back, ${userSession.name}!`, 'success');
                    setTimeout(() => window.location.href = 'dashboard.html', 1000);
                }
            }, 1200);
        });
    }

    // 3. Register Form Validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = signupForm.querySelector('#full-name').value.trim();
            const email = signupForm.querySelector('#email').value.trim();
            const password = signupForm.querySelector('#password').value;
            const agreeTerms = signupForm.querySelector('#agree-terms').checked;

            if (fullName.length < 2) {
                showToast('Please enter your full name.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters.', 'error');
                return;
            }

            if (!agreeTerms) {
                showToast('You must agree to the Terms & Conditions.', 'error');
                return;
            }

            showToast('Creating premium profile...', 'info');

            setTimeout(() => {
                const userSession = {
                    email: email,
                    name: fullName,
                    role: 'guest',
                    isLoggedIn: true
                };
                localStorage.setItem('user_session', JSON.stringify(userSession));
                showToast('Account registered successfully!', 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1200);
            }, 1500);
        });
    }

    // 4. Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = forgotPasswordForm.querySelector('#email').value.trim();

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            showToast('Sending secure reset link to your email...', 'info');

            setTimeout(() => {
                showToast(`Secure link dispatched to ${email}!`, 'success');
                forgotPasswordForm.reset();
            }, 1800);
        });
    }

    // 5. Social Login Simulation
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.innerText.trim();
            showToast(`Connecting secure pipeline to ${provider}...`, 'info');
            setTimeout(() => {
                const userSession = {
                    email: `social.user@${provider.toLowerCase()}.com`,
                    name: 'Guest Member',
                    role: 'guest',
                    isLoggedIn: true
                };
                localStorage.setItem('user_session', JSON.stringify(userSession));
                showToast(`Logged in successfully via ${provider}!`, 'success');
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            }, 1200);
        });
    });
});

// Helper: Validation utilities
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
