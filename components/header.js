/**
 * Header Component JavaScript
 * Handles mobile menu functionality, navigation highlighting, and progress bar
 */

class HeaderComponent {
    constructor() {
        this.mobileMenuButton = null;
        this.mobileNav = null;
        this.mobileNavLinks = null;
        this.progressBar = null;
        this.navLinks = null;
        this.sections = null;
        this.isMenuOpen = false;
        this.currentPage = this.getCurrentPage();
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupHeader());
        } else {
            this.setupHeader();
        }
    }

    setupHeader() {
        this.cacheElements();
        this.setupMobileMenu();
        this.setupProgressBar();
        this.setupNavigation();
        this.highlightCurrentPage();
    }

    cacheElements() {
        this.mobileMenuButton = document.querySelector('.mobile_menu_button');
        this.mobileNav = document.querySelector('.mobile_nav');
        this.mobileNavLinks = document.querySelectorAll('.mobile_nav_link');
        this.progressBar = document.querySelector('.progress-bar-fill');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile_nav_link');
        this.sections = document.querySelectorAll('section[id]');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        if (filename === 'conference.html') return 'conference';
        return 'home'; // Default to home for index.html or root
    }

    highlightCurrentPage() {
        // Remove active class from all nav links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current page links
        this.navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        if (!this.mobileMenuButton || !this.mobileNav) return;

        // Mobile menu button click handler
        this.mobileMenuButton.addEventListener('click', () => this.toggleMobileMenu());

        // Close menu when clicking on mobile nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.mobileNav.contains(e.target) && 
                !this.mobileMenuButton.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Close menu on window resize to desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle focus trap in mobile menu
        this.setupFocusTrap();
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        // Update button state
        this.mobileMenuButton.classList.toggle('active', this.isMenuOpen);
        this.mobileMenuButton.setAttribute('aria-expanded', this.isMenuOpen);
        
        // Update menu state
        this.mobileNav.classList.toggle('active', this.isMenuOpen);
        this.mobileNav.setAttribute('aria-hidden', !this.isMenuOpen);
        
        // Prevent body scroll when menu is open
        if (this.isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    setupFocusTrap() {
        if (!this.mobileNav) return;

        const trapFocus = (element) => {
            const focusableElements = element.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        };

        // Apply focus trap when menu is open
        this.mobileNav.addEventListener('transitionend', () => {
            if (this.isMenuOpen) {
                trapFocus(this.mobileNav);
                // Focus first link when menu opens
                const firstLink = this.mobileNav.querySelector('.mobile_nav_link');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        });
    }

    setupProgressBar() {
        if (!this.progressBar) return;

        // Throttle function for performance
        const throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };

        // Update progress bar based on scroll position
        const updateProgressBar = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            this.progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        };

        // Throttled scroll listener
        const throttledScrollHandler = throttle(updateProgressBar, 16); // ~60fps
        window.addEventListener('scroll', throttledScrollHandler);

        // Initial call
        updateProgressBar();
    }

    setupNavigation() {
        // Enhanced smooth scroll for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 70;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation link based on current section (only for index page)
        if (this.currentPage === 'home' && this.sections.length > 0) {
            this.setupSectionHighlighting();
        }
    }

    setupSectionHighlighting() {
        // Throttle function for performance
        const throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        };

        const updateActiveNavLink = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const headerHeight = 70; // Header height offset
            
            let currentSection = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50; // Extra offset for better UX
                const sectionHeight = section.offsetHeight;
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Update nav links (only for section-based navigation, not page-based)
            this.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.classList.remove('active');
                    if (href === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                }
            });
        };

        // Throttled scroll listener
        const throttledScrollHandler = throttle(updateActiveNavLink, 16); // ~60fps
        window.addEventListener('scroll', throttledScrollHandler);

        // Initial call
        updateActiveNavLink();
    }
}

// Initialize header component when script loads
new HeaderComponent();
