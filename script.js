

// Main Document Ready Function
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded");
    
    // Core UI initialization
    initStickyHeader();
    setupNavigation();
    initAnimations();
    
    // Form handling
    initPackageSelection();
    initFormValidation();
    setupFormScroll();
    initFormSubmissions()
    
    // Visual elements and effects
    updateSvgColors();
    setupServiceCardEffects();
    initParallaxEffect();
    
    // Content components
    initTestimonialSlider();
    initResourceCards();
    
    // Initialize animations after a small delay
    setTimeout(() => {
        initIntersectionObservers();
    }, 100);
});

/**
 * Sticky Header Implementation
 * Creates a transparent to solid background transition on scroll
 */
function initStickyHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    // Apply initial state
    updateHeaderState(window.scrollY > 50);
    
    // Throttled scroll handler
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                updateHeaderState(window.scrollY > 50);
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Helper function to update header styles
    function updateHeaderState(isScrolled) {
        if (isScrolled) {
            header.style.background = 'rgba(0, 0, 0, 0.9)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.webkitBackdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.boxShadow = 'none';
            header.style.backdropFilter = 'none';
            header.style.webkitBackdropFilter = 'none';
        }
    }
}

/**
 * Navigation System
 * Combines mobile menu, smooth scrolling, and logo click behavior
 */
function setupNavigation() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupLogoNavigation();
}

/**
 * Mobile Menu Handler
 * Manages the mobile menu toggle and interaction
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!mobileMenuToggle || !navMenu) return;
    
    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });
    
    // Set index variables for staggered animations
    navLinks.forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
    
    // Helper function to toggle menu state
    function toggleMobileMenu(show = null) {
        if (show === null) {
            // Toggle current state
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-active');
            mobileMenuToggle.classList.toggle('active');
        } else if (show) {
            // Force show
            navMenu.classList.add('active');
            body.classList.add('menu-active');
            mobileMenuToggle.classList.add('active');
        } else {
            // Force hide
            navMenu.classList.remove('active');
            body.classList.remove('menu-active');
            mobileMenuToggle.classList.remove('active');
        }
    }
}

/**
 * Smooth Scrolling Navigation
 * Handles smooth scrolling to different sections
 */
