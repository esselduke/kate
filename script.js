// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'transparent';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Initialize all functionality
    initPackageSelection();
    setupNavigation();
    initAnimations();
    initIntersectionObservers();
    initTestimonialSlider();
    setupFormScroll();
    setupServiceCardEffects();
});

// Package Selection
function initPackageSelection() {
    const packageBoxes = document.querySelectorAll('.package-box');
    packageBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Remove selected class from all boxes
            packageBoxes.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked box
            box.classList.add('selected');
        });
    });
}

// Setup Navigation and Scroll Functionality
function setupNavigation() {
    // Scroll down arrow functionality
    const scrollDownArrow = document.querySelector('.scroll-down');
    const aboutSection = document.querySelector('.about-section');
    
    if (scrollDownArrow && aboutSection) {
        scrollDownArrow.addEventListener('click', function() {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Logo click functionality - scroll to top
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add cursor pointer to indicate it's clickable
        logo.style.cursor = 'pointer';
    }
    
    // Set index variables for menu items (for staggered animations)
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
    
    // Navigation links functionality
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Handle specific section navigation
            if (targetId === '#about') {
                e.preventDefault();
                document.querySelector('.about-section').scrollIntoView({ behavior: 'smooth' });
            } 
            else if (targetId === '#modules' || targetId === '#services') {
                e.preventDefault();
                document.querySelector('.services-spotlight').scrollIntoView({ behavior: 'smooth' });
            }
            else if (targetId === '#resources') {
                e.preventDefault();
                document.querySelector('.resources-section').scrollIntoView({ behavior: 'smooth' });
            }
            else if (targetId === '#testimonials') {
                e.preventDefault();
                document.querySelector('.testimonials').scrollIntoView({ behavior: 'smooth' });
            }
            else if (targetId === '#contact') {
                e.preventDefault();
                document.querySelector('.footer-section').scrollIntoView({ behavior: 'smooth' });
            }
            
            // Close mobile menu if it's open
            if (navMenu.classList.contains('active')) {
                // Hamburger icon transforms immediately
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
                
                // Menu closes with animation
                navMenu.classList.remove('active');
                body.classList.remove('menu-active');
            }
        });
    });
    
    // Update mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle) {
        // Remove existing event listeners (if possible)
        const oldToggle = mobileMenuToggle.cloneNode(true);
        mobileMenuToggle.parentNode.replaceChild(oldToggle, mobileMenuToggle);
        
        // Add new event listener
        oldToggle.addEventListener('click', function() {
            // Toggle menu with animations from CSS
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-active');
            this.classList.toggle('active');
        });
    }
    
    // Add Testimonials link to the nav menu if it doesn't exist
    const navMenuElement = document.querySelector('.nav-menu');
    if (navMenuElement) {
        // Check if testimonials link already exists
        let testimonialsLinkExists = false;
        const navItems = navMenuElement.querySelectorAll('li a');
        navItems.forEach(item => {
            if (item.getAttribute('href') === '#testimonials') {
                testimonialsLinkExists = true;
            }
        });
        
        // If testimonials link doesn't exist, add it before the Contact link
        if (!testimonialsLinkExists) {
            const newTestimonialsItem = document.createElement('li');
            const newTestimonialsLink = document.createElement('a');
            newTestimonialsLink.setAttribute('href', '#testimonials');
            newTestimonialsLink.textContent = 'Testimonials';
            
            newTestimonialsItem.appendChild(newTestimonialsLink);
            
            // Find the contact link (last item) and insert before it
            const contactItem = navMenuElement.querySelector('li:last-child');
            if (contactItem) {
                navMenuElement.insertBefore(newTestimonialsItem, contactItem);
                
                // Set the index for animation
                const menuItems = navMenuElement.querySelectorAll('li');
                menuItems.forEach((item, index) => {
                    item.style.setProperty('--index', index);
                });
                
                // Add the event listener to the new testimonials link
                newTestimonialsLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector('.testimonials').scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if it's open
                    if (navMenu.classList.contains('active')) {
                        if (mobileMenu) {
                            mobileMenu.classList.remove('active');
                        }
                        navMenu.classList.remove('active');
                        body.classList.remove('menu-active');
                    }
                });
            }
        }
    }
    
    // Back to top button functionality
    const topBtn = document.querySelector('.top-btn');
    if (topBtn) {
        topBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Handle Initial Animations (Header and Hero)
function initAnimations() {
    // Header Animation
    const header = document.querySelector('header');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-menu li');
    
    // Animate logo and nav links with staggered delay
    logo.style.opacity = '0';
    logo.style.transform = 'translateY(-20px)';
    
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
    });
    
    // Trigger header animations after a short delay
    setTimeout(() => {
        header.classList.add('animate-header');
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
        logo.style.transition = 'all 0.6s ease';
        
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
                link.style.transition = 'all 0.4s ease';
            }, 100 * (index + 1));
        });
    }, 300);
    
    // Hero Section Animation - Fixed timing so both elements appear together
    const heroContent = document.querySelector('.hero-content');
    const heroForm = document.querySelector('.consultation-form');
    
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-50px)';
    
    heroForm.style.opacity = '0';
    heroForm.style.transform = 'translateX(50px)';
    
    // Trigger hero animations after header is animated - both elements at same time
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
        heroContent.style.transition = 'all 0.8s ease';
        
        // Start form animation at the same time
        heroForm.style.opacity = '1';
        heroForm.style.transform = 'translateX(0)';
        heroForm.style.transition = 'all 0.8s ease';
    }, 800);
}

