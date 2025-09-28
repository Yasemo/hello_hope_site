// Testimonials Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonials_carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel_track');
    const cards = carousel.querySelectorAll('.testimonial_card');
    const dots = carousel.querySelectorAll('.carousel_dot');
    const leftArrow = carousel.querySelector('.carousel_arrow_left');
    const rightArrow = carousel.querySelector('.carousel_arrow_right');
    
    let currentSlide = 0;
    let autoRotateInterval;
    let isHovered = false;

    // Initialize carousel
    function initCarousel() {
        if (cards.length === 0) return;
        
        // Set initial positions
        updateCarousel();
        
        // Start auto-rotation
        startAutoRotation();
        
        // Add event listeners
        addEventListeners();
    }

    // Update carousel position and active states
    function updateCarousel() {
        // Update track position
        const translateX = -currentSlide * (100 / cards.length);
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update active card
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentSlide);
        });
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }

    // Go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % cards.length;
        updateCarousel();
    }

    // Go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + cards.length) % cards.length;
        updateCarousel();
    }

    // Start auto-rotation
    function startAutoRotation() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        
        autoRotateInterval = setInterval(() => {
            if (!isHovered) {
                nextSlide();
            }
        }, 5000); // 5 seconds
    }

    // Stop auto-rotation
    function stopAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Add event listeners
    function addEventListeners() {
        // Arrow navigation
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                prevSlide();
                stopAutoRotation();
                startAutoRotation(); // Restart timer
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                nextSlide();
                stopAutoRotation();
                startAutoRotation(); // Restart timer
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoRotation();
                startAutoRotation(); // Restart timer
            });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        carousel.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!carousel.matches(':hover')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    stopAutoRotation();
                    startAutoRotation();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    stopAutoRotation();
                    startAutoRotation();
                    break;
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
                stopAutoRotation();
                startAutoRotation();
            }
        }

        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoRotation();
            } else {
                startAutoRotation();
            }
        });
    }

    // Initialize the carousel
    initCarousel();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAutoRotation();
    });
});

// Progress Bar and Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.querySelector('.progress-bar-fill');
    const navLinks = document.querySelectorAll('.nav-link');
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

    // Contact Form Functionality
    if (contactForm) {
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
        function showSuccess() {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.color = 'green';
            successDiv.style.fontSize = '1rem';
            successDiv.style.marginTop = '1rem';
            successDiv.style.padding = '1rem';
            successDiv.style.backgroundColor = '#d4edda';
            successDiv.style.border = '1px solid #c3e6cb';
            successDiv.style.borderRadius = '5px';
            successDiv.textContent = 'Thank you for your message! We will get back to you within 24-48 hours.';
            
            contactForm.appendChild(successDiv);
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const validation = validateForm();
            
            if (!validation.isValid) {
                showErrors(validation.errors);
                return;
            }

            // Remove any existing error messages
            const existingErrors = document.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Simulate form submission (replace with actual submission logic)
            const submitBtn = contactForm.querySelector('.submit_btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate API call delay
            setTimeout(() => {
                console.log('Form submitted:', data);
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showSuccess();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
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