function setupSmoothScrolling() {
    // Navigation links smooth scroll
    const navLinks = document.querySelectorAll('.nav-menu a, .scroll-down, .top-btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            let targetSection;
            
            if (this.classList.contains('top-btn')) {
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            } else if (this.classList.contains('scroll-down')) {
                // Scroll to about section
                targetSection = document.querySelector('.about-section');
            } else {
                // Handle navigation links
                const targetId = this.getAttribute('href');
                
                switch(targetId) {
                    case '#about':
                        targetSection = document.querySelector('.about-section');
                        break;
                    case '#modules':
                    case '#services':
                        targetSection = document.querySelector('.services-spotlight');
                        break;
                    case '#resources':
                        targetSection = document.querySelector('.resources-section');
                        break;
                    case '#testimonials':
                        targetSection = document.querySelector('.testimonials');
                        break;
                    case '#contact':
                        targetSection = document.querySelector('.footer-section');
                        break;
                    default:
                        targetSection = document.querySelector(targetId);
                }
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Logo Click Navigation
 * Makes the logo clickable to scroll to top
 */
function setupLogoNavigation() {
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        logo.style.cursor = 'pointer';
    }
}

function initPackageSelection() {
    const packageBoxes = document.querySelectorAll('.package-box');
    if (packageBoxes.length === 0) return;
    
    console.log("Found package boxes:", packageBoxes.length); // Debug
    
    // Create hidden input for selected package
    const consultationForm = document.querySelector('.consultation-form form');
    
    if (consultationForm) {
        // Check if hidden input already exists
        let hiddenInput = document.getElementById('selected-package');
        
        if (!hiddenInput) {
            console.log("Creating hidden input field"); // Debug
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'selected-package';
            hiddenInput.name = 'selected-package';
            hiddenInput.value = '';
            consultationForm.appendChild(hiddenInput);
        }
        
        // Add click listeners to all package boxes
        packageBoxes.forEach((box, index) => {
            console.log("Setting up click handler for box", index); // Debug
            
            box.addEventListener('click', () => {
                console.log("Package box clicked:", index); // Debug
                
                // Remove selected class from all boxes
                packageBoxes.forEach(b => b.classList.remove('selected'));
                
                // Add selected class to clicked box
                box.classList.add('selected');
                
                // Store the selected package value in hidden input
                const packageNumber = box.querySelector('.package-number')?.textContent || '';
                const packageName = box.querySelector('.package-name')?.textContent || '';
                hiddenInput.value = packageNumber + ': ' + packageName;
                
                console.log("Selected package:", hiddenInput.value); // Debug
            });
        });
    }
}

/**
 * Form Validation System
 * Comprehensive validation for all forms
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    if (forms.length === 0) return;
    
    forms.forEach(form => {
        // Remove any previous event listeners (prevents duplicate submissions)
        // const newForm = form.cloneNode(true);
        // form.parentNode.replaceChild(newForm, form);
        // form = newForm;
        
        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if form is valid
            if (validateForm(this)) {
                // Show success message
                showFormMessage(this, 'success', 'Thank you for your submission! We will be in touch shortly.');
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    
                    // Reset hidden fields if they exist
                    const selectedPackage = document.getElementById('selected-package');
                    if (selectedPackage) selectedPackage.value = '';
                    
                    // Remove selected class from package boxes
                    const packageBoxes = document.querySelectorAll('.package-box');
                    packageBoxes.forEach(box => box.classList.remove('selected'));
                    
                    // Remove any success/error messages
                    const messageEl = this.querySelector('.form-message');
                    if (messageEl) {
                        messageEl.remove();
                    }
                }, 3000);
            }
        });
        
        // Real-time validation on blur and input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Validate on blur (when user leaves field)
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            // Clear error when user starts typing in a field with an error
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });
}

/**
 * Validate Form
 * Validates all inputs in a form and handles special cases
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isFormValid = false;
        }
    });
    
    // Additional validations for consultation form
    if (form.closest('.consultation-form')) {
        // Check that at least one service is selected
        const serviceCheckboxes = form.querySelectorAll('input[type="checkbox"]');
        const isAnyChecked = Array.from(serviceCheckboxes).some(checkbox => checkbox.checked);
        
        if (!isAnyChecked) {
            const servicesSection = form.querySelector('.services-section');
            if (servicesSection) {
                const existingError = servicesSection.querySelector('.error-message');
                if (!existingError) {
                    const errorEl = document.createElement('div');
                    errorEl.className = 'error-message';
                    errorEl.textContent = 'Please select at least one service';
                    errorEl.style.color = '#ff4545';
                    errorEl.style.fontSize = '12px';
                    errorEl.style.marginTop = '5px';
                    servicesSection.appendChild(errorEl);
                }
            }
            isFormValid = false;
        } else {
            const existingError = form.querySelector('.services-section .error-message');
            if (existingError) {
                existingError.remove();
            }
        }
        
        // Check that a package is selected
        const selectedPackageInput = document.getElementById('selected-package');
        if (selectedPackageInput && !selectedPackageInput.value) {
            const packageSection = form.querySelector('.package-title');
            if (packageSection) {
                const parentElement = packageSection.parentElement;
                const packageBoxes = form.querySelector('.package-boxes');
                if (packageBoxes) {
                    const existingError = parentElement.querySelector('.error-message');
                    if (!existingError) {
                        const errorEl = document.createElement('div');
                        errorEl.className = 'error-message';
                        errorEl.textContent = 'Please select a package';
                        errorEl.style.color = '#ff4545';
                        errorEl.style.fontSize = '12px';
                        errorEl.style.marginTop = '5px';
                        packageBoxes.after(errorEl);
                    }
                }
            }
            isFormValid = false;
        } else {
            const existingError = form.querySelector('.package-boxes + .error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    }
    
    return isFormValid;
}

/**
 * Validate Input
 * Validates a single input field
 */
function validateInput(input) {
    // Return true if the input is valid, false otherwise
    let isValid = true;
    const value = input.value.trim();
    
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Remove error class
    input.classList.remove('error');
    
    // Skip validation for non-required empty fields
    if (!input.hasAttribute('required') && value === '') {
        return true;
    }
    
    // Check required fields
    if (input.hasAttribute('required') && value === '') {
        showInputError(input, 'This field is required');
        isValid = false;
    } 
    // Check email format
    else if (input.type === 'email' && value !== '') {
        // More comprehensive email regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegex.test(value)) {
            showInputError(input, 'Please enter a valid email address');
            isValid = false;
        }
    }
    // Check phone format
    else if (input.type === 'tel' && value !== '') {
        // Simple validation - at least 10 digits
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
            showInputError(input, 'Please enter a valid phone number with at least 10 digits');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Show Input Error
 * Displays an error message for an invalid input
 */
function showInputError(input, message) {
    // Add error class to the input
    input.classList.add('error');
    
    // Style the input to indicate error
    input.style.borderColor = '#ff4545';
    
    // Create error message element
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.color = '#ff4545';
    errorEl.style.fontSize = '12px';
    errorEl.style.marginTop = '5px';
    errorEl.style.marginBottom = '10px';
    
    // Insert after the input
    input.parentElement.insertBefore(errorEl, input.nextSibling);
    
    // Add focus event to clear error styling when user focuses on the input
    input.addEventListener('focus', function onFocus() {
        this.style.borderColor = '#ff9bb3';
        // Only run this handler once
        this.removeEventListener('focus', onFocus);
    }, { once: true });
}

/**
 * Show Form Message
 * Displays a success or error message for the entire form
 */
function showFormMessage(form, type, message) {
    // Remove any existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}-message`;
    messageEl.textContent = message;
    
    // Style the message
    messageEl.style.padding = '15px';
    messageEl.style.marginTop = '20px';
    messageEl.style.borderRadius = '4px';
    messageEl.style.textAlign = 'center';
    messageEl.style.fontWeight = '500';
    
    if (type === 'success') {
        messageEl.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        messageEl.style.color = '#28a745';
        messageEl.style.border = '1px solid rgba(40, 167, 69, 0.2)';
    } else {
        messageEl.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
        messageEl.style.color = '#dc3545';
        messageEl.style.border = '1px solid rgba(220, 53, 69, 0.2)';
    }
    
    // Add to form
    form.appendChild(messageEl);
    
    // Scroll to the message with smooth behavior
    setTimeout(() => {
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Form Scroll Behavior
 * Improves scrolling within form containers
 */
function setupFormScroll() {
    const consultationForm = document.querySelector('.consultation-form');
    
    if (consultationForm) {
        // Prevent wheel events from propagating when cursor is over the form
        consultationForm.addEventListener('wheel', function(e) {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const height = this.clientHeight;
            
            // Check if we're at the boundaries
            if ((scrollTop === 0 && e.deltaY < 0) || 
                (scrollTop + height >= scrollHeight && e.deltaY > 0)) {
                return;
            }
            
            // Handle the scroll within the form
            e.preventDefault();
            e.stopPropagation();
            this.scrollTop += e.deltaY;
        });
    }
}

/**
 * SVG Color Update
 * Updates SVG colors to match the site's color scheme
 */
function updateSvgColors() {
    try {
        // Update the service icons
        const serviceIcons = document.querySelectorAll('.service-card svg');
        serviceIcons.forEach(svg => {
            svg.setAttribute('stroke', '#ff9bb3');
        });
        
        // Update the quote icons
        const quoteIcons = document.querySelectorAll('.quote-icon svg');
        quoteIcons.forEach(svg => {
            svg.setAttribute('stroke', '#ff9bb3');
        });
    } catch (error) {
        console.error("Error updating SVG colors:", error);
    }
}

/**
 * Initial Animations
 * Handles entrance animations for header and hero sections
 */
function initAnimations() {
    try {
        // Header Animation
        const header = document.querySelector('header');
        const logo = document.querySelector('.logo');
        const navLinks = document.querySelectorAll('.nav-menu li');
        
        if (logo) {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(-20px)';
        }
        
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(-20px)';
        });
        
        // Trigger header animations after a short delay
        setTimeout(() => {
            if (header) header.classList.add('animate-header');
            
            if (logo) {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
                logo.style.transition = 'all 0.6s ease';
            }
            
            navLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                    link.style.transition = 'all 0.4s ease';
                }, 100 * (index + 1));
            });
        }, 300);
        
        // Hero Section Animation
        const heroContent = document.querySelector('.hero-content');
        const heroForm = document.querySelector('.consultation-form');
        
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateX(-50px)';
        }
        
        if (heroForm) {
            heroForm.style.opacity = '0';
            heroForm.style.transform = 'translateX(50px)';
        }
        
        // Trigger hero animations after header is animated
        setTimeout(() => {
            if (heroContent) {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateX(0)';
                heroContent.style.transition = 'all 0.8s ease';
            }
            
            if (heroForm) {
                heroForm.style.opacity = '1';
                heroForm.style.transform = 'translateX(0)';
                heroForm.style.transition = 'all 0.8s ease';
            }
        }, 800);
    } catch (error) {
        console.error("Error initializing animations:", error);
        
        // Fallback - make everything visible
        document.querySelectorAll('.logo, .nav-menu li, .hero-content, .consultation-form').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
}

