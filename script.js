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