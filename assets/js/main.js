// Main JavaScript for The Lion Hotel

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // Scroll animations
    initScrollAnimations();
    
    // Mobile menu
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Booking buttons
    initBookingButtons();
    
    // Form handling
    initForms();
    
    // Image lazy loading
    initLazyLoading();
    
    // Performance optimizations
    initPerformanceOptimizations();
});

// Navigation scroll effect
function initNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll animations
function initScrollAnimations() {
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
    
    // Add scroll animation class to elements
    const animateElements = document.querySelectorAll('.room-card, .experience-card, section > div');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            mobileMenuBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `;
        } else {
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            mobileMenuBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            mobileMenuBtn.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // Simulate form submission
                const button = e.target.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = 'Subscribing...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Subscribed!';
                    button.style.backgroundColor = '#22c55e';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.backgroundColor = '';
                        e.target.reset();
                    }, 2000);
                }, 1500);
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification with enhanced styling
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform translate-x-full transition-all duration-300 shadow-lg backdrop-blur-sm ${
        type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500 border border-green-400' : 'bg-blue-500 border border-blue-400'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="text-lg">${icons[type] || icons.info}</span>
            <span class="font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('image-loading');
                imageObserver.unobserve(img);
                
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('image-loading');
        imageObserver.observe(img);
    });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Preload critical images
    const criticalImages = [
        'assets/images/hero/hotel-cliffside.jpg',
        'assets/images/rooms/ocean-suite.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Debounced scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Update scroll-dependent animations here
            updateParallaxEffect();
        }, 16); // ~60fps
    });
}

// Parallax effect for hero section - disabled to prevent conflicts with Ken Burns effect
function updateParallaxEffect() {
    // Disabled to prevent conflicts with CSS Ken Burns animation
    return;
}

// Booking button functionality
function initBookingButtons() {
    // Configuration for booking frontend
    const BOOKING_FRONTEND_URL = 'http://localhost:3000';
    const HOTEL_UUID = '15d0da75-0c13-4578-82f5-355632c17ebc';
    
    // Find booking buttons by specific text content, avoid class-based selection
    const bookingButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
        const text = btn.textContent.trim();
        return (text.includes('BOOK') || text.includes('Book')) && 
               !btn.classList.contains('filter-btn') && // Exclude filter buttons
               !btn.closest('nav'); // Exclude navigation buttons
    });
    
    // Include all booking button classes
    const navBookingButtons = document.querySelectorAll('.booking-btn-nav');
    const heroBookingButtons = document.querySelectorAll('.booking-btn-hero');
    const ctaBookingButtons = document.querySelectorAll('.booking-btn-cta');
    const footerBookingButtons = document.querySelectorAll('.booking-btn-footer');
    const explicitBookingBtns = document.querySelectorAll('.book-room-btn, .magnetic-btn');
    
    // Combine all booking buttons
    const allBookingButtons = [...bookingButtons, ...navBookingButtons, ...heroBookingButtons, ...ctaBookingButtons, ...footerBookingButtons, ...explicitBookingBtns];
    const uniqueButtons = [...new Set(allBookingButtons)];
    
    uniqueButtons.forEach(button => {
        // Skip filter buttons
        if (button.classList.contains('filter-btn')) return;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Show loading state
            const originalText = button.textContent;
            button.textContent = 'Redirecting...';
            button.disabled = true;
            
            // Add subtle animation
            button.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                // Create booking URL with default parameters
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                const dayAfter = new Date(today);
                dayAfter.setDate(dayAfter.getDate() + 3);
                
                const checkIn = tomorrow.toISOString().split('T')[0];
                const checkOut = dayAfter.toISOString().split('T')[0];
                
                const bookingUrl = `${BOOKING_FRONTEND_URL}/search?hotel=${HOTEL_UUID}&check_in=${checkIn}&check_out=${checkOut}&guests=2&infants=0`;
                
                // Show success notification
                showNotification('🏨 Redirecting to Hotel Lion booking system...', 'success');
                
                // Redirect to booking frontend
                window.open(bookingUrl, '_blank');
                
                // Reset button after a short delay
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.transform = 'scale(1)';
                }, 1500);
            }, 800);
        });
    });
}

// Room card interactions
function initRoomCardInteractions() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    document.querySelectorAll('.room-card').forEach(card => {
        if (!isMobile) {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        }
    });
}

// Initialize room card interactions
initRoomCardInteractions();

// Experience card interactions
function initExperienceCardInteractions() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    document.querySelectorAll('.experience-card').forEach(card => {
        if (!isMobile) {
            card.addEventListener('mouseenter', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const img = card.querySelector('img');
                if (img) {
                    img.style.transform = 'scale(1)';
                }
            });
        }
    });
}

// Initialize experience card interactions
initExperienceCardInteractions();

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu.classList.contains('hidden')) {
            document.getElementById('mobile-menu-btn').click();
        }
    }
    
    // Skip to main content
    if (e.key === 'Tab' && document.activeElement === document.body) {
        e.preventDefault();
        document.querySelector('main, #home').focus();
    }
});

// Window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        // Recalculate dimensions and animations
        initScrollAnimations();
    }, 250);
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        console.warn(`Failed to load image: ${img.src}`);
    });
});

// Console message for developers
console.log(`
🦁 The Lion Hotel Website
Built with love and attention to detail.

Performance optimized ✓
Accessibility enhanced ✓
Mobile responsive ✓
SEO ready ✓

For development inquiries, please contact the team.
`);

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}