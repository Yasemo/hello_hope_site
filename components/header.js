/**
 * Header Component JavaScript
 * Handles header loading, mobile menu functionality, navigation highlighting, and progress bar
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
            document.addEventListener('DOMContentLoaded', () => this.loadHeader());
        } else {
            this.loadHeader();
        }
    }

    async loadHeader() {
        try {
            // Check if we can use fetch (server environment)
            if (window.location.protocol !== 'file:') {
                // Load header HTML from component file
                const response = await fetch('components/header.html');
                const headerHTML = await response.text();
                
                // Find existing header or create placeholder
                let headerElement = document.querySelector('header.header');
                if (!headerElement) {
                    headerElement = document.querySelector('#header-placeholder');
                }
                
                if (headerElement) {
                    // Replace with loaded header
                    headerElement.outerHTML = headerHTML;
                }
            } else {
                // Fallback for file:// protocol - create header inline
                this.createHeaderInline();
            }
            
            // Setup header functionality after loading
            this.setupHeader();
        } catch (error) {
            console.error('Failed to load header component:', error);
            // Fallback to inline header creation
            this.createHeaderInline();
            this.setupHeader();
        }
    }

    createHeaderInline() {
        const headerHTML = `
        <!-- Header Component -->
        <header class="header">
          <div class="header_container">
            <a href="index.html#hero" class="header_logo">
              <img src="logos/red/red_Red 36x36.png" alt="Hello Hope Canada Logo">
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="header_nav desktop_nav">
              <a href="index.html#hero" class="nav-link" data-page="home">
                <span class="nav-text">
                  <span class="nav-text-original">Home</span>
                  <span class="nav-text-hover">Home</span>
                </span>
              </a>
              <a href="index.html#aubrey" class="nav-link" data-page="about">
                <span class="nav-text">
                  <span class="nav-text-original">About</span>
                  <span class="nav-text-hover">About</span>
                </span>
              </a>
              <a href="index.html#testimonials" class="nav-link" data-page="testimonials">
                <span class="nav-text">
                  <span class="nav-text-original">Testimonials</span>
                  <span class="nav-text-hover">Testimonials</span>
                </span>
              </a>
              <a href="index.html#programs" class="nav-link" data-page="programs">
                <span class="nav-text">
                  <span class="nav-text-original">Programs</span>
                  <span class="nav-text-hover">Programs</span>
                </span>
              </a>
              <a href="conference.html" class="nav-link" data-page="conference">
                <span class="nav-text">
                  <span class="nav-text-original">Conference</span>
                  <span class="nav-text-hover">Conference</span>
                </span>
              </a>
            </nav>
            
            <!-- Desktop Contact Button -->
            <div class="contact_button desktop_contact">
              <a href="index.html#contact" class="nav-link contact-btn">
                <span class="nav-text">
                  <span class="nav-text-original">Contact Us</span>
                  <span class="nav-text-hover">Contact Us</span>
                </span>
              </a>
            </div>
            
            <!-- Mobile Menu Button -->
            <button class="mobile_menu_button" aria-label="Toggle mobile menu" aria-expanded="false">
              <span class="hamburger_line"></span>
              <span class="hamburger_line"></span>
              <span class="hamburger_line"></span>
            </button>
          </div>
          
          <!-- Mobile Navigation Menu -->
          <nav class="mobile_nav" aria-hidden="true">
            <div class="mobile_nav_content">
              <a href="index.html#hero" class="mobile_nav_link" data-page="home">
                <span class="nav-text">
                  <span class="nav-text-original">Home</span>
                  <span class="nav-text-hover">Home</span>
                </span>
              </a>
              <a href="index.html#aubrey" class="mobile_nav_link" data-page="about">
                <span class="nav-text">
                  <span class="nav-text-original">About</span>
                  <span class="nav-text-hover">About</span>
                </span>
              </a>
              <a href="index.html#testimonials" class="mobile_nav_link" data-page="testimonials">
                <span class="nav-text">
                  <span class="nav-text-original">Testimonials</span>
                  <span class="nav-text-hover">Testimonials</span>
                </span>
              </a>
              <a href="index.html#programs" class="mobile_nav_link" data-page="programs">
                <span class="nav-text">
                  <span class="nav-text-original">Programs</span>
                  <span class="nav-text-hover">Programs</span>
                </span>
              </a>
              <a href="conference.html" class="mobile_nav_link" data-page="conference">
                <span class="nav-text">
                  <span class="nav-text-original">Conference</span>
                  <span class="nav-text-hover">Conference</span>
                </span>
              </a>
              <a href="index.html#contact" class="mobile_nav_link mobile_contact_btn">
                <span class="nav-text">
                  <span class="nav-text-original">Contact Us</span>
                  <span class="nav-text-hover">Contact Us</span>
                </span>
              </a>
            </div>
          </nav>
          
          <div class="progress-bar">
            <div class="progress-bar-fill"></div>
          </div>
        </header>
        `;

        const placeholder = document.querySelector('#header-placeholder');
        if (placeholder) {
            placeholder.outerHTML = headerHTML;
        }
    }

    setupHeader() {
        this.cacheElements();
        this.setupMobileMenu();
        this.setupProgressBar();
        this.setupNavigation();
        this.highlightCurrentPage();
        this.setPageAttribute();
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

    setPageAttribute() {
        // Set data-page attribute on body for CSS targeting
        document.body.setAttribute('data-page', this.currentPage);
        
        // Update logo based on current page
        this.updateLogo();
    }

    updateLogo() {
        const logoImg = document.querySelector('.header_logo img');
        if (logoImg) {
            if (this.currentPage === 'conference') {
                logoImg.src = 'logos/white/white_white 36x36 .png';
            } else {
                logoImg.src = 'logos/red/red_Red 36x36.png';
            }
        }
    }
}

// Initialize header component when script loads
new HeaderComponent();
