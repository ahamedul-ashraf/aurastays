/* ==========================================================================
   AURA STAYS - SEARCH & FILTER CONTROLLER (js/search.js)
   ========================================================================== */

// 1. Mock Database of Luxury Properties
const HOTELS_DATABASE = [
    {
        id: 'aman-tokyo',
        name: 'Aman Resorts, Tokyo',
        location: 'Tokyo, Japan',
        stars: 5,
        rating: 9.7,
        reviews: 320,
        price: 1250,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'spa', 'pool', 'gym', 'breakfast'],
        cancellation: true,
        type: 'hotel',
        popularity: 98
    },
    {
        id: 'ritz-carlton-kyoto',
        name: 'The Ritz-Carlton, Kyoto',
        location: 'Kyoto, Japan',
        stars: 5,
        rating: 9.6,
        reviews: 215,
        price: 950,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'restaurant', 'pool', 'breakfast'],
        cancellation: true,
        type: 'hotel',
        popularity: 92
    },
    {
        id: 'banyan-tree-phuket',
        name: 'Banyan Tree, Phuket',
        location: 'Phuket, Thailand',
        stars: 5,
        rating: 9.3,
        reviews: 480,
        price: 480,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'spa', 'pool', 'gym', 'beach'],
        cancellation: true,
        type: 'villa',
        popularity: 88
    },
    {
        id: 'marina-bay-sands',
        name: 'Marina Bay Sands Hotel',
        location: 'Singapore',
        stars: 5,
        rating: 9.5,
        reviews: 1240,
        price: 700,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'pool', 'gym', 'restaurant'],
        cancellation: false,
        type: 'hotel',
        popularity: 99
    },
    {
        id: 'amangiri-utah',
        name: 'Amangiri Sanctuary',
        location: 'Utah, USA',
        stars: 5,
        rating: 9.8,
        reviews: 140,
        price: 1850,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'spa', 'pool', 'breakfast'],
        cancellation: true,
        type: 'resort',
        popularity: 96
    },
    {
        id: 'soneva-jani-maldives',
        name: 'Soneva Jani Overwater Villas',
        location: 'Noonu Atoll, Maldives',
        stars: 5,
        rating: 9.9,
        reviews: 88,
        price: 2400,
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'spa', 'pool', 'beach', 'breakfast'],
        cancellation: true,
        type: 'resort',
        popularity: 95
    },
    {
        id: 'villa-este-lake-como',
        name: 'Villa d\'Este Palace',
        location: 'Lake Como, Italy',
        stars: 5,
        rating: 9.7,
        reviews: 185,
        price: 1100,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'restaurant', 'pool', 'gym'],
        cancellation: false,
        type: 'villa',
        popularity: 91
    },
    {
        id: 'rosewood-london',
        name: 'Rosewood Luxury Suites',
        location: 'London, UK',
        stars: 5,
        rating: 9.4,
        reviews: 310,
        price: 680,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600&auto=format&fit=crop',
        amenities: ['wifi', 'spa', 'gym', 'breakfast'],
        cancellation: true,
        type: 'hotel',
        popularity: 89
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // 2. Price Range Slider Value Synchronizer
    const priceSlider = document.getElementById('price-slider');
    const priceValueText = document.getElementById('price-val');
    if (priceSlider && priceValueText) {
        priceSlider.addEventListener('input', () => {
            priceValueText.textContent = `$${priceSlider.value}`;
            filterAndRenderHotels();
        });
    }

    // 3. Setup Listener elements for Filters
    const filterInputs = document.querySelectorAll('.filter-checkbox, .filter-stars, #sort-select');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => {
            filterAndRenderHotels();
        });
    });

    // 4. Load initial URL search criteria (if redirected from home page search widget)
    const urlParams = new URLSearchParams(window.location.search);
    const destination = urlParams.get('destination');
    const destInput = document.getElementById('search-dest');
    if (destination && destInput) {
        destInput.value = destination;
        showToast(`Searching properties in "${destination}"`, 'success');
    }

    // 5. Direct submission search triggers
    const searchForm = document.getElementById('search-form-control');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterAndRenderHotels();
        });
    }

    // Run first render of search database
    filterAndRenderHotels();
});

