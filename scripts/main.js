
// Hero Video Sound Toggle
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('heroVideo');
    const soundToggle = document.getElementById('soundToggle');

    if (heroVideo && soundToggle) {
        // Robust autoplay function with mobile restriction handling
        function attemptAutoplay() {
            // Ensure video is muted for autoplay compliance
            heroVideo.muted = true;
            
            const playPromise = heroVideo.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video autoplay succeeded');
                }).catch(error => {
                    console.log('Video autoplay blocked by browser:', error.message);

                    // Fallback: Play on first user interaction (click, touch, scroll)
                    const playOnInteraction = () => {
                        heroVideo.play()
                            .then(() => {
                                console.log('Video playing after user interaction');
                                cleanupListeners();
                            })
                            .catch(err => console.log('Video interaction play failed:', err));
                    };

                    const cleanupListeners = () => {
                        document.removeEventListener('click', playOnInteraction);
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('keydown', playOnInteraction);
                        window.removeEventListener('scroll', playOnInteraction);
                    };

                    // Add listeners for various user interactions
                    document.addEventListener('click', playOnInteraction, { once: true });
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('keydown', playOnInteraction, { once: true });
                    window.addEventListener('scroll', playOnInteraction, { once: true, passive: true });
                });
            }
        }

        // Wait for video to be ready before attempting autoplay
        if (heroVideo.readyState >= 3) { // HAVE_FUTURE_DATA or higher
            attemptAutoplay();
        } else {
            heroVideo.addEventListener('canplay', attemptAutoplay, { once: true });
        }

        // Function to toggle sound
        function toggleSound() {
            if (heroVideo.muted) {
                // Unmute the video
                heroVideo.muted = false;
                soundToggle.classList.add('active');
                
                // Update icon to show sound is on (speaker with waves)
                soundToggle.querySelector('.sound-icon').innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14"/>
                `;
                soundToggle.querySelector('.sound-text').textContent = 'Sound On';
                
                // On mobile, unmuting requires re-initiating play for audio to work
                // Always call play() after unmuting to ensure proper playback
                heroVideo.play().catch(err => console.log('Video play failed:', err));
            } else {
                // Mute the video
                heroVideo.muted = true;
                soundToggle.classList.remove('active');
                
                // Update icon to show sound is off (speaker with X)
                soundToggle.querySelector('.sound-icon').innerHTML = `
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `;
                soundToggle.querySelector('.sound-text').textContent = 'Sound Off';
                
                // Ensure video continues playing when muted
                if (heroVideo.paused) {
                    heroVideo.play().catch(err => console.log('Video play failed:', err));
                }
            }
        }
        
        // Handle click/touch events (works for both desktop and mobile)
        soundToggle.addEventListener('click', function(e) {
            toggleSound();
            // Track sound toggle event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_sound_toggle', {
                    'event_category': 'engagement',
                    'event_label': heroVideo.muted ? 'muted' : 'unmuted'
                });
            }
        });
    }
});

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
            
            // Trigger animation for newly visible events
            setTimeout(() => {
                animateVisibleEvents();
            }, 100);
        });
    });
    
    // Function to animate events that are currently visible
    function animateVisibleEvents() {
        const events = document.querySelectorAll('.event');
        
        events.forEach((event, index) => {
            // Check if event is in an active container
            const parentContainer = event.closest('.day1_events, .day2_events');
            if (parentContainer && parentContainer.classList.contains('active')) {
                // Add staggered animation
                setTimeout(() => {
                    event.classList.add('animate-in');
                }, index * 100); // 100ms delay between each event
            }
        });
    }
    
    // Animate events in the initially active tab
    setTimeout(() => {
        animateVisibleEvents();
    }, 300);
});

// Event Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const events = document.querySelectorAll('.event');
    
    if (events.length === 0) return;
    
    // Create intersection observer for events
    const eventObserverOptions = {
        threshold: 0.3, // Trigger when 30% of the event is visible
        rootMargin: '0px 0px -80px 0px'
    };
    
    const eventObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Check if the event is in an active day container
                const parentContainer = entry.target.closest('.day1_events, .day2_events');
                if (parentContainer && parentContainer.classList.contains('active')) {
                    // Animate immediately as it scrolls into view
                    entry.target.classList.add('animate-in');
                    
                    // Stop observing this event after animation
                    eventObserver.unobserve(entry.target);
                }
            }
        });
    }, eventObserverOptions);
    
    // Start observing each event
    events.forEach(event => {
        eventObserver.observe(event);
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

// Conference Hero Page Load Animation with Sequential Title Words
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.conference_hero');
    const heroTitle = document.querySelector('.hero_middle h1');
    
    if (!heroSection || !heroTitle) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Split title into word spans for sequential animation
    const titleText = heroTitle.innerHTML;
    const words = titleText.split('<br>');
    
    // Create spans for each word
    heroTitle.innerHTML = '';
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = `hero-word hero-word-${index + 1}`;
        span.innerHTML = word;
        heroTitle.appendChild(span);
        
        // Add line break after first and second word
        if (index < words.length - 1) {
            heroTitle.appendChild(document.createElement('br'));
        }
    });
    
    // Trigger hero animations after page load
    if (!prefersReducedMotion) {
        // Add loaded class to trigger background and overlay animations
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 100);
        
        // Sequential word animations - each word completes before next starts
        // "STAY" from left starts at 0.6s, takes 1.6s (completes at 2.2s)
        setTimeout(() => {
            document.querySelector('.hero-word-1')?.classList.add('animate-in');
        }, 600);
        
        // "SENSITIZED" from right starts after STAY completes (2.2s), takes 1.6s (completes at 3.8s)
        setTimeout(() => {
            document.querySelector('.hero-word-2')?.classList.add('animate-in');
        }, 2200);
        
        // "CONFERENCE" fade in starts after SENSITIZED completes (3.8s), takes 0.6s
        setTimeout(() => {
            document.querySelector('.hero-word-3')?.classList.add('animate-in');
        }, 3800);
        
    } else {
        // For users who prefer reduced motion, show content immediately
        heroSection.classList.add('loaded');
        const elements = heroSection.querySelectorAll('.hero_top, .hero_middle, .hero_bottom');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        document.querySelectorAll('.hero-word').forEach(word => {
            word.style.opacity = '1';
            word.style.transform = 'translateX(0)';
        });
    }
});

// Conference About Image Animation
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.conference_about');
    const aboutImageWrapper = document.querySelector('.about-image-wrapper');
    
    if (!aboutSection || !aboutImageWrapper) return;
    
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
                // Add animation class to trigger the overlay reveal animation
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        aboutImageWrapper.classList.add('animate-in');
                    }, 300); // Small delay for better visual effect
                } else {
                    // For users who prefer reduced motion, remove overlay immediately
                    aboutImageWrapper.classList.add('animate-in');
                }
                
                // Stop observing after animation is triggered
                aboutObserver.unobserve(entry.target);
            }
        });
    }, aboutObserverOptions);
    
    // Start observing the about section
    aboutObserver.observe(aboutSection);
});

// Buy Tickets Button Scroll Functionality
document.addEventListener('DOMContentLoaded', function() {
    const buyTicketsButtons = document.querySelectorAll('.buy_tickets');
    const ctaSection = document.querySelector('.conference_cta');

    if (buyTicketsButtons.length > 0 && ctaSection) {
    buyTicketsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Track buy tickets button click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'buy_tickets_clicked', {
                    'event_category': 'conference',
                    'event_label': 'buy_tickets_button',
                    'page_location': window.location.href
                });
            }

            // Scroll to the conference_cta section
            const headerHeight = 70; // Account for fixed header
            const targetPosition = ctaSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    }
});

// Aubrey Stats Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.aubrey_stats');
    
    if (!statsSection) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    let hasAnimated = false;
    
    // Format number based on the target value
    function formatNumber(num, target) {
        if (target === 1000) {
            return num.toLocaleString() + '+'; // "1,000+"
        } else if (target === 220000) {
            return num.toLocaleString() + '+'; // "220,000+"
        } else if (target === 2000) {
            return num.toLocaleString() + '+'; // "2,000+"
        } else if (target === 95) {
            return Math.floor(num) + '%'; // "95%"
        }
        return num.toString();
    }
    
    // Easing function for smooth animation
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    // Animate a single counter
    function animateCounter(element, target, duration = 2000) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);
            
            element.textContent = formatNumber(current, target);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is set correctly
                element.textContent = formatNumber(target, target);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Intersection Observer to trigger animation
    const observerOptions = {
        threshold: 0.5, // Trigger when 50% of the section is visible
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                
                // Get all stat boxes and stat number elements
                const statBoxes = document.querySelectorAll('.stat_box');
                const statNumbers = document.querySelectorAll('.stat_number');
                
                // Add fade-in class to all stat boxes with staggered delay
                statBoxes.forEach((box, index) => {
                    setTimeout(() => {
                        box.classList.add('fade-in');
                    }, index * 100); // 100ms stagger between boxes
                });
                
                if (prefersReducedMotion) {
                    // For users who prefer reduced motion, show final values immediately
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        stat.textContent = formatNumber(target, target);
                    });
                } else {
                    // Animate each counter with a slight delay between them
                    statNumbers.forEach((stat, index) => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        setTimeout(() => {
                            animateCounter(stat, target);
                        }, index * 150 + 300); // Start counters after fade-in begins
                    });
                }
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Start observing the stats section
    observer.observe(statsSection);
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

// Speaker Cards Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const proCards = document.querySelectorAll('.pro');

    if (proCards.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create intersection observer for speaker cards
    const proObserverOptions = {
        threshold: 0.2, // Trigger when 20% of the card is visible
        rootMargin: '0px 0px -50px 0px'
    };

    const proObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add slight stagger for visual appeal
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100); // Stagger by 100ms
                } else {
                    // For users who prefer reduced motion, just show immediately
                    entry.target.classList.add('animate-in');
                }

                // Stop observing this card after animation
                proObserver.unobserve(entry.target);
            }
        });
    }, proObserverOptions);

    // Start observing each speaker card
    proCards.forEach(card => {
        proObserver.observe(card);
    });
});

// Core Outcomes Cards Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const outcomeCards = document.querySelectorAll('.outcome_card');

    if (outcomeCards.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create intersection observer for outcome cards
    const outcomeObserverOptions = {
        threshold: 0.2, // Trigger when 20% of the card is visible
        rootMargin: '0px 0px -50px 0px'
    };

    const outcomeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation for visual appeal
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 150); // Stagger by 150ms between cards
                } else {
                    // For users who prefer reduced motion, just show immediately
                    entry.target.classList.add('animate-in');
                }

                // Stop observing this card after animation
                outcomeObserver.unobserve(entry.target);
            }
        });
    }, outcomeObserverOptions);

    // Start observing each outcome card
    outcomeCards.forEach(card => {
        outcomeObserver.observe(card);
    });
});

// Venue Cards Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const venueCards = document.querySelectorAll('.venue_card');

    if (venueCards.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create intersection observer for venue cards
    const venueObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const venueObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 150);
                } else {
                    entry.target.classList.add('animate-in');
                }

                venueObserver.unobserve(entry.target);
            }
        });
    }, venueObserverOptions);

    venueCards.forEach(card => {
        venueObserver.observe(card);
    });
});

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq_item');
    const faqQuestions = document.querySelectorAll('.faq_question');

    if (faqQuestions.length === 0) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Toggle FAQ answer
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq_answer');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded attribute
            this.setAttribute('aria-expanded', !isExpanded);

            // Toggle answer visibility
            if (isExpanded) {
                answer.classList.remove('active');
            } else {
                answer.classList.add('active');
            }
        });

        // Keyboard accessibility - Enter and Space keys
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Scroll animation for FAQ items
    const faqObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                } else {
                    entry.target.classList.add('animate-in');
                }

                faqObserver.unobserve(entry.target);
            }
        });
    }, faqObserverOptions);

    faqItems.forEach(item => {
        faqObserver.observe(item);
    });
});

// Speaker Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('speakerModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const speakerCards = document.querySelectorAll('.pro');
    const body = document.body;

    if (!modal || speakerCards.length === 0) return;

    // Open modal function
    function openModal(speakerData) {
        // Populate modal with speaker data
        document.getElementById('modalImage').src = speakerData.image;
        document.getElementById('modalImage').alt = speakerData.name;
        document.getElementById('modalSpeakerName').textContent = speakerData.name;
        document.getElementById('modalSpeakerTitle').textContent = speakerData.title;
        document.getElementById('modalBio').textContent = speakerData.bio;

        // Set social media links
        document.getElementById('modalLinkedin').href = speakerData.linkedin;
        document.getElementById('modalFacebook').href = speakerData.facebook;
        document.getElementById('modalInstagram').href = speakerData.instagram;

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        setTimeout(() => {
            modalClose.focus();
        }, 100);
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        body.style.overflow = '';
    }

    // Add click event to each speaker card
    speakerCards.forEach(card => {
        card.addEventListener('click', function() {
            const speakerData = {
                name: this.getAttribute('data-name'),
                title: this.getAttribute('data-title'),
                image: this.getAttribute('data-image'),
                bio: this.getAttribute('data-bio'),
                linkedin: this.getAttribute('data-linkedin'),
                facebook: this.getAttribute('data-facebook'),
                instagram: this.getAttribute('data-instagram')
            };

            openModal(speakerData);
        });

        // Keyboard accessibility for speaker cards
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View profile for ${card.getAttribute('data-name')}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Close modal when clicking close button
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Focus trap within modal
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
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

    // Handle URL hash scrolling with better timing and offset calculation
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # character
        const targetElement = document.getElementById(hash);

        if (targetElement) {
            // Allow more time for page content to load
            setTimeout(() => {
                // Calculate the target position accounting for various positioning offsets
                const headerHeight = 70;
                const targetRect = targetElement.getBoundingClientRect();
                const absoluteElementTop = window.pageYOffset + targetRect.top;

                // Additional offset for sections with CSS positioning that affects scroll calculation
                let positioningOffset = 0;
                const sectionParent = targetElement.closest('section');
                if (sectionParent) {
                    const computedStyle = getComputedStyle(sectionParent);
                    if (computedStyle.position === 'relative') {
                        positioningOffset = parseFloat(computedStyle.top) || 0;
                    }
                }

                const targetPosition = absoluteElementTop - headerHeight + positioningOffset;

                // Scroll to the calculated position
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 200); // Increased delay to ensure all content is loaded
        }
    }
    
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

    // Enhanced smooth scroll for anchor links (including aubrey buttons)
    // Select both #section and /#section formats
    const anchorLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract target ID from href (handle both #section and /#section)
            const href = this.getAttribute('href');
            const targetId = href.startsWith('/#') ? href.substring(2) : href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Clean URL FIRST before scrolling to prevent hash from showing
                const cleanUrl = window.location.pathname;
                history.replaceState(null, '', cleanUrl);
                
                const headerHeight = 70;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Add visual feedback for aubrey buttons
                if (this.classList.contains('aubrey_btn')) {
                    // Add a subtle pulse effect to indicate the action
                    this.style.transform = 'translateY(-2px) scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                }
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

    // Clean URL Auto-scroll Functionality
    // Check if URL contains clean URLs that need to scroll to sections
    if (window.location.pathname === '/testimonials') {
        // Wait for page to load then scroll to testimonials section
        setTimeout(() => {
            const testimonialsSection = document.getElementById('testimonials');
            if (testimonialsSection) {
                const headerHeight = 70;
                const targetPosition = testimonialsSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Optionally replace URL to remove the path (invisible URL bar)
                history.replaceState(null, '', '/');
            }
        }, 500); // Wait for page content to load
    }

    // Enroll Now Button Functionality
    const enrollButtons = document.querySelectorAll('.enroll_btn');
    const programSelect = document.getElementById('program');
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Check if this is a link with an external href (to another page)
            const href = this.getAttribute('href');
            if (href && (href.startsWith('/') || href.startsWith('http'))) {
                // Track program learn more click
                const programValue = this.getAttribute('data-program') || 'unknown';
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'program_learn_more_clicked', {
                        'event_category': 'programs',
                        'event_label': programValue,
                        'page_location': window.location.href
                    });
                }
                // Allow the link to navigate normally
                return;
            }
            
            e.preventDefault();
            
            // Get the program value from data attribute
            const programValue = this.getAttribute('data-program');
            
            // Track program enroll button click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'program_enroll_clicked', {
                    'event_category': 'programs',
                    'event_label': programValue || 'unknown',
                    'page_location': window.location.href
                });
            }
            
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
                // Load EmailJS configuration from server
                const configResponse = await fetch('/api/config');
                const config = await configResponse.json();

                // Get selected audiences from checkboxes
                const audienceCheckboxes = document.querySelectorAll('input[name="audience"]:checked');
                const selectedAudiences = Array.from(audienceCheckboxes).map(cb => cb.value);
                const audiencesText = selectedAudiences.length > 0 ? selectedAudiences.join(', ') : 'Not specified';

                // Prepare template parameters for EmailJS
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone || 'Not provided',
                    organization: data.organization || 'Not provided',
                    program: getProgramDisplayName(data.program),
                    target_audiences: audiencesText,
                    num_sessions: data.sessions || 'Not specified',
                    school_info: data.school_info || 'Not provided',
                    message: data.message,
                    to_email: 'aubrey@hellohope.ca'
                };

                // Send email using EmailJS with dynamic configuration
                const response = await emailjs.send(
                    config.emailjs.serviceId,
                    config.emailjs.templateId,
                    templateParams
                );

                console.log('EmailJS response:', response);

                if (response.status === 200) {
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'contact',
                            'event_label': 'contact_form_success',
                            'program_interest': getProgramDisplayName(data.program),
                            'page_location': window.location.href
                        });
                    }

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
