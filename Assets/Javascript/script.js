// API Configuration
const API_URL = 'https://qf4g026084.execute-api.eu-north-1.amazonaws.com/Production/bookings';

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
    });
}

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
let isDressBooking = false;

// Function to open modal with blur
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.classList.add('body-blur');
}

// Function to close modal and remove blur
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.classList.remove('body-blur');
}

// Enhanced function to reset booking form completely
function resetBookingForm() {
    selectedDress = null;
    isDressBooking = false;
    document.getElementById('bookingForm').reset();
    if (isDressBooking) {
        goToStep('2');
    } else {
        goToStep('1');
    }
}

// Open booking modal for general consultation
bookNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isDressBooking = false;
    resetBookingForm();
    openModal(bookingModal);
});

heroBookBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isDressBooking = false;
    resetBookingForm();
    openModal(bookingModal);
});

// Service buttons (for custom and styling services)
bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        isDressBooking = false;
        resetBookingForm();
        openModal(bookingModal);
        const service = btn.getAttribute('data-service');
        document.getElementById('bookingService').value = service;
        goToStep('2');
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

            console.log('Selected dress stored:', selectedDress);

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
                modalBookBtn.textContent = 'Reserve This Dress';
            }

            // Show modal
            openModal(dressModal);
        });
    });
}

// Set up modals for both rental and ready-to-wear items
setupDressModal(document.querySelectorAll('.view-dress-btn'));
setupDressModal(document.querySelectorAll('.get-this-look-btn'), true);

// Book dress button in dress modal
bookDressBtn.addEventListener('click', () => {
    closeModal(dressModal);
    isDressBooking = true;

    // Reset form and open booking modal
    document.getElementById('bookingForm').reset();

    // Set service type automatically based on dress type
    const serviceType = selectedDress.type === 'ready-to-wear' ? 'ready-to-wear' : 'rental';
    document.getElementById('bookingService').value = serviceType;

    console.log('Dress booking - Service auto-set to:', serviceType);

    // Open booking modal and skip to details step
    openModal(bookingModal);
    goToStep('2');
});

// Close modals
closeBookingModal.addEventListener('click', () => {
    closeModal(bookingModal);
    resetBookingForm();
});

closeDressModal.addEventListener('click', () => {
    closeModal(dressModal);
});

closeSuccessModal.addEventListener('click', () => {
    closeModal(successModal);
});