/**
 * Intersection Observers
 * Handles scroll-based animations throughout the page
 */
function initIntersectionObservers() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.warn("IntersectionObserver not supported. Using fallback.");
        // Simple fallback - just show all elements
        document.querySelectorAll('.newsletter-container, .about-section, .feature-title-box, .feature-card, .section-header, .service-card, .testimonial-card, .resources-header, .resource-card, .footer-top')
            .forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        return;
    }
    
    // Set up observers for each section
    observeSection('.newsletter-container', {threshold: 0.1});
    observeSection('.about-section', {threshold: 0.1, rootMargin: "-150px 0px"});
    observeEnrollSection();
    observeServicesSection();
    observeSection('.testimonials .section-header, .testimonial-card', {threshold: 0.1});
    observeResourcesSection();
    observeSection('.footer-top', {threshold: 0.1, rootMargin: "-100px 0px"});
}

/**
 * Observe Section
 * Generic function to observe and animate a section
 */
function observeSection(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: "-100px 0px"
    };
    
    const observerOptions = {...defaultOptions, ...options};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(element => {
        // Prepare the element for animation if it isn't already
        if (getComputedStyle(element).opacity !== '0') {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        observer.observe(element);
    });
}

/**
 * Observe Enroll Section
 * Special handling for the feature grid section
 */
