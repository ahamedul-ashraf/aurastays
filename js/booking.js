/* ==========================================================================
   AURA STAYS - BOOKING & CHECKOUT SYSTEM (js/booking.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Room Selection Logic
    const roomCards = document.querySelectorAll('.room-card-selection');
    if (roomCards.length > 0) {
        roomCards.forEach(card => {
            const selectBtn = card.querySelector('.select-room-btn');
            if (selectBtn) {
                selectBtn.addEventListener('click', () => {
                    // Deselect others
                    roomCards.forEach(c => {
                        c.classList.remove('selected');
                        const btn = c.querySelector('.select-room-btn');
                        if (btn) {
                            btn.textContent = 'Select Room';
                            btn.className = 'btn btn-outline select-room-btn';
                        }
                    });

                    // Select this card
                    card.classList.add('selected');
                    selectBtn.textContent = 'Room Selected';
                    selectBtn.className = 'btn btn-primary select-room-btn';
                    
                    // Save selected room details
                    const roomInfo = {
                        name: card.dataset.roomName || 'Luxury Suite',
                        price: parseFloat(card.dataset.roomPrice) || 500,
                        nights: 3, // Mock duration
                        guests: 2
                    };
                    sessionStorage.setItem('selected_room', JSON.stringify(roomInfo));
                    
                    showToast(`${roomInfo.name} Selected!`, 'success');
                    
                    // Enable continue buttons
                    const continueBtn = document.getElementById('continue-to-checkout');
                    if (continueBtn) {
                        continueBtn.removeAttribute('disabled');
                        continueBtn.classList.remove('btn-secondary');
                        continueBtn.classList.add('btn-primary');
                    }
                });
            }
        });
    }

    // 2. Checkout Calculation Engine
    const checkoutSummary = document.getElementById('checkout-calculations');
    if (checkoutSummary) {
        // Load Selected Room details or fallback to default
        const roomData = JSON.parse(sessionStorage.getItem('selected_room')) || {
            name: 'Deluxe Ocean View Room',
            price: 650,
            nights: 3,
            guests: 2
        };

        let basePrice = roomData.price;
        let nights = roomData.nights;
        let guests = roomData.guests;
        
        let subtotal = basePrice * nights;
        let serviceFee = 45;
        let taxRate = 0.12;
        let tax = subtotal * taxRate;
        let discount = 0;
        let total = subtotal + serviceFee + tax;

        // Render calculations first pass
        const renderCalculations = () => {
            document.getElementById('checkout-room-name').textContent = roomData.name;
            document.getElementById('checkout-room-price').textContent = `$${basePrice}`;
            document.getElementById('checkout-nights').textContent = `${nights} nights`;
            document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('checkout-service-fee').textContent = `$${serviceFee.toFixed(2)}`;
            document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
            
            if (discount > 0) {
                document.getElementById('checkout-discount-row').style.display = 'flex';
                document.getElementById('checkout-discount').textContent = `-$${discount.toFixed(2)}`;
            } else {
                document.getElementById('checkout-discount-row').style.display = 'none';
            }

            document.getElementById('checkout-total').textContent = `$${(total - discount).toFixed(2)}`;
        };

        renderCalculations();

        // Apply Coupon logic
        const promoForm = document.getElementById('promo-code-form');
        if (promoForm) {
            promoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const codeInput = promoForm.querySelector('input').value.trim().toUpperCase();
                
                if (codeInput === 'AURA10') {
                    discount = subtotal * 0.1;
                    showToast('10% VIP Discount Applied!', 'success');
                    renderCalculations();
                } else if (codeInput === 'HONEYMOON') {
                    discount = subtotal * 0.15;
                    showToast('15% Honeymoon Special Discount Applied!', 'success');
                    renderCalculations();
                } else {
                    showToast('Invalid coupon code.', 'error');
                }
            });
        }

        // Handle Payment Methods swapping display
        const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const targetId = `payment-form-${radio.value}`;
                document.querySelectorAll('.payment-form-sub').forEach(form => {
                    form.style.display = 'none';
                });
                const targetForm = document.getElementById(targetId);
                if (targetForm) targetForm.style.display = 'block';
            });
        });

        // Checkout form submission
        const paymentForm = document.getElementById('checkout-billing-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Validate details
                const fullName = document.getElementById('billing-name').value.trim();
                const email = document.getElementById('billing-email').value.trim();
                const termsCheck = document.getElementById('terms-agree').checked;

                if (!fullName || !email) {
                    showToast('Please fill out all Guest Information.', 'error');
                    return;
                }

                if (!termsCheck) {
                    showToast('Please accept the Terms & Conditions.', 'error');
                    return;
                }

                // Check active payment validation
                const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;
                if (selectedPayment === 'card') {
                    const cardNum = document.getElementById('card-number').value.replace(/\s+/g, '');
                    if (cardNum.length < 16) {
                        showToast('Please enter a valid credit card number.', 'error');
                        return;
                    }
                }

                showToast('Securing booking transaction pipeline...', 'info');

                setTimeout(() => {
                    // Create confirmation details
                    const bookingId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
                    const receipt = {
                        bookingId: bookingId,
                        hotel: 'Aman Resorts, Tokyo',
                        room: roomData.name,
                        dates: 'July 15 - July 18, 2026',
                        guests: guests,
                        amount: (total - discount).toFixed(2),
                        guestName: fullName,
                        paymentStatus: 'Paid Successfully'
                    };

                    sessionStorage.setItem('last_booking_confirmation', JSON.stringify(receipt));
                    
                    showToast('Booking Confirmed!', 'success');
                    setTimeout(() => {
                        window.location.href = 'booking-confirmation.html';
                    }, 1200);
                }, 2000);
            });
        }
    }

    // 3. Load Invoice on Confirmation Page
    const confirmSection = document.getElementById('confirmation-receipt-wrapper');
    if (confirmSection) {
        const receipt = JSON.parse(sessionStorage.getItem('last_booking_confirmation')) || {
            bookingId: 'AUR-582914',
            hotel: 'Aman Resorts, Tokyo',
            room: 'Presidential Penthouse Suite',
            dates: 'July 15 - July 18, 2026',
            guests: 2,
            amount: '3456.00',
            guestName: 'Sir Reginald Hargreeves',
            paymentStatus: 'Paid Successfully'
        };

        document.getElementById('receipt-id').textContent = receipt.bookingId;
        document.getElementById('receipt-hotel').textContent = receipt.hotel;
        document.getElementById('receipt-room').textContent = receipt.room;
        document.getElementById('receipt-dates').textContent = receipt.dates;
        document.getElementById('receipt-guests').textContent = `${receipt.guests} Guests`;
        document.getElementById('receipt-amount').textContent = `$${receipt.amount}`;
        document.getElementById('receipt-guest-name').textContent = receipt.guestName;
        document.getElementById('receipt-status').textContent = receipt.paymentStatus;
    }
});
