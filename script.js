// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-active');
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        header.style.background = 'transparent';
    }
});

// Package Selection
const packageBoxes = document.querySelectorAll('.package-box');
packageBoxes.forEach(box => {
    box.addEventListener('click', () => {
        // Remove selected class from all boxes
        packageBoxes.forEach(b => b.classList.remove('selected'));
        // Add selected class to clicked box
        box.classList.add('selected');
    });
});

// Animation code for existing sections
document.addEventListener("DOMContentLoaded", function() {
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
    
    // Hero Section Animation
    const heroContent = document.querySelector('.hero-content');
    const heroForm = document.querySelector('.consultation-form');
    
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-50px)';
    
    heroForm.style.opacity = '0';
    heroForm.style.transform = 'translateX(50px)';
    
    // Trigger hero animations after header is animated
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
        heroContent.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            heroForm.style.opacity = '1';
            heroForm.style.transform = 'translateX(0)';
            heroForm.style.transition = 'all 0.8s ease';
        }, 200);
    }, 800);
    
    // Newsletter Section Animation with Intersection Observer
    const newsletterSection = document.querySelector('.newsletter');
    
    const observerNewsletter = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const newsletterContainer = entry.target.querySelector('.newsletter-container');
                
                if (newsletterContainer) {
                    newsletterContainer.style.opacity = '1';
                    newsletterContainer.style.transform = 'translateY(0)';
                }
                
                observerNewsletter.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    if (newsletterSection) {
        const newsletterContainer = newsletterSection.querySelector('.newsletter-container');
        if (newsletterContainer) {
            newsletterContainer.style.opacity = '0';
            newsletterContainer.style.transform = 'translateY(30px)';
            newsletterContainer.style.transition = 'all 0.8s ease';
        }
        observerNewsletter.observe(newsletterSection);
    }
    
    // Remove the CSS animations that are causing the conflict
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
            rootMargin: "-50px 0px"
        });
        
        // Start observing
        enrollObserver.observe(enrollSection);
    }
});

// Add this to your existing script.js file

document.addEventListener("DOMContentLoaded", function() {
    // Testimonial Slider Functionality
    initTestimonialSlider();
    
    // Services Animation with Intersection Observer
    initServicesAnimation();
});

// Testimonial Slider
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

// Services Animation with Intersection Observer
function initServicesAnimation() {
    const servicesSection = document.querySelector('.services-spotlight');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (servicesSection && serviceCards.length > 0) {
        const servicesObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Staggered animation for service cards
                serviceCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 200 * index);
                });
                
                // Once animated, disconnect observer
                servicesObserver.disconnect();
            }
        }, {
            threshold: 0.2,
            rootMargin: "-50px 0px"
        });
        
        servicesObserver.observe(servicesSection);
    }
}

// Service Card Hover Effects (enhanced interactions)
document.addEventListener('DOMContentLoaded', function() {
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
});

// Scroll Animation for All Sections
document.addEventListener('DOMContentLoaded', function() {
    // All sections that should be animated on scroll
    const animatedSections = document.querySelectorAll('.testimonials, .services-spotlight');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                
                // Find header elements to animate
                const header = entry.target.querySelector('.section-header');
                if (header) {
                    header.style.opacity = '1';
                    header.style.transform = 'translateY(0)';
                }
                
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "-50px 0px"
    });
    
    // Prepare sections for animation
    animatedSections.forEach(section => {
        // Style section header for animation
        const header = section.querySelector('.section-header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(30px)';
            header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });
});



// About Section Animation with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for background image
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const backgroundImage = document.querySelector('.background-image');
        
        if (backgroundImage) {
            // Move the background image slightly to the right when scrolling
            backgroundImage.style.transform = `translateY(-${scrollPosition * 0.05}px)`;
        }
    });
    
    // Animation for about section
    const aboutSection = document.querySelector('.about-section');
    
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: "-50px 0px"
        });
        
        aboutObserver.observe(aboutSection);
    }
});

// RESOURCES DOES STARTS HERE

document.addEventListener("DOMContentLoaded", function() {
    // Resources Section Animation with Intersection Observer
    initResourcesAnimation();
});

// Resources Animation with Intersection Observer
function initResourcesAnimation() {
    const resourcesSection = document.querySelector('.resources-section');
    const resourceCards = document.querySelectorAll('.resource-card');
    
    if (resourcesSection) {
        const resourcesObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Animate header
                resourcesSection.classList.add('section-visible');
                
                // Staggered animation for resource cards
                resourceCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    }, 200 * index);
                });
                
                // Once animated, disconnect observer
                resourcesObserver.disconnect();
            }
        }, {
            threshold: 0.2,
            rootMargin: "-50px 0px"
        });
        
        resourcesObserver.observe(resourcesSection);
    }
}


// FOOTER JS
document.addEventListener("DOMContentLoaded", function() {
    // Footer Animation with Intersection Observer
    initFooterAnimation();
    
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
});

// Footer Animation with Intersection Observer
document.addEventListener("DOMContentLoaded", function() {
    // Footer Animation with Intersection Observer
    initFooterAnimation();
    
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
});

// Footer Animation with Intersection Observer
function initFooterAnimation() {
    const footerSection = document.querySelector('.footer-section');
    
    if (footerSection) {
        const footerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Add visible class to trigger animations
                footerSection.classList.add('section-visible');
                
                // Once animated, disconnect observer
                footerObserver.disconnect();
            }
        }, {
            threshold: 0.2,
            rootMargin: "-50px 0px"
        });
        
        footerObserver.observe(footerSection);
    }
}