function observeEnrollSection() {
    const enrollSection = document.querySelector('.enroll-section');
    if (!enrollSection) return;
    
    const titleBox = enrollSection.querySelector('.feature-title-box');
    const featureCards = enrollSection.querySelectorAll('.feature-card');
    
    // Prepare elements for animation
    if (titleBox) {
        titleBox.style.opacity = '0';
        titleBox.style.transform = 'translateY(30px)';
        titleBox.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate title
            if (titleBox) {
                titleBox.style.opacity = '1';
                titleBox.style.transform = 'translateY(0)';
            }
            
            // Animate cards with delay
            featureCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 200 * (index + 1));
            });
            
            // Stop observing
            observer.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2,
        rootMargin: "-100px 0px"
    });
    
    // Start observing
    observer.observe(enrollSection);
}

/**
 * Observe Services Section
 * Special handling for services cards with staggered animation
 */
function observeServicesSection() {
    const servicesSection = document.querySelector('.services-spotlight');
    if (!servicesSection) return;
    
    const sectionHeader = servicesSection.querySelector('.section-header');
    const serviceCards = servicesSection.querySelectorAll('.service-card');
    
    // Prepare elements for animation
    if (sectionHeader) {
        sectionHeader.style.opacity = '0';
        sectionHeader.style.transform = 'translateY(30px)';
        sectionHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate header first
            if (sectionHeader) {
                sectionHeader.style.opacity = '1';
                sectionHeader.style.transform = 'translateY(0)';
            }
            
            // Staggered animation for service cards
            serviceCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 300 + (200 * index));
            });
            
            // Stop observing
            observer.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2,
        rootMargin: "-150px 0px"
    });
    
    // Start observing
    observer.observe(servicesSection);
}

