// Paste ALL your JavaScript from <script> here 
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

// Modal functionality
const bookingModal = document.getElementById('bookingModal');
const dressModal = document.getElementById('dressModal');
const successModal = document.getElementById('successModal');
const bookNowBtn = document.getElementById('bookNowBtn');
const heroBookBtn = document.getElementById('heroBookBtn');
const closeBookingModal = document.getElementById('closeBookingModal');
const closeDressModal = document.getElementById('closeDressModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const viewDressBtns = document.querySelectorAll('.view-dress-btn');
const bookServiceBtns = document.querySelectorAll('.book-service-btn');
const bookDressBtn = document.querySelector('.book-dress-btn');

// Open booking modal
bookNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bookingModal.style.display = 'flex';
});

heroBookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bookingModal.style.display = 'flex';
});

bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        bookingModal.style.display = 'flex';
        const service = btn.getAttribute('data-service');
        document.getElementById('bookingService').value = service === 'custom' ? 'custom' : service === 'styling' ? 'styling' : 'rental';
    });
});

// Open dress modal and populate with dress data
function setupDressModal(buttons, isReadyToWear = false) {
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Get dress data from button attributes
            const dressName = btn.getAttribute('data-dress');
            const dressPrice = btn.getAttribute('data-price');
            const dressImage = btn.getAttribute('data-image');
            const dressDesc = btn.getAttribute('data-desc');
            const dressSpecs = btn.getAttribute('data-specs');

            // Populate modal with dress data
            document.getElementById('dressModalTitle').textContent = dressName;
            document.getElementById('dressModalPrice').textContent = dressPrice;
            document.getElementById('dressModalImg').src = dressImage;
            document.getElementById('dressModalImg').alt = dressName;
            document.getElementById('dressModalDesc').textContent = dressDesc;

            // Clear existing specs
            const specsList = document.getElementById('dressModalSpecs');
            specsList.innerHTML = '';

            // Add new specs
            const specsArray = dressSpecs.split('|');
            specsArray.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });

            // Change button text for ready-to-wear items
            const modalBookBtn = document.querySelector('.book-dress-btn');
            if (isReadyToWear) {
                modalBookBtn.textContent = 'Get This Look';
            } else {
                modalBookBtn.textContent = 'Book This Dress';
            }

            // Show modal
            dressModal.style.display = 'flex';
        });
    });
}

// Set up modals for both rental and ready-to-wear items
setupDressModal(document.querySelectorAll('.view-dress-btn'));
setupDressModal(document.querySelectorAll('.get-this-look-btn'), true);

// Book dress button in dress modal
bookDressBtn.addEventListener('click', () => {
    dressModal.style.display = 'none';
    bookingModal.style.display = 'flex';

    // Determine if it's a ready-to-wear item
    const isReadyToWear = bookDressBtn.textContent === 'Get This Look';
    document.getElementById('bookingService').value = isReadyToWear ? 'ready-to-wear' : 'rental';
});

// Close modals
closeBookingModal.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

closeDressModal.addEventListener('click', () => {
    dressModal.style.display = 'none';
});

closeSuccessModal.addEventListener('click', () => {
    successModal.style.display = 'none';
});

closeSuccessBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (e.target === dressModal) {
        dressModal.style.display = 'none';
    }
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Booking form steps
const bookingSteps = document.querySelectorAll('.step');
const bookingPages = document.querySelectorAll('.booking-form-page');
const nextStepBtns = document.querySelectorAll('.next-step');
const prevStepBtns = document.querySelectorAll('.prev-step');

nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const nextPage = btn.getAttribute('data-next');
        goToStep(nextPage);
    });
});

prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const prevPage = btn.getAttribute('data-prev');
        goToStep(prevPage);
    });
});

function goToStep(stepNumber) {
    // Update steps
    bookingSteps.forEach(step => {
        if (parseInt(step.getAttribute('data-step')) <= parseInt(stepNumber)) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else {
            step.classList.remove('completed', 'active');
        }

        if (step.getAttribute('data-step') === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update pages
    bookingPages.forEach(page => {
        if (page.getAttribute('data-page') === stepNumber) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // If going to confirmation page, update summary
    if (stepNumber === '3') {
        updateBookingSummary();
    }
}

function updateBookingSummary() {
    const service = document.getElementById('bookingService').value;
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const phone = document.getElementById('bookingPhone').value;
    const date = document.getElementById('bookingDate').value;
    const notes = document.getElementById('bookingNotes').value;

    let serviceText = '';
    switch (service) {
        case 'rental':
            serviceText = 'Dress Rental';
            break;
        case 'custom':
            serviceText = 'Custom-Made Dress';
            break;
        case 'styling':
            serviceText = 'Personal Styling Service';
            break;
        case 'ready-to-wear':
            serviceText = 'Ready to Wear';
            break;
        default:
            serviceText = 'Service';
    }

    const summaryHTML = `
        <p><strong>Service:</strong> ${serviceText}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${date ? `<p><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString()}</p>` : ''}
        ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : ''}
    `;

    document.getElementById('bookingSummary').innerHTML = summaryHTML;
}

// Form submission
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    bookingModal.style.display = 'none';
    successModal.style.display = 'flex';
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('successMessage').textContent = 'Thank you for your message. We will get back to you shortly.';
    successModal.style.display = 'flex';
    e.target.reset();
});

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