// Initialize All Intersection Observers
function initIntersectionObservers() {
    // Main observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "-100px 0px"  // Adjust this to trigger animations earlier
    };
    
    // Newsletter Section Animation
    observeElement('.newsletter', '.newsletter-container', observerOptions);
    
    // About Section Animation
    observeElement('.about-section', '.about-section', { threshold: 0.1, rootMargin: "-150px 0px" });
    
    // Enroll Section (Why Work With Me)
    observeEnrollSection();
    
    // Services Section Animation
    observeServicesSection();
    
    // Testimonials Section
    observeElement('.testimonials', '.testimonials', observerOptions);
    
    // Resources Section
    observeResourcesSection();
    
    // Footer Section
    observeElement('.footer-section', '.footer-section', { threshold: 0.1, rootMargin: "-100px 0px" });
}

// Generic section observer
function observeElement(sectionSelector, targetSelector, options) {
    const section = document.querySelector(sectionSelector);
    
    if (section) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        const target = document.querySelector(targetSelector);
        if (target) {
            observer.observe(target);
        }
    }
}

// Enroll Section specific observer
function observeEnrollSection() {
    const enrollSection = document.querySelector('.enroll-section');
    if (enrollSection) {
        const titleBox = enrollSection.querySelector('.feature-title-box');
        const featureCards = enrollSection.querySelectorAll('.feature-card');
        
        // Remove CSS animations that auto-trigger
        if (titleBox) {
            titleBox.style.animation = 'none';
            titleBox.style.opacity = '0';
            titleBox.style.transform = 'translateY(30px)';
            titleBox.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        featureCards.forEach((card, index) => {
            card.style.animation = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Create intersection observer for scrolling
        const enrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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
                    enrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: "-100px 0px" // Adjust to trigger earlier
        });
        
        // Start observing
        enrollObserver.observe(enrollSection);
    }
}

// Services Section specific observer
function observeServicesSection() {
    const servicesSection = document.querySelector('.services-spotlight');
    if (servicesSection) {
        const sectionHeader = servicesSection.querySelector('.section-header');
        const serviceCards = servicesSection.querySelectorAll('.service-card');
        
        // Prepare header for animation
        if (sectionHeader) {
            sectionHeader.style.opacity = '0';
            sectionHeader.style.transform = 'translateY(30px)';
            sectionHeader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        // Prepare cards for animation
        serviceCards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
        
        // Create observer
        const servicesObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Animate header first
                if (sectionHeader) {
                    sectionHeader.style.opacity = '1';
                    sectionHeader.style.transform = 'translateY(0)';
                }
                
                // Then staggered animation for service cards
                serviceCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 300 + (200 * index)); // Start after header animation
                });
                
                // Add visible class to the section
                servicesSection.classList.add('section-visible');
                
                // Once animated, disconnect observer
                servicesObserver.disconnect();
            }
        }, {
            threshold: 0.2,
            rootMargin: "-150px 0px" // Trigger animation earlier
        });
        
        servicesObserver.observe(servicesSection);
    }
}

// Resources Section specific observer
function observeResourcesSection() {
    const resourcesSection = document.querySelector('.resources-section');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    if (resourcesSection) {
        const resourcesHeader = resourcesSection.querySelector('.resources-header');
        
        // Prepare header and cards for animation
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
        
        const resourcesObserver = new IntersectionObserver((entries) => {
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
                    }, 300 + (200 * index)); // Start after header animation
                });
                
                // Add visible class to the section
                resourcesSection.classList.add('section-visible');
                
                // Once animated, disconnect observer
                resourcesObserver.disconnect();
            }
        }, {
            threshold: 0.2,
            rootMargin: "-150px 0px" // Trigger animation earlier
        });
        
        resourcesObserver.observe(resourcesSection);
    }
}

// Testimonial Slider Function
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    
    // Display only the first testimonial initially
    if (testimonialCards.length > 0) {
        testimonialCards.forEach((card, index) => {
            if (index !== 0) {
                card.style.display = 'none';
            }
        });
    }
    
    // Update active testimonial and indicator
    function updateActiveTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.style.display = 'none';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        });
        
        // Remove active class from all indicators
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // Show current testimonial with animation
        if (testimonialCards[index]) {
            testimonialCards[index].style.display = 'block';
            setTimeout(() => {
                testimonialCards[index].style.opacity = '1';
                testimonialCards[index].style.transform = 'translateY(0)';
            }, 50);
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
    
    // Event listeners
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

// Service Card Hover Effects
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

// Scroll Behavior for Consultation Form
function setupFormScroll() {
    const consultationForm = document.querySelector('.consultation-form');
    
    if (consultationForm) {
        // Prevent wheel events from propagating when cursor is over the form
        consultationForm.addEventListener('wheel', function(e) {
            const scrollTop = this.scrollTop;
            const scrollHeight = this.scrollHeight;
            const height = this.clientHeight;
            
            // If we're at the top and trying to scroll up, or
            // at the bottom and trying to scroll down, let the page scroll
            if ((scrollTop === 0 && e.deltaY < 0) || 
                (scrollTop + height >= scrollHeight && e.deltaY > 0)) {
                return;
            }
            
            // Otherwise, prevent the event from propagating to the page
            e.preventDefault();
            e.stopPropagation();
            
            // Handle the scroll within the form
            this.scrollTop += e.deltaY;
        });
    }
}

// Parallax background effect
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const backgroundImage = document.querySelector('.background-image');
    
    if (backgroundImage) {
        // Move the background image slightly when scrolling
        backgroundImage.style.transform = `translateY(-${scrollPosition * 0.05}px)`;
    }
});