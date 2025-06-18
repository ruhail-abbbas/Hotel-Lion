// Modern Animation Framework for Lion's Rooms n Apartments
// Bidirectional scroll animations with creative effects

class ModernAnimations {
    constructor() {
        this.scrollY = 0;
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
        this.isScrolling = false;
        
        this.init();
    }
    
    init() {
        // Initialize AOS with bidirectional settings
        this.initAOS();
        
        // Set up scroll detection
        this.setupScrollDetection();
        
        // Initialize custom animations
        this.initCustomAnimations();
        
        // Set up intersection observers
        this.setupIntersectionObservers();
        
        // Initialize performance optimizations
        this.initPerformanceOptimizations();
        
        console.log('🎬 Modern Animation Framework initialized');
    }
    
    initAOS() {
        AOS.init({
            duration: 800,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            once: false, // Enable animations on scroll up
            mirror: true, // Animate out when scrolling past
            anchorPlacement: 'top-bottom',
            offset: 100,
            delay: 0,
            startEvent: 'DOMContentLoaded',
            animatedClassName: 'aos-animate',
            initClassName: 'aos-init',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99
        });
    }
    
    setupScrollDetection() {
        let ticking = false;
        
        const updateScrollDirection = () => {
            this.scrollY = window.pageYOffset;
            this.scrollDirection = this.scrollY > this.lastScrollY ? 'down' : 'up';
            
            // Update CSS custom property for parallax effects
            document.documentElement.style.setProperty('--scroll-y', `${this.scrollY}px`);
            
            // Add scroll direction to body
            document.body.setAttribute('data-scroll-direction', this.scrollDirection);
            
            this.lastScrollY = this.scrollY;
            ticking = false;
        };
        
        const requestScrollUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDirection);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }
    
    initCustomAnimations() {
        // Split text animation for hero title
        this.splitTextAnimation();
        
        // Magnetic button effects
        this.initMagneticButtons();
        
        // 3D tilt effects for cards
        this.init3DTiltCards();
        
        // Parallax effects
        this.initParallaxEffects();
        
        // Custom intersection animations
        this.initCustomIntersectionAnimations();
    }
    
    splitTextAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.innerHTML = text
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    return `<span class="char stagger-${(index % 6) + 1}" style="opacity: 0; transform: translateY(50px);">${char}</span>`;
                })
                .join('');
            
            // Trigger animation after a delay
            setTimeout(() => {
                heroTitle.querySelectorAll('.char').forEach((char, index) => {
                    setTimeout(() => {
                        char.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        char.style.opacity = '1';
                        char.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }, 500);
        }
    }
    
    initMagneticButtons() {
        // Only apply magnetic effects to specific button classes, exclude navigation buttons
        const magneticBtns = document.querySelectorAll('.magnetic-btn, .book-room-btn');
        
        magneticBtns.forEach(btn => {
            // Skip if button is inside navigation
            if (btn.closest('nav')) return;
            
            btn.addEventListener('mouseenter', (e) => {
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(200, 169, 126, 0.3)';
            });
            
            btn.addEventListener('mouseleave', (e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = 'none';
            });
            
            btn.addEventListener('mousemove', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                e.target.style.transform = `scale(1.05) translateY(-2px) translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
        });
    }
    
    init3DTiltCards() {
        const tiltCards = document.querySelectorAll('.room-card, .experience-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
                card.style.transition = 'none';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    }
    
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]:not(.hero-bg-image)');
        
        const updateParallax = () => {
            parallaxElements.forEach(element => {
                // Skip hero background image to prevent conflicts with Ken Burns effect
                if (element.classList.contains('hero-bg-image')) return;
                
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(this.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateParallax);
        }, { passive: true });
    }
    
    initCustomIntersectionAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        };
        
        // Staggered animations for lists
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('li, .amenity-item, .feature-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('cascade-up');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.amenities-grid, .features-list').forEach(list => {
            staggerObserver.observe(list);
        });
        
        // Typewriter effect for quotes
        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('typewriter');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('blockquote').forEach(quote => {
            typewriterObserver.observe(quote);
        });
    }
    
    setupIntersectionObservers() {
        // Enhanced intersection observer for bidirectional animations
        const enhancedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fade-up';
                
                if (entry.isIntersecting) {
                    element.classList.add('animate-in', animationType);
                    element.style.willChange = 'transform, opacity';
                } else {
                    // Allow re-animation on scroll up
                    element.classList.remove('animate-in', animationType);
                    element.style.willChange = 'auto';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px 0px'
        });
        
        // Observe all animated elements
        document.querySelectorAll('[data-animation]').forEach(element => {
            enhancedObserver.observe(element);
        });
    }
    
    initPerformanceOptimizations() {
        // Add will-change to elements that will be animated
        const animatedElements = document.querySelectorAll('[data-aos], .room-card, .experience-card');
        animatedElements.forEach(element => {
            element.classList.add('will-animate');
        });
        
        // Intersection observer for performance optimization
        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'transform, opacity, filter';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        }, {
            threshold: 0,
            rootMargin: '200px 0px'
        });
        
        animatedElements.forEach(element => {
            performanceObserver.observe(element);
        });
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                AOS.refresh();
            }, 250);
        });
    }
    
    // Public methods for manual animation triggers
    animateElement(element, animationType, delay = 0) {
        setTimeout(() => {
            element.classList.add('animate-in', animationType);
        }, delay);
    }
    
    staggerChildren(parent, animationType, staggerDelay = 100) {
        const children = parent.children;
        Array.from(children).forEach((child, index) => {
            this.animateElement(child, animationType, index * staggerDelay);
        });
    }
    
    // Method to refresh animations
    refresh() {
        AOS.refresh();
    }
    
    // Method to disable animations for accessibility
    disableAnimations() {
        document.body.classList.add('reduced-motion');
        AOS.init({ duration: 1, once: true });
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    window.modernAnimations = new ModernAnimations();
    
    if (prefersReducedMotion.matches) {
        window.modernAnimations.disableAnimations();
    }
    
    // Listen for changes in motion preference
    prefersReducedMotion.addEventListener('change', () => {
        if (prefersReducedMotion.matches) {
            window.modernAnimations.disableAnimations();
        } else {
            window.modernAnimations.refresh();
        }
    });
});

// Ken Burns effect is now handled with pure CSS for better performance

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernAnimations;
}