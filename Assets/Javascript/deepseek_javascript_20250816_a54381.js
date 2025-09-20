// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Testimonial slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const slideIndex = dot.getAttribute('data-slide');
        
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        dots.forEach(d => {
            d.classList.remove('active');
        });
        
        testimonials[slideIndex].classList.add('active');
        dot.classList.add('active');
    });
});

// Auto-advance testimonials
let currentTestimonial = 0;
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    testimonials[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}, 5000);

// Rest of your JavaScript would go here

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});