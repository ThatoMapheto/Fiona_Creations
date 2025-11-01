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

// Image slider functionality
function initImageSliders() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-images img');
        const prevArrow = slider.querySelector('.prev-arrow');
        const nextArrow = slider.querySelector('.next-arrow');
        const dots = slider.querySelectorAll('.slider-dots .dot');

        let currentIndex = 0;

        // Function to show a specific slide
        function showSlide(index) {
            // Hide all images
            images.forEach(img => img.classList.remove('active'));

            // Remove active class from all dots
            dots.forEach(dot => dot.classList.remove('active'));

            // Show the selected image
            images[index].classList.add('active');

            // Activate the corresponding dot
            if (dots[index]) {
                dots[index].classList.add('active');
            }

            currentIndex = index;
        }

        // Next slide
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= images.length) {
                    nextIndex = 0;
                }
                showSlide(nextIndex);
            });
        }

        // Previous slide
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = images.length - 1;
                }
                showSlide(prevIndex);
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Auto-advance slides (optional - uncomment if you want auto-sliding)
        // setInterval(() => {
        //     let nextIndex = currentIndex + 1;
        //     if (nextIndex >= images.length) {
        //         nextIndex = 0;
        //     }
        //     showSlide(nextIndex);
        // }, 5000);
    });
}

// Initialize image sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
});

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

// Store selected dress information
let selectedDress = null;

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

// Enhanced dress modal setup with dress storage
function setupDressModal(buttons, isReadyToWear = false) {
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Get dress data from button attributes
            const dressName = btn.getAttribute('data-dress');
            const dressPrice = btn.getAttribute('data-price');
            const dressImages = JSON.parse(btn.getAttribute('data-images') || '[]');
            const dressDesc = btn.getAttribute('data-desc');
            const dressSpecs = btn.getAttribute('data-specs');

            // Store selected dress info globally
            selectedDress = {
                name: dressName,
                price: dressPrice,
                type: isReadyToWear ? 'ready-to-wear' : 'rental',
                images: dressImages,
                description: dressDesc,
                specifications: dressSpecs
            };

            // Populate modal with dress data
            document.getElementById('dressModalTitle').textContent = dressName;
            document.getElementById('dressModalPrice').textContent = dressPrice;

            // Use the first image as default in modal
            if (dressImages.length > 0) {
                document.getElementById('dressModalImg').src = dressImages[0];
                document.getElementById('dressModalImg').alt = dressName;
            }

            document.getElementById('dressModalDesc').textContent = dressDesc || '';

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
    selectedDress = null; // Reset selected dress when closing modal
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
        selectedDress = null; // Reset selected dress when closing modal
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

// Enhanced booking summary with dress information
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

    // Add dress information if available
    let dressInfo = '';
    if (selectedDress) {
        dressInfo = `<p><strong>Selected Dress:</strong> ${selectedDress.name}</p>
                     <p><strong>Price:</strong> ${selectedDress.price}</p>
                     <p><strong>Type:</strong> ${selectedDress.type === 'ready-to-wear' ? 'Ready to Wear' : 'Rental'}</p>`;
    }

    const summaryHTML = `
        <div style="background: #f8f8f8; padding: 15px; border-radius: 5px; margin-bottom: 1rem;">
            <p><strong>Service:</strong> ${serviceText}</p>
            ${dressInfo}
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${date ? `<p><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString()}</p>` : ''}
            ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : ''}
        </div>
        <p style="color: #5e2c3e; font-weight: bold;">Click "Confirm Booking" to send this directly to Fiona Creations</p>
    `;

    document.getElementById('bookingSummary').innerHTML = summaryHTML;
}