closeSuccessBtn.addEventListener('click', () => {
    closeModal(successModal);
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeModal(bookingModal);
        resetBookingForm();
    }
    if (e.target === dressModal) {
        closeModal(dressModal);
    }
    if (e.target === successModal) {
        closeModal(successModal);
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
    // For dress bookings, skip step 1 (service selection)
    if (isDressBooking && stepNumber === '1') {
        stepNumber = '2';
    }

    // Update steps
    bookingSteps.forEach(step => {
        const stepNum = step.getAttribute('data-step');

        // Hide step 1 for dress bookings
        if (isDressBooking && stepNum === '1') {
            step.style.display = 'none';
        } else {
            step.style.display = 'flex';
        }

        if (parseInt(stepNum) <= parseInt(stepNumber)) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else {
            step.classList.remove('completed', 'active');
        }

        if (stepNum === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update pages
    bookingPages.forEach(page => {
        const pageNum = page.getAttribute('data-page');

        // Hide page 1 for dress bookings
        if (isDressBooking && pageNum === '1') {
            page.classList.remove('active');
        } else if (pageNum === stepNumber) {
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

// Updated booking summary with proper date formatting
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

    // Format date properly
    const formattedDate = date ? formatDateForDisplay(date) : '';

    // Add dress information if available
    let dressInfo = '';
    if (selectedDress) {
        dressInfo = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4 style="color: #5e2c3e; margin-top: 0; font-size: 1rem; font-weight: 600;">Selected Dress</h4>
                <p style="margin: 8px 0; color: #333;"><strong>Dress:</strong> ${selectedDress.name}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Price:</strong> ${selectedDress.price}</p>
                <p style="margin: 8px 0; color: #333;"><strong>Type:</strong> ${selectedDress.type === 'ready-to-wear' ? 'Ready to Wear' : 'Rental'}</p>
            </div>
        `;
    }

    const summaryHTML = `
        <div class="booking-confirmation-style">
            <div class="confirmation-icon">✓</div>
            <h2>Confirm Your Booking</h2>
            
            <div class="booking-details">
                <h4>Service Details</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9rem;">
                    <div>
                        <p style="margin: 6px 0; color: #666;">Service:</p>
                        <p style="margin: 6px 0; color: #666;">Customer:</p>
                        <p style="margin: 6px 0; color: #666;">Email:</p>
                        <p style="margin: 6px 0; color: #666;">Phone:</p>
                        ${formattedDate ? `<p style="margin: 6px 0; color: #666;">Preferred Date:</p>` : ''}
                    </div>
                    <div>
                        <p style="margin: 6px 0; color: #333;">${serviceText}</p>
                        <p style="margin: 6px 0; color: #333;">${name}</p>
                        <p style="margin: 6px 0; color: #333;">${email}</p>
                        <p style="margin: 6px 0; color: #333;">${phone}</p>
                        ${formattedDate ? `<p style="margin: 6px 0; color: #333;">${formattedDate}</p>` : ''}
                    </div>
                </div>
                ${dressInfo}
                ${notes ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 8px 0; color: #333;"><strong>Special Requests:</strong> ${notes}</p>
                </div>` : ''}
            </div>

            <div class="banking-details">
                <h4>Payment Information</h4>
                <div style="font-size: 0.9rem;">
                    <p style="margin: 8px 0;"><strong>Bank:</strong> Capitec Business</p>
                    <p style="margin: 8px 0;"><strong>Account:</strong> Fiona Creations</p>
                    <p style="margin: 8px 0;"><strong>Number:</strong> 1053 5216 93</p>
                </div>
                <p style="color: #666; font-size: 0.85rem; margin: 15px 0 0 0; font-style: italic;">
                    Please use your name as reference when making payment
                </p>
            </div>

            <div class="next-steps">
                <h4>What happens next</h4>
                <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">
                    <p style="margin: 8px 0;">• Fiona will contact you within 24 hours</p>
                    <p style="margin: 8px 0;">• Consultation and fitting arrangements</p>
                    <p style="margin: 8px 0;">• Payment confirmation</p>
                </div>
            </div>

            <div class="email-confirmation">
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    A confirmation email will be sent to <strong>${email}</strong>
                </p>
            </div>

            <div class="contact-info">
                <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">
                    Questions? Contact Fiona directly
                </p>
                <p style="margin: 8px 0;">
                    <a href="mailto:fionacreations21@gmail.com" style="color: #5e2c3e; text-decoration: none; font-size: 0.9rem;">
                        fionacreations21@gmail.com
                    </a>
                </p>
            </div>
        </div>
    `;

    document.getElementById('bookingSummary').innerHTML = summaryHTML;
}

// UPDATED SUCCESS MODAL - Only shows on actual success
function showSuccessWithBankingDetails(bookingData, result) {
    // Format date properly
    const formattedDate = bookingData.date ? formatDateForDisplay(bookingData.date) : '';

    const successMessage = `
        <div style="text-align: center; padding: 30px 20px;">
            <!-- Simple Checkmark -->
            <div style="font-size: 3rem; color: #5e2c3e; margin-bottom: 1rem;">✓</div>
            
            <!-- Clean Title -->
            <h2 style="color: #5e2c3e; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; font-family: 'Playfair Display', serif;">
                Booking Confirmed!
            </h2>
            
            <!-- Simple Message -->
            <p style="margin-bottom: 2rem; color: #666; line-height: 1.5;">
                Thank you, <strong>${bookingData.name}</strong>. Your booking <strong>#${result.bookingId}</strong> has been received.
            </p>

            <!-- Minimal Booking Details -->
            <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h4 style="color: #5e2c3e; margin-top: 0; margin-bottom: 15px; font-size: 1rem; font-weight: 600;">Booking Details</h4>
                
                ${bookingData.dress ? `
                <div style="margin-bottom: 15px;">
                    <p style="margin: 8px 0; color: #333;"><strong>Dress:</strong> ${bookingData.dress.name}</p>
                    ${bookingData.dress.price ? `<p style="margin: 8px 0; color: #333;"><strong>Price:</strong> ${bookingData.dress.price}</p>` : ''}
                </div>
                ` : ''}
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.9rem;">
                    <div>
                        <p style="margin: 6px 0; color: #666;">Service:</p>
                        <p style="margin: 6px 0; color: #666;">Reference:</p>
                        ${formattedDate ? `<p style="margin: 6px 0; color: #666;">Preferred Date:</p>` : ''}
                    </div>
                    <div>
                        <p style="margin: 6px 0; color: #333;">${result.serviceName || bookingData.service || 'Consultation'}</p>
                        <p style="margin: 6px 0; color: #333;">#${result.bookingId}</p>
                        ${formattedDate ? `<p style="margin: 6px 0; color: #333;">${formattedDate}</p>` : ''}
                    </div>
                </div>
            </div>

            <!-- Clean Payment Information -->
            <div style="border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h4 style="color: #5e2c3e; margin-top: 0; margin-bottom: 15px; font-size: 1rem; font-weight: 600;">Payment Details</h4>
                
                <div style="font-size: 0.9rem;">
                    <p style="margin: 8px 0;"><strong>Bank:</strong> Capitec Business</p>
                    <p style="margin: 8px 0;"><strong>Account:</strong> Fiona Creations</p>
                    <p style="margin: 8px 0;"><strong>Number:</strong> 1053 5216 93</p>
                    <p style="margin: 8px 0;"><strong>Reference:</strong> ${result.bookingId}</p>
                </div>
                
                <p style="color: #666; font-size: 0.85rem; margin: 15px 0 0 0; font-style: italic;">
                    Please use your booking reference when making payment
                </p>
            </div>

            <!-- Simple Next Steps -->
            <div style="margin: 25px 0;">
                <h4 style="color: #5e2c3e; margin-bottom: 12px; font-size: 1rem; font-weight: 600;">What happens next</h4>
                <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">
                    <p style="margin: 8px 0;">• Fiona will contact you within 24 hours</p>
                    <p style="margin: 8px 0;">• Consultation and fitting arrangements</p>
                    <p style="margin: 8px 0;">• Payment confirmation</p>
                </div>
            </div>

            <!-- Email Confirmation -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    A confirmation email has been sent to <strong>${bookingData.email}</strong>
                </p>
            </div>

            <!-- Contact Information -->
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">
                    Questions? Contact Fiona directly
                </p>
                <p style="margin: 8px 0;">
                    <a href="mailto:fionacreations21@gmail.com" style="color: #5e2c3e; text-decoration: none; font-size: 0.9rem;">
                        fionacreations21@gmail.com
                    </a>
                </p>
                <p style="margin: 8px 0;">
                    <a href="tel:0643739810" style="color: #5e2c3e; text-decoration: none; font-size: 0.9rem;">
                        064 373 9810
                    </a>
                </p>
            </div>
        </div>
    `;

    document.getElementById('successMessage').innerHTML = successMessage;
    openModal(successModal);
}

// Updated API booking function with proper error handling
async function submitBooking(bookingData) {
    try {
        console.log('Sending booking data to API:', JSON.stringify(bookingData, null, 2));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        console.log('API response:', result);

        if (response.ok && result.success) {
            // Close booking modal
            closeModal(bookingModal);

            // Show professional success modal
            showSuccessWithBankingDetails(bookingData, result);

            return true;
        } else {
            // Show proper error modal
            showErrorModal('Booking Failed', result.message || result.error || 'There was an issue processing your booking. Please try again.');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorModal(
            'Connection Error',
            'Unable to process your booking at this time. Please try again or contact Fiona directly at 064 373 9810.'
        );
        return false;
    }
}

// PROPER ERROR MODAL - Completely different from success
function showErrorModal(title, message) {
    const errorHTML = `
        <div style="text-align: center; padding: 30px 20px;">
            <div style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;">✗</div>
            <h2 style="color: #dc3545; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; font-family: 'Playfair Display', serif;">
                ${title}
            </h2>
            <p style="color: #666; line-height: 1.5; margin-bottom: 2rem;">${message}</p>
            <button class="btn" onclick="closeModal(successModal)" style="background: #dc3545; border-color: #dc3545;">
                Try Again
            </button>
        </div>
    `;

    document.getElementById('successMessage').innerHTML = errorHTML;
    openModal(successModal);
}

// Enhanced booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get all form data
    const formData = {
        service: document.getElementById('bookingService').value,
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        date: document.getElementById('bookingDate').value,
        notes: document.getElementById('bookingNotes').value
    };

    // Add dress information if available
    if (selectedDress) {
        formData.dress = {
            name: selectedDress.name,
            price: selectedDress.price,
            type: selectedDress.type
        };
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
        showErrorModal('Missing Information', 'Please fill in all required fields: Name, Email, and Phone.');
        return;
    }

    try {
        // Show loading state
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Submit via API
        const success = await submitBooking(formData);

        if (success) {
            // Success - reset everything
            resetBookingForm();
        }

        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        console.error('Booking error:', error);
        showErrorModal(
            'Unexpected Error',
            'There was an unexpected error processing your booking. Please contact us directly at fionacreations21@gmail.com'
        );

        // Reset button state
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        submitBtn.textContent = 'Confirm Booking';
        submitBtn.disabled = false;
    }
});

// Enhanced contact form
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
        showErrorModal('Missing Information', 'Please fill in all required fields: Name, Email, and Message.');
        return;
    }

    const subject = `Website Inquiry - ${formData.name}`;
    const body = `
NEW INQUIRY FROM FIONA CREATIONS WEBSITE

CONTACT DETAILS:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}

SERVICE INTEREST:
- ${formData.service || 'Not specified'}

MESSAGE:
${formData.message}

ADDITIONAL INFORMATION:
- Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
- Type: General Inquiry
    `.trim();

    try {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        window.open(`mailto:fionacreations21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');

        // Show success message for contact form
        // In the contact form submit handler, replace the success section with:
        const contactSuccessHTML = `
    <div style="text-align: center; padding: 30px 20px;">
        <div style="font-size: 3rem; color: #5e2c3e; margin-bottom: 1rem;">✓</div>
        <h2 style="color: #5e2c3e; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600; font-family: 'Playfair Display', serif;">
            Message Sent
        </h2>
        <p style="color: #666; line-height: 1.5; margin-bottom: 1rem;">
            Thank you, <strong>${formData.name}</strong>. Your message has been sent to Fiona Creations.
        </p>
        <p style="color: #666; font-size: 0.9rem;">
            We will get back to you within 24 hours.
        </p>
    </div>
`;

        document.getElementById('successMessage').innerHTML = contactSuccessHTML;
        openModal(successModal);
        document.getElementById('contactForm').reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        showErrorModal(
            'Message Failed',
            'There was an error sending your message. Please try again or contact us directly at fionacreations21@gmail.com'
        );

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

// Hero Slideshow Functionality
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function pauseSlideshow() {
        clearInterval(slideInterval);
    }

    function resumeSlideshow() {
        startSlideshow();
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseSlideshow);
        heroSection.addEventListener('mouseleave', resumeSlideshow);
        heroSection.addEventListener('touchstart', pauseSlideshow);
        heroSection.addEventListener('touchend', resumeSlideshow);
    }

    showSlide(0);
    startSlideshow();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
    initHeroSlideshow();
});

// Date formatting utility
function formatDateForDisplay(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-ZA', options);
}

// For the booking form (MM/DD/YYYY to DD Month YYYY)
function formatFormDate(dateString) {
    if (!dateString) return '';

    // Parse the date from the form (MM/DD/YYYY)
    const [month, day, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-ZA', options);
}