// Main JavaScript for Hello Hope Canada website

class HelloHopeApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollAnimations();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupAccordion();
  }

  // Mobile Menu Functionality
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu(mobileToggle, mobileMenu);
    });

    // Close menu when clicking on a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu(mobileToggle, mobileMenu);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        this.closeMobileMenu(mobileToggle, mobileMenu);
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu(mobileToggle, mobileMenu);
      }
    });
  }

  toggleMobileMenu(toggle, menu) {
    const isActive = toggle.classList.contains('mobile-menu-toggle--active');
    
    if (isActive) {
      this.closeMobileMenu(toggle, menu);
    } else {
      this.openMobileMenu(toggle, menu);
    }
  }

  openMobileMenu(toggle, menu) {
    toggle.classList.add('mobile-menu-toggle--active');
    menu.classList.add('mobile-menu--active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstLink = menu.querySelector('.mobile-menu__link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 300);
    }
  }

  closeMobileMenu(toggle, menu) {
    toggle.classList.remove('mobile-menu-toggle--active');
    menu.classList.remove('mobile-menu--active');
    document.body.style.overflow = '';
  }

  // Scroll Animations using Intersection Observer
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .hero__title, .hero__subtitle, .hero__cta');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      // Skip elements that already have animations (like hero elements)
      if (!element.style.animation) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      }
      observer.observe(element);
    });
  }

  // Smooth scrolling for anchor links
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Active navigation highlighting
  setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // Accordion functionality
  setupAccordion() {
    const accordionSections = document.querySelectorAll('.accordion-section');

    if (!accordionSections.length) return;

    accordionSections.forEach((section, index) => {
      // Add click handler to each section
      section.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons or links
        if (e.target.closest('.btn') || e.target.closest('a')) {
          return;
        }

        this.toggleAccordionSection(section);
      });

      // Add keyboard support
      section.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAccordionSection(section);
        }
      });

      // Make sections focusable for accessibility
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'button');
      section.setAttribute('aria-expanded', 'false');
    });

    // Expand the first section by default
    if (accordionSections.length > 0) {
      setTimeout(() => {
        this.expandAccordionSection(accordionSections[0]);
      }, 500);
    }
  }

  toggleAccordionSection(section) {
    const isExpanded = section.classList.contains('expanded');

    if (isExpanded) {
      this.collapseAccordionSection(section);
    } else {
      this.expandAccordionSection(section);
    }
  }

  expandAccordionSection(section) {
    const allSections = document.querySelectorAll('.accordion-section');

    // Collapse all other sections first
    allSections.forEach(s => {
      if (s !== section) {
        this.collapseAccordionSection(s);
      }
    });

    // Expand the clicked section
    section.classList.remove('collapsed');
    section.classList.add('expanded');
    section.setAttribute('aria-expanded', 'true');

    // Trigger any existing animations
    const animatedElements = section.querySelectorAll('.hero__title, .hero__subtitle, .hero__cta, .aubrey__title, .aubrey__subtitle, .aubrey__cta, .testimonials__title, .testimonials__subtitle, .testimonials__cta, .cta__title, .cta__subtitle, .cta__cta');

    animatedElements.forEach((element, index) => {
      if (!element.style.animation) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }

  collapseAccordionSection(section) {
    section.classList.remove('expanded');
    section.classList.add('collapsed');
    section.setAttribute('aria-expanded', 'false');
  }

  // Utility method for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HelloHopeApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    // Resume animations when page becomes visible
    document.body.style.animationPlayState = 'running';
  }
});
