/* ==========================================================================
   AURA STAYS - GLOBAL JS CONTROLLER (js/app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Loader Toggling
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 600); // Premium brief transition delay
    }

    // 2. Glass Navbar Scroll Effect
    const header = document.querySelector('.header');
    if (header && !header.classList.contains('always-dark')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 3. Dark/Light Mode Engine
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        // Load stored theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }

        // Toggle theme on click
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
        });
    }

    // 4. Mobile Menu Drawer
    const mobileMenuOpenBtn = document.getElementById('mobile-menu-open-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileBackdrop = document.getElementById('mobile-backdrop');

    if (mobileMenuOpenBtn && mobileNav && mobileBackdrop) {
        const toggleMobileMenu = (open) => {
            if (open) {
                mobileNav.classList.add('open');
                mobileBackdrop.classList.add('open');
                document.body.style.overflow = 'hidden';
            } else {
                mobileNav.classList.remove('open');
                mobileBackdrop.classList.remove('open');
                document.body.style.overflow = '';
            }
        };

        mobileMenuOpenBtn.addEventListener('click', () => toggleMobileMenu(true));
        if (mobileMenuCloseBtn) mobileMenuCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
        mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));
    }

    // 5. Scroll To Top Button logic
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Generic Card Wishlist Toggle Actions
    document.addEventListener('click', (e) => {
        const wishlistBtn = e.target.closest('.wishlist-btn');
        if (wishlistBtn) {
            e.preventDefault();
            e.stopPropagation();
            wishlistBtn.classList.toggle('active');
            const isActive = wishlistBtn.classList.contains('active');
            const hotelName = wishlistBtn.dataset.hotel || 'this property';
            
            wishlistBtn.innerHTML = isActive ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            if (isActive) {
                wishlistBtn.style.color = '#E74C3C';
                showToast(`Added ${hotelName} to Wishlist`, 'success');
            } else {
                wishlistBtn.style.color = '';
                showToast(`Removed ${hotelName} from Wishlist`, 'info');
            }
        }
    });

    // 7. Initialize Newsletter form handler
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showToast(`Subscribed successfully with ${emailInput.value}!`, 'success');
                emailInput.value = '';
            }
        });
    }

    // 8. Custom dropdown trigger mechanism (like guests picker)
    const dropdownTriggers = document.querySelectorAll('.dropdown-toggle');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = trigger.dataset.target;
            const targetDropdown = document.getElementById(targetId);
            if (targetDropdown) {
                targetDropdown.classList.toggle('open');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        const openDropdowns = document.querySelectorAll('.guests-dropdown.open');
        openDropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });

    const stopPropagationElements = document.querySelectorAll('.guests-dropdown');
    stopPropagationElements.forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});

// Toast System Definition
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
    if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animate-in
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Trigger animate-out and remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}