/**
 * Observe Resources Section
 * Special handling for resource cards with staggered animation
 */
function observeResourcesSection() {
    const resourcesSection = document.querySelector('.resources-section');
    if (!resourcesSection) return;
    
    const resourcesHeader = resourcesSection.querySelector('.resources-header');
    const resourceCards = resourcesSection.querySelectorAll('.resource-card');
    
    // Prepare elements for animation
    if (resourcesHeader) {
        resourcesHeader.style.opacity = '0';
        resourcesHeader.style.transform = 'translateY(30px)';
        resourcesHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
    
    resourceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate header first
            if (resourcesHeader) {
                resourcesHeader.style.opacity = '1';
                resourcesHeader.style.transform = 'translateY(0)';
            }
            
            // Staggered animation for resource cards
            resourceCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 300 + (200 * index));
            });
            
            // Stop observing
            observer.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2,
        rootMargin: "-150px 0px"
    });
    
    // Start observing
    observer.observe(resourcesSection);
}

/**
 * Testimonial Slider
 * Interactive slider for testimonials with navigation
 */
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length === 0) return;
    
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    
    // Display only the first testimonial initially
    testimonialCards.forEach((card, index) => {
        if (index !== 0) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
    
    // Active first indicator
    if (indicators.length > 0) {
        indicators[0].classList.add('active');
    }
    
    // Update active testimonial and indicator
    function updateActiveTestimonial(index) {
        if (index < 0 || index >= testimonialCards.length) return;
        
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        // Remove active class from all indicators
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Show current testimonial with animation
        testimonialCards[index].style.display = 'block';
        setTimeout(() => {
            testimonialCards[index].style.opacity = '1';
            testimonialCards[index].style.transform = 'translateY(0)';
        }, 50);
        
        // Update indicator
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }
    
    // Next testimonial
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonialCards.length;
        updateActiveTestimonial(currentIndex);
    }
    
    // Previous testimonial
    function prevTestimonial() {
        currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
        updateActiveTestimonial(currentIndex);
    }
    
    // Add event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateActiveTestimonial(currentIndex);
        });
    });
    
    // Auto-rotate testimonials every 5 seconds
    let testimonialInterval = setInterval(nextTestimonial, 5000);
    
    // Pause auto-rotation on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        });
    }
}

/**
 * Service Card Effects
 * Adds hover effects to service cards
 */
function setupServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('service-ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        });
    });
}

/**
 * Parallax Background Effect
 * Creates a subtle parallax scrolling effect for the background
 */
function initParallaxEffect() {
    const backgroundImage = document.querySelector('.background-image');
    if (!backgroundImage) return;
    
    // Use requestAnimationFrame for smoother parallax
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        backgroundImage.style.transform = `translateY(-${lastScrollY * 0.05}px)`;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Initial position
    updateParallax();
}

/**
 * Resource Cards System
 * Handles interactions with resource cards including likes and view tracking
 */
function initResourceCards() {
    const resourceCards = document.querySelectorAll('.resource-card');
    if (resourceCards.length === 0) return;
    
    resourceCards.forEach((card, index) => {
        // Make entire card clickable
        card.addEventListener('click', function(event) {
            // Only navigate if the click wasn't on a button or specific interactive element
            if (!event.target.closest('.like-button') && 
                !event.target.closest('.resource-date')) {
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            }
        });
        
        // Set up like button functionality
        setupLikeButton(card);
        
        // Set up view counter
        setupViewCounter(card);
        
        // Set up date interaction
        setupDateInteraction(card);
    });
}

