
// Conference Countdown Timer Functionality
document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.querySelector('.countdown');
    
    if (!countdownElement) return;
    
    // Target date: May 12th, 2026
    const targetDate = new Date('2026-05-12T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeRemaining = targetDate - now;
        
        if (timeRemaining <= 0) {
            countdownElement.textContent = 'Event Started!';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Format with leading zeros for consistency
        const formattedDays = String(days).padStart(3, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        // Update the countdown display
        countdownElement.textContent = `${formattedDays} : ${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Update countdown every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Clean up interval when page is unloaded
    window.addEventListener('beforeunload', function() {
        clearInterval(countdownInterval);
    });
});

// Conference Day Tabs Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dayTabs = document.querySelectorAll('.day_tab');
    const dayEvents = document.querySelectorAll('.day1_events, .day2_events');
    
    if (!dayTabs.length || !dayEvents.length) return;
    
    // Add click event listeners to day tabs
    dayTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            dayTabs.forEach(t => t.classList.remove('active'));
            
            // Remove active class from all event containers
            dayEvents.forEach(events => events.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Add active class to corresponding event container
            if (index === 0) {
                document.querySelector('.day1_events').classList.add('active');
            } else if (index === 1) {
                document.querySelector('.day2_events').classList.add('active');
            }
        });
    });
});

// Conference Card Deck Animation
document.addEventListener('DOMContentLoaded', function() {
    const imagesContainer = document.querySelector('.images_container');
    const anEventForSection = document.querySelector('.an_event_for');
    
    if (!imagesContainer || !anEventForSection) return;
    
    // Initialize with deck-initial class
    imagesContainer.classList.add('deck-initial');
    
    // Create intersection observer to trigger animation when section is in view
    const observerOptions = {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger a bit before the section is fully in view
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animation sequence when section comes into view
                setTimeout(() => {
                    // Phase 1: Drop the deck
                    imagesContainer.classList.remove('deck-initial');
                    imagesContainer.classList.add('deck-dropped');
                    
                    // Phase 2: Expand into arch after drop completes
                    setTimeout(() => {
                        imagesContainer.classList.remove('deck-dropped');
                        imagesContainer.classList.add('deck-expanded');
                    }, 1000); // Wait for drop animation to complete
                    
                }, 300); // Small delay after section comes into view
                
                // Stop observing after animation is triggered
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing the section
    sectionObserver.observe(anEventForSection);
});

// Conference Hero Page Load Animation
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.conference_hero');
    
    if (!heroSection) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Trigger hero animations after page load
    if (!prefersReducedMotion) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 300);
    } else {
        // For users who prefer reduced motion, show content immediately
        heroSection.classList.add('loaded');
        const elements = heroSection.querySelectorAll('.hero_top, .hero_middle, .hero_bottom');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }
});

// Conference About Image Animation
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.conference_about');
    const aboutImage = document.querySelector('.conference_about img');
    
    if (!aboutSection || !aboutImage) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Create intersection observer for about section
    const aboutObserverOptions = {
        threshold: 0.4, // Trigger when 40% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger before the section is fully in view
    };
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to trigger the slide-in animation
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        aboutImage.classList.add('animate-in');
                    }, 300); // Small delay for better visual effect
                } else {
                    // For users who prefer reduced motion, just show image immediately
                    aboutImage.style.opacity = '1';
                    aboutImage.style.transform = 'translateX(0)';
                }
                
                // Stop observing after animation is triggered
                aboutObserver.unobserve(entry.target);
            }
        });
    }, aboutObserverOptions);
    
    // Start observing the about section
    aboutObserver.observe(aboutSection);
});

// Conference CTA Animation
document.addEventListener('DOMContentLoaded', function() {
    const ctaSection = document.querySelector('.conference_cta');
    
    if (!ctaSection) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Create intersection observer for CTA section
    const ctaObserverOptions = {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the section is fully in view
    };
    
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class to trigger the staggered animations
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        ctaSection.classList.add('animate-in');
                    }, 200); // Small delay for better visual effect
                } else {
                    // For users who prefer reduced motion, just show content immediately
                    ctaSection.classList.add('animate-in');
                    const elements = ctaSection.querySelectorAll('.countdown, h1, p, .buy_tickets');
                    elements.forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    });
                }
                
                // Stop observing after animation is triggered
                ctaObserver.unobserve(entry.target);
            }
        });
    }, ctaObserverOptions);
    
    // Start observing the CTA section
    ctaObserver.observe(ctaSection);
    
    // Add scroll-based parallax effect for background elements (subtle)
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const ctaRect = ctaSection.getBoundingClientRect();
        const ctaTop = ctaRect.top + scrolled;
        const ctaHeight = ctaRect.height;
        
        // Only apply parallax when the section is in view
        if (scrolled + window.innerHeight > ctaTop && scrolled < ctaTop + ctaHeight) {
            const progress = (scrolled + window.innerHeight - ctaTop) / (window.innerHeight + ctaHeight);
            const parallaxOffset = (progress - 0.5) * 50; // Subtle parallax movement
            
            // Apply parallax to pseudo-elements via CSS custom properties
            ctaSection.style.setProperty('--parallax-offset', `${parallaxOffset}px`);
        }
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking && !prefersReducedMotion) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Throttled scroll listener for parallax effect
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile_menu_button');
    const mobileNav = document.querySelector('.mobile_nav');
    const mobileNavLinks = document.querySelectorAll('.mobile_nav_link');
    const body = document.body;
    
    if (!mobileMenuButton || !mobileNav) return;
    
    let isMenuOpen = false;
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        // Update button state
        mobileMenuButton.classList.toggle('active', isMenuOpen);
        mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);
        
        // Update menu state
        mobileNav.classList.toggle('active', isMenuOpen);
        mobileNav.setAttribute('aria-hidden', !isMenuOpen);
        
        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
    
    // Mobile menu button click handler
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on mobile nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && 
            !mobileNav.contains(e.target) && 
            !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Handle focus trap in mobile menu
    function trapFocus(element) {
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
    }
    
    // Apply focus trap when menu is open
    mobileNav.addEventListener('transitionend', () => {
        if (isMenuOpen) {
            trapFocus(mobileNav);
            // Focus first link when menu opens
            const firstLink = mobileNav.querySelector('.mobile_nav_link');
            if (firstLink) {
                firstLink.focus();
            }
        }
    });
});

// Progress Bar and Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.progress-bar-fill');
    const navLinks = document.querySelectorAll('.nav-link, .mobile_nav_link');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.getElementById('contactForm');
    
    // Throttle function for performance
    function throttle(func, limit) {
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
    }

    // Update progress bar based on scroll position
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        }
    }

    // Update active navigation link based on current section
    function updateActiveNavLink() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = 70; // Header height offset
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Extra offset for better UX
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
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

    // Scroll event listener with throttling
    const throttledScrollHandler = throttle(() => {
        updateProgressBar();
        updateActiveNavLink();
    }, 16); // ~60fps

    window.addEventListener('scroll', throttledScrollHandler);

    // Initial calls
    updateProgressBar();
    updateActiveNavLink();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.testimonial_card, .org_logo, .program_card');
    fadeElements.forEach(el => observer.observe(el));

    // Enroll Now Button Functionality
    const enrollButtons = document.querySelectorAll('.enroll_btn');
    const programSelect = document.getElementById('program');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the program value from data attribute
            const programValue = this.getAttribute('data-program');
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = 70;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Pre-select the program after a short delay to ensure scroll completes
                setTimeout(() => {
                    if (programSelect && programValue) {
                        programSelect.value = programValue;
                        
                        // Add visual feedback - highlight the selected option
                        programSelect.style.backgroundColor = '#f0f8ff';
                        programSelect.style.borderColor = 'var(--primary-color)';
                        
                        // Remove highlight after 2 seconds
                        setTimeout(() => {
                            programSelect.style.backgroundColor = '';
                            programSelect.style.borderColor = '';
                        }, 2000);
                    }
                }, 800); // Wait for scroll animation to mostly complete
            }
        });
    });

    // Contact Form Functionality
    if (contactForm) {
        // Program name mapping function
        function getProgramDisplayName(programValue) {
            const programMap = {
                'hello-hope': 'Hello Hope: Battling Stress & Loneliness',
                'colour-blind': 'Colour Blind? Why Being \'Not Racist\' Is Not Enough',
                'stick-truth': 'Stick With The Truth',
                'just-here': 'I\'m Just Here: What Am I Doing?',
                'man-up': 'Man Up: Being A Real Man',
                'reconnect': 'Reconnect',
                'multiple': 'Multiple Programs',
                'other': 'Other/General Inquiry'
            };
            
            return programMap[programValue] || programValue || 'Not specified';
        }

        // Form validation
        function validateForm() {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            let errors = [];

            // Name validation
            if (!name) {
                errors.push('Name is required');
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                errors.push('Email is required');
                isValid = false;
            } else if (!emailRegex.test(email)) {
                errors.push('Please enter a valid email address');
                isValid = false;
            }

            // Message validation
            if (!message) {
                errors.push('Message is required');
                isValid = false;
            } else if (message.length < 10) {
                errors.push('Message must be at least 10 characters long');
                isValid = false;
            }

            return { isValid, errors };
        }

        // Show validation errors
        function showErrors(errors) {
            // Remove existing error messages
            const existingErrors = document.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());

            // Add new error messages
            errors.forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = 'var(--primary-color)';
                errorDiv.style.fontSize = '0.9rem';
                errorDiv.style.marginTop = '0.5rem';
                errorDiv.textContent = error;
                
                // Insert error message after the form
                contactForm.appendChild(errorDiv);
            });
        }

        // Show success message
        function showSuccess(message = 'Thank you for your message! We will get back to you within 24-48 hours.') {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.color = 'green';
            successDiv.style.fontSize = '1rem';
            successDiv.style.marginTop = '1rem';
            successDiv.style.padding = '1rem';
            successDiv.style.backgroundColor = '#d4edda';
            successDiv.style.border = '1px solid #c3e6cb';
            successDiv.style.borderRadius = '5px';
            successDiv.textContent = message;
            
            contactForm.appendChild(successDiv);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }

        // Form submission using EmailJS
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const validation = validateForm();
            
            if (!validation.isValid) {
                showErrors(validation.errors);
                return;
            }

            // Remove any existing error messages
            const existingErrors = document.querySelectorAll('.error-message, .success-message');
            existingErrors.forEach(error => error.remove());

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Submit form using EmailJS
            const submitBtn = contactForm.querySelector('.submit_btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Prepare template parameters for EmailJS
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone || 'Not provided',
                    organization: data.organization || 'Not provided',
                    program: getProgramDisplayName(data.program),
                    message: data.message,
                    to_email: 'yaseen@rep.company'
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_ct4ha7h',    // Service ID
                    'template_pwq5jhb',   // Template ID
                    templateParams
                );

                console.log('EmailJS response:', response);

                if (response.status === 200) {
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message
                    showSuccess('Thank you for your message! We will get back to you within 24-48 hours.');
                } else {
                    // Show error message
                    showErrors(['Sorry, there was an error sending your message. Please try again.']);
                }
                
            } catch (error) {
                console.error('EmailJS error:', error);
                showErrors(['Sorry, there was an error sending your message. Please check your internet connection and try again.']);
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Real-time validation feedback
        const requiredFields = ['name', 'email', 'message'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('blur', function() {
                    const value = this.value.trim();
                    const existingError = this.parentNode.querySelector('.field-error');
                    
                    if (existingError) {
                        existingError.remove();
                    }

                    if (!value) {
                        const errorSpan = document.createElement('span');
                        errorSpan.className = 'field-error';
                        errorSpan.style.color = 'var(--primary-color)';
                        errorSpan.style.fontSize = '0.8rem';
                        errorSpan.style.marginTop = '0.25rem';
                        errorSpan.textContent = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`;
                        this.parentNode.appendChild(errorSpan);
                    }
                });

                field.addEventListener('input', function() {
                    const existingError = this.parentNode.querySelector('.field-error');
                    if (existingError && this.value.trim()) {
                        existingError.remove();
                    }
                });
            }
        });
    }
});