// Main Filtering & Rendering Logic
function filterAndRenderHotels() {
    const listGrid = document.getElementById('hotels-listing-grid');
    if (!listGrid) return; // Only process on search page

    // Showing Skeleton Loader
    listGrid.innerHTML = Array(4).fill(0).map(() => `
        <div class="hotel-card skeleton" style="height: 480px; border-radius: var(--radius-md);"></div>
    `).join('');

    setTimeout(() => {
        const destInput = document.getElementById('search-dest');
        const searchVal = destInput ? destInput.value.toLowerCase().trim() : '';

        const priceSlider = document.getElementById('price-slider');
        const maxPrice = priceSlider ? parseInt(priceSlider.value) : 2500;

        // Checked stars
        const selectedStars = Array.from(document.querySelectorAll('.filter-stars:checked')).map(el => parseInt(el.value));

        // Checked amenities
        const selectedAmenities = Array.from(document.querySelectorAll('.filter-amenity:checked')).map(el => el.value);

        // Cancellation policy
        const freeCancelOnly = document.getElementById('filter-cancellation')?.checked || false;
        
        // Property types
        const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(el => el.value);

        // Sorting Option
        const sortSelect = document.getElementById('sort-select');
        const sortBy = sortSelect ? sortSelect.value : 'popularity';

        // Perform filter operations
        let filteredList = HOTELS_DATABASE.filter(hotel => {
            // Filter by name/location
            if (searchVal && !hotel.name.toLowerCase().includes(searchVal) && !hotel.location.toLowerCase().includes(searchVal)) {
                return false;
            }

            // Filter by price
            if (hotel.price > maxPrice) return false;

            // Filter by stars
            if (selectedStars.length > 0 && !selectedStars.includes(hotel.stars)) return false;

            // Filter by amenities
            if (selectedAmenities.length > 0) {
                const hasAll = selectedAmenities.every(am => hotel.amenities.includes(am));
                if (!hasAll) return false;
            }

            // Filter by Cancellation
            if (freeCancelOnly && !hotel.cancellation) return false;

            // Filter by property type
            if (selectedTypes.length > 0 && !selectedTypes.includes(hotel.type)) return false;

            return true;
        });

        // Perform Sorting operations
        if (sortBy === 'price-low') {
            filteredList.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filteredList.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            filteredList.sort((a, b) => b.rating - a.rating);
        } else {
            // default: popularity
            filteredList.sort((a, b) => b.popularity - a.popularity);
        }

        // Render matching elements
        const countLabel = document.getElementById('results-count');
        if (countLabel) {
            countLabel.textContent = `${filteredList.length} properties found`;
        }

        if (filteredList.length === 0) {
            listGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1.5rem;"></i>
                    <h3 style="font-size: 2rem; margin-bottom: 0.5rem; font-weight: 300;">No properties match your filter</h3>
                    <p style="color: var(--text-muted);">Try adjusting your sliders, removing filters, or searching another location.</p>
                </div>
            `;
            return;
        }

        listGrid.innerHTML = filteredList.map(hotel => {
            // Map amenities array into Font Awesome tags
            const iconsMap = {
                wifi: '<i class="fas fa-wifi"></i> WiFi',
                spa: '<i class="fas fa-spa"></i> Spa',
                pool: '<i class="fas fa-swimming-pool"></i> Pool',
                gym: '<i class="fas fa-dumbbell"></i> Gym',
                breakfast: '<i class="fas fa-coffee"></i> Breakfast',
                restaurant: '<i class="fas fa-utensils"></i> Dining',
                beach: '<i class="fas fa-umbrella-beach"></i> Beach'
            };

            const amenitiesHtml = hotel.amenities.slice(0, 3).map(am => `
                <div class="amenity-item">${iconsMap[am] || am}</div>
            `).join('');

            const starHtml = Array(hotel.stars).fill('<i class="fas fa-star"></i>').join('');

            return `
                <div class="hotel-card animate-fade-in-up">
                    <div class="hotel-image-wrapper">
                        <img src="${hotel.image}" alt="${hotel.name}">
                        ${hotel.popularity > 95 ? '<span class="hotel-tag">Guest Favorite</span>' : ''}
                        <div class="wishlist-btn" data-hotel="${hotel.name}">
                            <i class="far fa-heart"></i>
                        </div>
                    </div>
                    <div class="hotel-info">
                        <div class="hotel-location">
                            <i class="fas fa-map-marker-alt"></i> ${hotel.location}
                        </div>
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <div class="hotel-rating">
                            <div class="stars">${starHtml}</div>
                            <span class="rating-score">${hotel.rating}</span>
                            <span class="reviews-count">(${hotel.reviews} reviews)</span>
                        </div>
                        <div class="hotel-amenities">
                            ${amenitiesHtml}
                        </div>
                        <div class="hotel-footer">
                            <div class="hotel-price">
                                <span class="price-amount">$${hotel.price}<span>/night</span></span>
                                ${hotel.cancellation ? '<p style="color: #2ECC71; font-size: 0.75rem; font-weight: 600; margin-top: 0.2rem;"><i class="fas fa-check"></i> Free Cancellation</p>' : ''}
                            </div>
                            <a href="hotel.html?id=${hotel.id}" class="btn btn-primary btn-small">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    }, 550);
}

// Global hook for index.html search button redirection
function submitSearchQuery(event) {
    event.preventDefault();
    const destination = document.getElementById('home-destination')?.value || '';
    window.location.href = `search.html?destination=${encodeURIComponent(destination)}`;
}
