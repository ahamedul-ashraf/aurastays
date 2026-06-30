/* ==========================================================================
   AURA STAYS - ADMIN & PARTNER PORTAL CONTROLLER (js/admin.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Chart Bar Heights Animation
    const chartBars = document.querySelectorAll('.chart-bar');
    if (chartBars.length > 0) {
        setTimeout(() => {
            chartBars.forEach(bar => {
                const heightValue = bar.dataset.height || '0%';
                bar.style.height = heightValue;
            });
        }, 300);
    }

    // 2. Admin Search Bar Filter for Table Rows
    const adminSearchInput = document.getElementById('admin-search-input');
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    if (adminSearchInput && tableRows.length > 0) {
        adminSearchInput.addEventListener('input', () => {
            const query = adminSearchInput.value.toLowerCase().trim();
            tableRows.forEach(row => {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // 3. Admin Delete Row simulation
    const tableContainer = document.querySelector('.admin-table-container');
    if (tableContainer) {
        tableContainer.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.admin-action-btn.delete');
            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                const rowName = row.cells[0]?.textContent || 'this item';
                
                const confirmDelete = confirm(`Are you sure you want to delete ${rowName}?`);
                if (confirmDelete) {
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        row.remove();
                        showToast(`Deleted ${rowName} successfully.`, 'success');
                    }, 400);
                }
            }
        });
    }

    // 4. Partner Add Hotel Form Submission
    const addHotelForm = document.getElementById('add-hotel-form');
    if (addHotelForm) {
        addHotelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const hotelName = document.getElementById('hotel-name').value.trim();
            const location = document.getElementById('hotel-location').value.trim();
            const price = document.getElementById('hotel-price').value;
            
            if (!hotelName || !location || !price) {
                showToast('Please enter all required fields.', 'error');
                return;
            }

            showToast('Submitting property data to admin check...', 'info');

            setTimeout(() => {
                showToast(`Property "${hotelName}" successfully listed for approval!`, 'success');
                addHotelForm.reset();
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1200);
            }, 1800);
        });
    }

    // 5. Partner Edit Hotel Form Submission
    const editHotelForm = document.getElementById('edit-hotel-form');
    if (editHotelForm) {
        // Pre-fill mock data if editing
        document.getElementById('hotel-name').value = 'Banyan Tree Retreat';
        document.getElementById('hotel-location').value = 'Phuket, Thailand';
        document.getElementById('hotel-price').value = '480';
        document.getElementById('hotel-description').value = 'Nestled in the tropical wonderland of Phuket, our resort features high-end overwater villas with private pools, personalized butler services, and award-winning wellness therapies.';

        editHotelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Saving updated changes...', 'info');
            setTimeout(() => {
                showToast('Property updated successfully!', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }, 1500);
        });
    }

    // 6. Responsive Drawer Sidebar Toggle for Admin Panel
    const adminMenuBtn = document.getElementById('admin-menu-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    if (adminMenuBtn && adminSidebar) {
        adminMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            adminSidebar.style.display = adminSidebar.style.display === 'flex' ? 'none' : 'flex';
        });

        // Close drawer if clicking on admin content
        const adminMainContent = document.querySelector('.admin-main');
        if (adminMainContent) {
            adminMainContent.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    adminSidebar.style.display = 'none';
                }
            });
        }
    }
});