/**
 * Setup Like Button
 * Handles like button interactions for resource cards
 */
function setupLikeButton(card) {
    const button = card.querySelector('.like-button');
    if (!button) return;
    
    const countElement = button.querySelector('.count');
    if (!countElement) return;
    
    // Initialize like count
    let count = parseInt(button.getAttribute('data-count') || '0');
    countElement.textContent = count;
    
    // Get resource identifier for storage
    const resourceId = card.getAttribute('data-url') || `resource-${Math.random().toString(36).substr(2, 9)}`;
    const storageKey = `liked_${resourceId}`;
    
    // Check if previously liked
    if (localStorage.getItem(storageKey) === 'true') {
        button.classList.add('liked');
    }
    
    // Handle like button click
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.classList.contains('liked')) {
            // Unlike
            this.classList.remove('liked');
            count = Math.max(0, count - 1);
            localStorage.removeItem(storageKey);
        } else {
            // Like
            this.classList.add('liked');
            count++;
            localStorage.setItem(storageKey, 'true');
        }
        
        // Update count
        countElement.textContent = count;
        this.setAttribute('data-count', count);
    });
}

/**
 * Setup View Counter
 * Tracks views for resource cards
 */
function setupViewCounter(card) {
    const viewsElement = card.querySelector('.views');
    if (!viewsElement) return;
    
    const countElement = viewsElement.querySelector('.count');
    if (!countElement) return;
    
    // Initialize view count
    let count = parseInt(viewsElement.getAttribute('data-count') || '0');
    countElement.textContent = count;
    
    // Get resource identifier for storage
    const resourceId = card.getAttribute('data-url') || `resource-${Math.random().toString(36).substr(2, 9)}`;
    const viewStorageKey = `viewed_${resourceId}`;
    
    // View count handler
    card.addEventListener('click', function(e) {
        // Only count view if not clicking on specific elements
        if (e.target.closest('.like-button') || e.target.closest('.resource-date')) {
            return;
        }
        
        // Only count view once per session
        if (!sessionStorage.getItem(viewStorageKey)) {
            count++;
            countElement.textContent = count;
            viewsElement.setAttribute('data-count', count);
            sessionStorage.setItem(viewStorageKey, 'true');
        }
    });
}

/**
 * Setup Date Interaction
 * Handles date interactions for resource cards
 */
function setupDateInteraction(card) {
    const dateElement = card.querySelector('.resource-date');
    if (!dateElement) return;
    
    // Ensure styling
    dateElement.style.cursor = 'pointer';
    dateElement.style.transition = 'color 0.3s ease';
    
    // Hover effects
    dateElement.addEventListener('mouseenter', function() {
        this.style.color = '#ff9bb3';
    });
    
    dateElement.addEventListener('mouseleave', function() {
        this.style.color = '#666';
    });
    
    // Get date value
    const dateValue = dateElement.getAttribute('data-date');
    if (!dateValue) return;
    
    // Format the displayed date
    try {
        const displayDate = new Date(dateValue);
        if (!isNaN(displayDate.getTime())) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            let readTime = '1 min read';
            
            // Preserve read time if it exists
            const currentText = dateElement.textContent;
            if (currentText && currentText.includes('•')) {
                readTime = currentText.split('•')[1].trim();
            }
            
            dateElement.textContent = `${displayDate.toLocaleDateString('en-US', options)} • ${readTime}`;
        }
    } catch (e) {
        console.error('Error formatting date:', e);
    }
    
    // Click handler for date popup
    dateElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const date = new Date(dateValue);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }
            
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            alert(`Published: ${formattedDate}\n${diffDays} days ago`);
        } catch (e) {
            console.error('Error processing date:', e);
            alert("Sorry, there was an error processing the date.");
        }
    });
}

