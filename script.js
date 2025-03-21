
// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
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
