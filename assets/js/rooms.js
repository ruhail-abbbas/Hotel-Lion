// Rooms page specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize room filtering and sorting
    initRoomFiltering();
    initRoomSorting();
    initBookingButtons();
    
    // Initialize room animations
    initRoomAnimations();
});

// Room filtering functionality
function initRoomFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');
    const noResultsMessage = document.getElementById('no-results');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-brushed-gold', 'text-white'));
            button.classList.add('active', 'bg-brushed-gold', 'text-white');
            
            const filterValue = button.getAttribute('data-filter');
            let visibleCount = 0;
            
            roomCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
            
            // Show/hide no results message
            if (visibleCount === 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }
            
            // Update URL parameter for bookmarking
            const url = new URL(window.location);
            if (filterValue === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filterValue);
            }
            window.history.replaceState({}, '', url);
        });
    });
    
    // Check for filter parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const filterButton = document.querySelector(`[data-filter="${filterParam}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
}

// Room sorting functionality
function initRoomSorting() {
    const sortSelect = document.getElementById('sort-select');
    const roomsGrid = document.getElementById('rooms-grid');
    
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        const roomCards = Array.from(roomsGrid.querySelectorAll('.room-card:not([style*="display: none"])'));
        
        roomCards.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    const nameA = a.querySelector('h3').textContent;
                    const nameB = b.querySelector('h3').textContent;
                    return nameA.localeCompare(nameB);
                
                case 'capacity':
                    const capacityA = parseInt(a.getAttribute('data-capacity'));
                    const capacityB = parseInt(b.getAttribute('data-capacity'));
                    return capacityB - capacityA; // Descending order
                
                case 'price':
                    const priceA = parseInt(a.getAttribute('data-price'));
                    const priceB = parseInt(b.getAttribute('data-price'));
                    return priceA - priceB; // Ascending order
                
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        roomCards.forEach(card => {
            roomsGrid.appendChild(card);
        });
        
        // Add animation effect
        roomCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('slide-in');
        });
        
        setTimeout(() => {
            roomCards.forEach(card => {
                card.classList.remove('slide-in');
                card.style.animationDelay = '';
            });
        }, 1000);
    });
}

// Booking button functionality
function initBookingButtons() {
    const bookingButtons = document.querySelectorAll('.book-room-btn');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const roomName = button.getAttribute('data-room');
            
            // Simulate booking process
            const originalText = button.textContent;
            button.textContent = 'Booking...';
            button.disabled = true;
            
            setTimeout(() => {
                // In a real application, this would open a booking modal or redirect
                showBookingModal(roomName);
                
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
    });
}

// Show booking modal (simulation)
function showBookingModal(roomName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-8 relative">
            <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="text-center">
                <div class="mb-4">
                    <svg class="w-12 h-12 text-brushed-gold mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Booking Request</h3>
                <p class="text-gray-600 mb-6">You've selected <strong>${roomName}</strong>. In a real booking system, this would redirect you to our reservation platform.</p>
                <div class="space-y-3">
                    <button class="w-full bg-brushed-gold text-white px-6 py-3 rounded font-medium hover:bg-opacity-90 transition-all" onclick="this.closest('.fixed').remove()">
                        Continue to Booking
                    </button>
                    <button class="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50 transition-all" onclick="this.closest('.fixed').remove()">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Remove modal after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

// Room card animations
function initRoomAnimations() {
    const roomCards = document.querySelectorAll('.room-card');
    
    // Hover animations
    roomCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
            
            const img = card.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    roomCards.forEach((card, index) => {
        card.classList.add('scroll-animate');
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Search functionality (can be extended)
function initRoomSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search rooms...';
    searchInput.className = 'px-4 py-2 border border-sandy-beige rounded focus:outline-none focus:border-brushed-gold';
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const roomCards = document.querySelectorAll('.room-card');
        let visibleCount = 0;
        
        roomCards.forEach(card => {
            const roomName = card.querySelector('h3').textContent.toLowerCase();
            const roomDescription = card.querySelector('p').textContent.toLowerCase();
            
            if (roomName.includes(searchTerm) || roomDescription.includes(searchTerm)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        const noResultsMessage = document.getElementById('no-results');
        if (visibleCount === 0 && searchTerm.length > 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            noResultsMessage.classList.add('hidden');
        }
    });
    
    // Add search input to filter section (optional)
    // You can uncomment this to add search functionality
    // const filterSection = document.querySelector('.filter-section');
    // if (filterSection) {
    //     filterSection.appendChild(searchInput);
    // }
}

// Price range filter (can be extended)
function initPriceFilter() {
    const priceRanges = [
        { min: 0, max: 70, label: 'Under €70' },
        { min: 70, max: 100, label: '€70 - €100' },
        { min: 100, max: 150, label: '€100 - €150' },
        { min: 150, max: 999, label: 'Over €150' }
    ];
    
    priceRanges.forEach(range => {
        const filterButton = document.createElement('button');
        filterButton.className = 'filter-btn px-4 py-2 rounded-full border border-sandy-beige hover:bg-brushed-gold hover:text-white transition-all';
        filterButton.textContent = range.label;
        
        filterButton.addEventListener('click', () => {
            const roomCards = document.querySelectorAll('.room-card');
            let visibleCount = 0;
            
            roomCards.forEach(card => {
                const price = parseInt(card.getAttribute('data-price'));
                
                if (price >= range.min && price <= range.max) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const noResultsMessage = document.getElementById('no-results');
            if (visibleCount === 0) {
                noResultsMessage.classList.remove('hidden');
            } else {
                noResultsMessage.classList.add('hidden');
            }
        });
    });
}

// Utility function to get room statistics
function getRoomStatistics() {
    const roomCards = document.querySelectorAll('.room-card');
    const stats = {
        total: roomCards.length,
        single: 0,
        double: 0,
        twin: 0,
        triple: 0,
        apartment: 0,
        avgPrice: 0,
        minPrice: Infinity,
        maxPrice: 0
    };
    
    let totalPrice = 0;
    
    roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseInt(card.getAttribute('data-price'));
        
        stats[category]++;
        totalPrice += price;
        stats.minPrice = Math.min(stats.minPrice, price);
        stats.maxPrice = Math.max(stats.maxPrice, price);
    });
    
    stats.avgPrice = Math.round(totalPrice / stats.total);
    
    return stats;
}

// Add to favorites functionality (local storage)
function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favorites = JSON.parse(localStorage.getItem('favoriteRooms') || '[]');
    
    favoriteButtons.forEach(button => {
        const roomName = button.getAttribute('data-room');
        
        if (favorites.includes(roomName)) {
            button.classList.add('favorited');
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const index = favorites.indexOf(roomName);
            
            if (index > -1) {
                favorites.splice(index, 1);
                button.classList.remove('favorited');
            } else {
                favorites.push(roomName);
                button.classList.add('favorited');
            }
            
            localStorage.setItem('favoriteRooms', JSON.stringify(favorites));
        });
    });
}

// Console information for developers
console.log(`
🏨 Lion's Rooms n Apartments - Rooms Page
${getRoomStatistics().total} rooms available

Room Statistics:
- Single Rooms: ${getRoomStatistics().single}
- Double Rooms: ${getRoomStatistics().double}  
- Twin Rooms: ${getRoomStatistics().twin}
- Triple Rooms: ${getRoomStatistics().triple}
- Apartments: ${getRoomStatistics().apartment}

Price Range: €${getRoomStatistics().minPrice} - €${getRoomStatistics().maxPrice}
Average Price: €${getRoomStatistics().avgPrice}
`);