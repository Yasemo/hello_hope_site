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

// Additional utility functions for smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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
});
