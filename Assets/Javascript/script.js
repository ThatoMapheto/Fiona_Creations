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
let isDressBooking = false; // NEW: Track if this is a dress-specific booking

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
    // Reset to appropriate step based on booking type
    if (isDressBooking) {
        goToStep('2'); // Skip service selection for dress bookings
    } else {
        goToStep('1'); // Start with service selection for general bookings
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
        goToStep('2'); // Skip to details after service selection
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

// Book dress button in dress modal - UPDATED: Skip service selection
bookDressBtn.addEventListener('click', () => {
    closeModal(dressModal);
    isDressBooking = true; // Mark as dress-specific booking

    // Reset form and open booking modal
    document.getElementById('bookingForm').reset();

    // Set service type automatically based on dress type
    const serviceType = selectedDress.type === 'ready-to-wear' ? 'ready-to-wear' : 'rental';
    document.getElementById('bookingService').value = serviceType;

    console.log('Dress booking - Service auto-set to:', serviceType);

    // Open booking modal and skip to details step
    openModal(bookingModal);
    goToStep('2'); // Skip service selection, go directly to details
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

// Enhanced booking summary with banking details
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
        dressInfo = `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4 style="color: #2e7d32; margin-top: 0;">Selected Dress</h4>
                <p><strong>Dress:</strong> ${selectedDress.name}</p>
                <p><strong>Price:</strong> ${selectedDress.price}</p>
                <p><strong>Type:</strong> ${selectedDress.type === 'ready-to-wear' ? 'Ready to Wear' : 'Rental'}</p>
            </div>
        `;
    }

    // Banking details section
    const bankingDetails = `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">💳 Payment Information</h4>
            <p><strong>Bank:</strong> Capitec Business</p>
            <p><strong>Account Name:</strong> Fiona Creations</p>
            <p><strong>Account Number:</strong> 1053 5216 93</p>
            <p style="font-size: 0.9rem; margin-top: 10px; color: #856404;">
                <strong>Please use your name as reference when making payment.</strong>
            </p>
        </div>
    `;

    const summaryHTML = `
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 1rem;">
            <p><strong>Service:</strong> ${serviceText}</p>
            ${dressInfo}
            <div style="border-top: 1px solid #ddd; margin: 15px 0; padding-top: 15px;">
                <p><strong>Customer Information</strong></p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                ${date ? `<p><strong>Preferred Date:</strong> ${new Date(date).toLocaleDateString()}</p>` : ''}
                ${notes ? `<p><strong>Special Requests:</strong> ${notes}</p>` : ''}
            </div>
            ${bankingDetails}
        </div>
        <p style="color: #5e2c3e; font-weight: bold;">Click "Confirm Booking" to complete your reservation</p>
    `;

    document.getElementById('bookingSummary').innerHTML = summaryHTML;

    console.log('Booking summary updated. Selected dress:', selectedDress);
}

// Enhanced success modal with banking details
function showSuccessWithBankingDetails(bookingData, result) {
    let successMessage = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; color: #28a745; margin-bottom: 1rem;">✅</div>
            <h2 style="color: #5e2c3e; margin-bottom: 1rem;">Booking Confirmed!</h2>
            <p style="margin-bottom: 1.5rem; font-size: 1.1rem;">
                Thank you! Your booking <strong>#${result.bookingId}</strong> has been received.
            </p>
    `;

    if (result.dressName) {
        successMessage += `
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4 style="color: #2e7d32; margin-top: 0;">Your Selection</h4>
                <p><strong>Dress:</strong> ${result.dressName}</p>
                ${result.dressPrice ? `<p><strong>Price:</strong> ${result.dressPrice}</p>` : ''}
                ${result.orderTotal && result.orderTotal > 0 ? `<p><strong>Total Amount:</strong> R${result.orderTotal}</p>` : ''}
            </div>
        `;
    }

    successMessage += `
        <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
            <h4 style="color: #0c5460; margin-top: 0;">💰 Payment Instructions</h4>
            <p><strong>Please make payment to:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <p><strong>Bank:</strong> Capitec Business</p>
                <p><strong>Account Name:</strong> Fiona Creations</p>
                <p><strong>Account Number:</strong> 1053 5216 93</p>
                <p><strong>Reference:</strong> ${result.bookingId} or your name</p>
            </div>
            <p style="color: #0c5460; font-size: 0.9rem;">
                <strong>📞 Next Steps:</strong> Fiona will contact you within 24 hours to confirm your booking details and discuss delivery/collection.
            </p>
        </div>
        <p style="color: #6c757d; font-size: 0.9rem;">
            A confirmation email has been sent to ${bookingData.email} with these details.
        </p>
    `;

    document.getElementById('successMessage').innerHTML = successMessage;
    openModal(successModal);
}

// Update the API booking function to use the new success modal
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

        if (result.success) {
            // Show success message with banking details
            let successMsg = `✅ Booking received! Your reference: ${result.bookingId}`;
            if (result.dressName) {
                successMsg += `\n\nDress: ${result.dressName}`;
                if (result.dressPrice) {
                    successMsg += `\nPrice: ${result.dressPrice}`;
                }
            }
            if (result.orderTotal && result.orderTotal > 0) {
                successMsg += `\nTotal: R${result.orderTotal}`;
            }
            successMsg += `\n\nPayment Details:\nBank: Capitec Business\nAccount: 1053 5216 93\nReference: ${result.bookingId}`;
            successMsg += `\n\nFiona will contact you within 24 hours.`;

            alert(successMsg);

            // Close modal if open
            closeModal(bookingModal);

            // Show enhanced success modal with banking details
            showSuccessWithBankingDetails(bookingData, result);

            return true;
        } else {
            alert('❌ Booking failed: ' + (result.message || result.error));
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Network error. Please try again or contact Fiona directly at 064 373 9810');
        return false;
    }
}

// FIXED: Enhanced booking form submission
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

    // CRITICAL FIX: Add dress information if available
    if (selectedDress) {
        formData.dress = {
            name: selectedDress.name,
            price: selectedDress.price,
            type: selectedDress.type
        };

        console.log('Dress data added to formData:', formData.dress);
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields: Name, Email, and Phone.');
        return;
    }

    // Debug: Show what's being sent
    console.log('Final form data being submitted:', JSON.stringify(formData, null, 2));

    try {
        // Show loading state
        const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Booking...';
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
        alert('There was an error processing your booking. Please try again or contact us directly at fionacreations21@gmail.com');
        console.error('Booking error:', error);

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
        openModal(successModal);
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