// Emergency fix for About section visibility
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      // Force About section elements to be visible
      var aboutElements = document.querySelectorAll('.about-text, .about-content');
      aboutElements.forEach(function(elem) {
        elem.style.opacity = '1';
        elem.style.transform = 'translateY(0)';
      });
      
      // Make sure the entire section is visible
      var aboutSection = document.querySelector('.about-section');
      if (aboutSection) {
        aboutSection.classList.add('section-visible');
      }
    }, 500);
  });



 /**
 * Form Submission Handler
 * Handles AJAX submissions for consultation and newsletter forms
 */
 function initFormSubmissions() {
    // Get consultation form
    const consultationForm = document.getElementById('consultation-form');
    
    // Track submission state
    let isSubmitting = false;
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Prevent multiple submissions
            if (isSubmitting) {
                console.log('Form is already being submitted');
                return;
            }
            
            // Validate form before submission
            if (validateForm(this)) {
                isSubmitting = true;
                const submitBtn = this.querySelector('.submit-btn');
                const originalBtnText = submitBtn.textContent;
                
                // Change button text to indicate loading
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                try {
                    // Collect form data
                    const formData = new FormData(this);
                    const formDataObject = {};
                    
                    // Convert FormData to an object for EmailJS
                    formData.forEach((value, key) => {
                        // Handle checkboxes (services) which might have multiple values
                        if (key === 'service[]') {
                            if (!formDataObject['services']) {
                                formDataObject['services'] = [];
                            }
                            formDataObject['services'].push(value);
                        } else {
                            formDataObject[key] = value;
                        }
                    });
                    
                    // If services were selected, convert them to a string
                    if (formDataObject['services']) {
                        formDataObject['services'] = formDataObject['services'].join(', ');
                    }
                    
                    console.log('Sending data via EmailJS:', formDataObject);
                    
                    // Send email using EmailJS
                    const response = await emailjs.send(
                        'service_35quybr',         // Replace with your EmailJS service ID
                        'template_eqy3q5a',        // Replace with your EmailJS template ID
                        formDataObject
                    );
                    
                    console.log('EmailJS response:', response);
                    
                    if (response.status === 200) {
                        // Show success message
                        showFormMessage(this, 'success', 'Thank you for your submission! We will be in touch shortly.');
                        
                        // Reset form after 3 seconds
                        setTimeout(() => {
                            this.reset();
                            
                            // Reset hidden fields if they exist
                            const selectedPackage = document.getElementById('selected-package');
                            if (selectedPackage) selectedPackage.value = '';
                            
                            // Remove selected class from package boxes
                            const packageBoxes = document.querySelectorAll('.package-box');
                            packageBoxes.forEach(box => box.classList.remove('selected'));
                            
                            // Remove any success/error messages
                            const messageEl = this.querySelector('.form-message');
                            if (messageEl) {
                                messageEl.remove();
                            }
                            
                            // Restore button text
                            submitBtn.textContent = originalBtnText;
                            submitBtn.disabled = false;
                            isSubmitting = false; // Reset submission state
                        }, 3000);
                    } else {
                        throw new Error('Email failed to send');
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    
                    // Show error message
                    showFormMessage(this, 'error', 'There was an error sending your message. Please check your connection or try again later.');
                    
                    // Restore button text
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    isSubmitting = false; // Reset submission state
                }
            }
        });
    }
    
    // Newsletter form can use the same approach if needed
    const newsletterForm = document.getElementById('mc-embedded-subscribe-form');
    
    if (newsletterForm) {
        // Just in case Mailchimp fails, you could add EmailJS as a backup here too
        newsletterForm.addEventListener('submit', function(e) {
            // No need to prevent default since Mailchimp integration should work
            const email = this.querySelector('#mce-EMAIL')?.value;
            
            if (email) {
                // You could add a similar EmailJS call here if needed
                console.log('Newsletter submitted with email:', email);
            }
        });
    }
}

// Add this function call to your document ready function
document.addEventListener("DOMContentLoaded", function() {
    // ... your existing initialization code ...
    
    // Initialize form submissions
    initFormSubmissions();
});