// Simple email booking solution - NO BACKEND REQUIRED
function submitBookingSimple(bookingData) {
    const dressInfo = bookingData.dress ?
        `SELECTED DRESS:%0D%0A- Dress Name: ${bookingData.dress.name}%0D%0A- Price: ${bookingData.dress.price}%0D%0A- Type: ${bookingData.dress.type}%0D%0A%0D%0A` :
        `SERVICE REQUESTED:%0D%0A- ${bookingData.service}%0D%0A%0D%0A`;

    const subject = `🎀 New Booking - ${bookingData.name}`;

    const body = `
NEW BOOKING FROM FIONA CREATIONS WEBSITE%0D%0A
=============================================%0D%0A%0D%0A

CUSTOMER DETAILS:%0D%0A
- Name: ${bookingData.name}%0D%0A
- Email: ${bookingData.email}%0D%0A
- Phone: ${bookingData.phone}%0D%0A%0D%0A

${dressInfo}
BOOKING DETAILS:%0D%0A
- Preferred Date: ${bookingData.date || 'Not specified'}%0D%0A
- Special Requests: ${bookingData.notes || 'None'}%0D%0A%0D%0A

ADDITIONAL INFORMATION:%0D%0A
- Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}%0D%0A
- Website: Fiona Creations Booking System%0D%0A%0D%0A

---%0D%0AThis booking was submitted through the Fiona Creations website.
    `.trim();

    // Open email client with pre-filled details
    const mailtoLink = `mailto:fionacreations21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Try to open email client
    window.open(mailtoLink, '_blank');

    return Promise.resolve();
}

// Enhanced booking form submission with email integration
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get all form data
    const formData = {
        service: document.getElementById('bookingService').value,
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        date: document.getElementById('bookingDate').value,
        notes: document.getElementById('bookingNotes').value,
        dress: selectedDress,
        timestamp: new Date().toISOString()
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields: Name, Email, and Phone.');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Submit via email
        await submitBookingSimple(formData);

        // Success - show confirmation modal
        bookingModal.style.display = 'none';

        // Update success message based on booking type
        let successMessage = `Thank you ${formData.name}! Your booking request has been sent to Fiona Creations.`;
        if (formData.dress) {
            successMessage += ` We've received your interest in the "${formData.dress.name}".`;
        }
        successMessage += ` Fiona will contact you shortly to confirm your booking.`;

        document.getElementById('successMessage').textContent = successMessage;
        successModal.style.display = 'flex';

        // Reset everything
        selectedDress = null;
        document.getElementById('bookingForm').reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        alert('There was an error preparing your booking. Please try again or contact us directly at fionacreations21@gmail.com');
        console.error('Booking error:', error);

        // Reset button state
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        submitBtn.textContent = 'Confirm Booking';
        submitBtn.disabled = false;
    }
});

// Enhanced contact form with email integration
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        type: 'general-inquiry'
    };

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
        alert('Please fill in all required fields: Name, Email, and Message.');
        return;
    }

    const subject = `📧 Website Inquiry - ${formData.name}`;
    const body = `
NEW INQUIRY FROM FIONA CREATIONS WEBSITE%0D%0A
=============================================%0D%0A%0D%0A

CONTACT DETAILS:%0D%0A
- Name: ${formData.name}%0D%0A
- Email: ${formData.email}%0D%0A
- Phone: ${formData.phone || 'Not provided'}%0D%0A%0D%0A

SERVICE INTEREST:%0D%0A
- ${formData.service || 'Not specified'}%0D%0A%0D%0A

MESSAGE:%0D%0A
${formData.message}%0D%0A%0D%0A

ADDITIONAL INFORMATION:%0D%0A
- Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}%0D%0A
- Type: General Inquiry%0D%0A
    `.trim();

    try {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        window.open(`mailto:fionacreations21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');

        document.getElementById('successMessage').textContent = `Thank you ${formData.name}! Your message has been sent to Fiona Creations. We will get back to you shortly.`;
        successModal.style.display = 'flex';
        document.getElementById('contactForm').reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        alert('There was an error sending your message. Please try again or contact us directly at fionacreations21@gmail.com');

        // Reset button state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
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

// Reset selected dress when booking modal opens (in case user goes back)
document.getElementById('bookingModal').addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        selectedDress = null;
    }
});