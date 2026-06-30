/* ==========================================================================
   AURA STAYS - CUSTOMER PORTAL CONTROLLER (js/dashboard.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dashboard Tab Switcher Engine
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Set active buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle visibility
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    // 2. Mock Session Loader
    const userSession = JSON.parse(localStorage.getItem('user_session')) || {
        name: 'Alexander Sterling',
        email: 'alexander@luxury.com',
        phone: '+1 234 567 8900',
        address: '5th Avenue, New York, NY',
        isLoggedIn: true
    };

    // Auto-fill dashboard profile data if elements exist
    const profileNameHeader = document.getElementById('profile-name-header');
    if (profileNameHeader) profileNameHeader.textContent = userSession.name;

    const emailHeader = document.getElementById('profile-email-header');
    if (emailHeader) emailHeader.textContent = userSession.email;

    // Form inputs auto-fill
    const inputName = document.getElementById('profile-name-input');
    if (inputName) inputName.value = userSession.name;

    const inputEmail = document.getElementById('profile-email-input');
    if (inputEmail) inputEmail.value = userSession.email;

    const inputPhone = document.getElementById('profile-phone-input');
    if (inputPhone) inputPhone.value = userSession.phone || '';

    const inputAddress = document.getElementById('profile-address-input');
    if (inputAddress) inputAddress.value = userSession.address || '';

    // 3. Profile Image Upload Preview
    const avatarInput = document.getElementById('avatar-upload');
    const avatarImg = document.getElementById('avatar-img');
    if (avatarInput && avatarImg) {
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    avatarImg.src = event.target.result;
                    showToast('Profile image uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 4. Update Profile Info submission
    const profileForm = document.getElementById('profile-edit-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            userSession.name = document.getElementById('profile-name-input').value.trim();
            userSession.email = document.getElementById('profile-email-input').value.trim();
            userSession.phone = document.getElementById('profile-phone-input').value.trim();
            userSession.address = document.getElementById('profile-address-input').value.trim();

            localStorage.setItem('user_session', JSON.stringify(userSession));
            
            // Sync labels
            if (profileNameHeader) profileNameHeader.textContent = userSession.name;
            if (emailHeader) emailHeader.textContent = userSession.email;

            showToast('Premium profile updated successfully!', 'success');
        });
    }

    // 5. Booking Cancellation flow simulation
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookingCard = btn.closest('.booking-strip-card');
            const hotelName = btn.dataset.hotel || 'your stay';

            const confirmCancel = confirm(`Are you sure you want to cancel your booking at ${hotelName}?`);
            if (confirmCancel) {
                showToast('Cancelling your reservation...', 'info');

                setTimeout(() => {
                    if (bookingCard) {
                        const statusBadge = bookingCard.querySelector('.booking-status');
                        if (statusBadge) {
                            statusBadge.className = 'booking-status status-cancelled';
                            statusBadge.textContent = 'Cancelled';
                        }
                        btn.style.display = 'none'; // Hide cancel button
                        showToast(`Booking at ${hotelName} has been cancelled successfully.`, 'success');
                        
                        // Decrement upcoming counter
                        const upcomingCountEl = document.getElementById('stat-upcoming-count');
                        if (upcomingCountEl) {
                            let val = parseInt(upcomingCountEl.textContent);
                            if (val > 0) upcomingCountEl.textContent = val - 1;
                        }
                    }
                }, 1500);
            }
        });
    });

    // 6. Wishlist removal dashboard actions
    const wishlistRemoveBtns = document.querySelectorAll('.wishlist-remove-btn');
    wishlistRemoveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const hotelCard = btn.closest('.hotel-card');
            const hotelName = btn.dataset.hotel || 'this property';
            
            if (hotelCard) {
                hotelCard.style.opacity = '0';
                hotelCard.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    hotelCard.remove();
                    showToast(`Removed ${hotelName} from Saved Stays`, 'info');
                    
                    // Update stats
                    const savedCountEl = document.getElementById('stat-saved-count');
                    if (savedCountEl) {
                        let val = parseInt(savedCountEl.textContent);
                        if (val > 0) savedCountEl.textContent = val - 1;
                    }
                }, 400);
            }
        });
    });
});
