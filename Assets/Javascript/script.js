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

// Image slider functionality
function initImageSliders() {
    const sliders = document.querySelectorAll('.image-slider');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-images img');
        const prevArrow = slider.querySelector('.prev-arrow');
        const nextArrow = slider.querySelector('.next-arrow');
        const dots = slider.querySelectorAll('.slider-dots .dot');

        let currentIndex = 0;

        function showSlide(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            images[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentIndex = index;
        }

        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= images.length) nextIndex = 0;
                showSlide(nextIndex);
            });
        }

        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) prevIndex = images.length - 1;
                showSlide(prevIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
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
const getThisLookBtns = document.querySelectorAll('.get-this-look-btn');
const bookDressBtn = document.querySelector('.book-dress-btn');

let selectedDress = null;
let isDressBooking = false;

// Modal functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.classList.add('body-blur');
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.classList.remove('body-blur');
}

function resetBookingForm() {
    selectedDress = null;
    isDressBooking = false;
    document.getElementById('bookingForm').reset();
    goToStep(isDressBooking ? '2' : '1');
}

// Event listeners
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

// Dress modal setup
function setupDressModal(buttons, isReadyToWear = false) {
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            selectedDress = {
                name: btn.getAttribute('data-dress'),
                price: btn.getAttribute('data-price'),
                type: isReadyToWear ? 'ready-to-wear' : 'rental',
                images: JSON.parse(btn.getAttribute('data-images') || '[]'),
                description: btn.getAttribute('data-desc'),
                specifications: btn.getAttribute('data-specs')
            };

            document.getElementById('dressModalTitle').textContent = selectedDress.name;
            document.getElementById('dressModalPrice').textContent = selectedDress.price;

            if (selectedDress.images.length > 0) {
                document.getElementById('dressModalImg').src = selectedDress.images[0];
                document.getElementById('dressModalImg').alt = selectedDress.name;
            }

            document.getElementById('dressModalDesc').textContent = selectedDress.description || '';

            const specsList = document.getElementById('dressModalSpecs');
            specsList.innerHTML = '';
            selectedDress.specifications.split('|').forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                specsList.appendChild(li);
            });

            const modalBookBtn = document.querySelector('.book-dress-btn');
            modalBookBtn.textContent = isReadyToWear ? 'Get This Look' : 'Reserve This Dress';

            openModal(dressModal);
        });
    });
}

setupDressModal(viewDressBtns);
setupDressModal(getThisLookBtns, true);

bookDressBtn.addEventListener('click', () => {
    closeModal(dressModal);
    isDressBooking = true;
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingService').value = selectedDress.type === 'ready-to-wear' ? 'ready-to-wear' : 'rental';

    // Initialize calendar for rental dresses
    if (selectedDress.type === 'rental') {
        initializeCalendarWithUnavailableDates(selectedDress.name);
    }

    openModal(bookingModal);
    goToStep('2');
});

// Close modal handlers
closeBookingModal.addEventListener('click', () => {
    closeModal(bookingModal);
    resetBookingForm();
});

closeDressModal.addEventListener('click', () => closeModal(dressModal));
closeSuccessModal.addEventListener('click', () => closeModal(successModal));
closeSuccessBtn.addEventListener('click', () => closeModal(successModal));

window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeModal(bookingModal);
        resetBookingForm();
    }
    if (e.target === dressModal) closeModal(dressModal);
    if (e.target === successModal) closeModal(successModal);
});

// Booking form steps
const bookingSteps = document.querySelectorAll('.step');
const bookingPages = document.querySelectorAll('.booking-form-page');
const nextStepBtns = document.querySelectorAll('.next-step');
const prevStepBtns = document.querySelectorAll('.prev-step');

nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.getAttribute('data-next')));
});

prevStepBtns.forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.getAttribute('data-prev')));
});

function goToStep(stepNumber) {
    if (isDressBooking && stepNumber === '1') stepNumber = '2';

    bookingSteps.forEach(step => {
        const stepNum = step.getAttribute('data-step');
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

        if (stepNum === stepNumber) step.classList.add('active');
    });

    bookingPages.forEach(page => {
        const pageNum = page.getAttribute('data-page');
        if (isDressBooking && pageNum === '1') {
            page.classList.remove('active');
        } else if (pageNum === stepNumber) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    if (stepNumber === '3') updateBookingSummary();
}

// Date formatting
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-ZA', options);
}

// Booking summary
function updateBookingSummary() {
    const service = document.getElementById('bookingService').value;
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const phone = document.getElementById('bookingPhone').value;
    const date = document.getElementById('bookingDate').value;
    const notes = document.getElementById('bookingNotes').value;

    const serviceText = {
        'rental': 'Dress Rental',
        'custom': 'Custom-Made Dress',
        'styling': 'Personal Styling Service',
        'ready-to-wear': 'Ready to Wear'
    }[service] || 'Service';

    const formattedDate = date ? formatDateForDisplay(date) : '';

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

// Check if a specific dress is available on a specific date
async function checkDressAvailability(dressName, date) {
    try {
        console.log('🔍 Checking availability for:', dressName, 'on', date);
        const response = await fetch(`${API_URL}?dress=${encodeURIComponent(dressName)}&date=${encodeURIComponent(date)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        console.log('🔍 Availability check result:', result);
        return result.available !== false;
    } catch (error) {
        console.error('❌ Error checking availability:', error);
        return true; // Default to available
    }
}

// Get all booked dates for a dress in a month
async function getBookedDatesForMonth(dressName, year, month) {
    try {
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        const response = await fetch(`${API_URL}?dress=${encodeURIComponent(dressName)}&month=${monthStr}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        console.log('🔍 Booked dates result:', result);
        return result.bookedDates || [];
    } catch (error) {
        console.error('❌ Error getting booked dates:', error);
        return [];
    }
}

// Initialize calendar with unavailable dates
async function initializeCalendarWithUnavailableDates(dressName) {
    if (!dressName) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Get booked dates for the current month
    const bookedDates = await getBookedDatesForMonth(dressName, currentYear, currentMonth);

    console.log('🔍 Booked dates for calendar:', bookedDates);

    // Update your date picker to disable booked dates
    const dateInput = document.getElementById('bookingDate');
    if (dateInput && bookedDates.length > 0) {
        // Add min date (today)
        const todayStr = today.toISOString().split('T')[0];
        dateInput.min = todayStr;

        // Check availability when date is selected
        dateInput.addEventListener('change', async function () {
            if (this.value && dressName) {
                console.log('🔍 Date selected:', this.value);
                const isAvailable = await checkDressAvailability(dressName, this.value);
                if (!isAvailable) {
                    console.log('❌ Date unavailable, clearing selection');
                    this.value = '';
                    showErrorModal('Date Unavailable',
                        `The dress "${dressName}" is already booked on ${formatDateForDisplay(this.value)}. Please select another date.`);
                } else {
                    console.log('✅ Date available');
                }
            }
        });
    }
}

// API functions with debug logs
async function submitBooking(bookingData) {
    try {
        console.log('🔍 DEBUG: Sending booking to API:', bookingData);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        console.log('🔍 DEBUG: API Response status:', response.status);
        console.log('🔍 DEBUG: API Response ok:', response.ok);

        const result = await response.json();
        console.log('🔍 DEBUG: Full API response:', result);

        if (response.ok && result.success) {
            console.log('✅ DEBUG: Booking successful');
            closeModal(bookingModal);
            showSuccessWithBankingDetails(bookingData, result);
            return true;
        } else {
            console.log('❌ DEBUG: Booking failed:', result.error || result.message);
            const errorMessage = result.error || result.message || 'There was an issue processing your booking.';
            showErrorModal('Booking Failed', errorMessage);
            return false;
        }
    } catch (error) {
        console.error('❌ DEBUG: Network error:', error);
        showErrorModal('Connection Error', 'Unable to process your booking. Please try again or contact Fiona directly.');
        return false;
    }
}

function showSuccessWithBankingDetails(bookingData, result) {
    const formattedDate = bookingData.date ? formatDateForDisplay(bookingData.date) : '';

    const successMessage = `
        <div style="text-align: center; padding: 30px 20px;">
            <div style="font-size: 3rem; color: #5e2c3e; margin-bottom: 1rem;">✓</div>
            <h2 style="color: #5e2c3e; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600;">Booking Confirmed!</h2>
            <p style="margin-bottom: 2rem; color: #666; line-height: 1.5;">
                Thank you, <strong>${bookingData.name}</strong>. Your booking <strong>#${result.bookingId}</strong> has been received.
            </p>

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

            <div style="margin: 25px 0;">
                <h4 style="color: #5e2c3e; margin-bottom: 12px; font-size: 1rem; font-weight: 600;">What happens next</h4>
                <div style="font-size: 0.9rem; color: #666; line-height: 1.6;">
                    <p style="margin: 8px 0;">• Fiona will contact you within 24 hours</p>
                    <p style="margin: 8px 0;">• Consultation and fitting arrangements</p>
                    <p style="margin: 8px 0;">• Payment confirmation</p>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 0.9rem;">
                    A confirmation email has been sent to <strong>${bookingData.email}</strong>
                </p>
            </div>

            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="margin: 5px 0; color: #666; font-size: 0.85rem;">Questions? Contact Fiona directly</p>
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

function showErrorModal(title, message) {
    const errorHTML = `
        <div style="text-align: center; padding: 30px 20px;">
            <div style="font-size: 3rem; color: #dc3545; margin-bottom: 1rem;">✗</div>
            <h2 style="color: #dc3545; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600;">${title}</h2>
            <p style="color: #666; line-height: 1.5; margin-bottom: 2rem;">${message}</p>
            <button class="btn" onclick="closeModal(successModal)" style="background: #dc3545; border-color: #dc3545;">
                Try Again
            </button>
        </div>
    `;

    document.getElementById('successMessage').innerHTML = errorHTML;
    openModal(successModal);
}

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('🔍 DEBUG: Form submission started');

    const formData = {
        service: document.getElementById('bookingService').value,
        name: document.getElementById('bookingName').value,
        email: document.getElementById('bookingEmail').value,
        phone: document.getElementById('bookingPhone').value,
        date: document.getElementById('bookingDate').value,
        notes: document.getElementById('bookingNotes').value
    };

    if (selectedDress) {
        formData.dress = {
            name: selectedDress.name,
            price: selectedDress.price,
            type: selectedDress.type
        };

        // Check availability before submitting if date is selected (for rental dresses only)
        if (formData.date && selectedDress.type === 'rental') {
            console.log('🔍 DEBUG: Checking dress availability for rental...');
            const isAvailable = await checkDressAvailability(selectedDress.name, formData.date);

            if (!isAvailable) {
                console.log('❌ DEBUG: Dress not available on selected date');
                showErrorModal('Dress Not Available',
                    `The dress "${selectedDress.name}" is already booked on ${formatDateForDisplay(formData.date)}. Please select another date.`);
                return;
            }
            console.log('✅ DEBUG: Dress is available');
        }
    }

    console.log('🔍 DEBUG: Form data prepared:', formData);

    if (!formData.name || !formData.email || !formData.phone) {
        console.log('❌ DEBUG: Missing required fields');
        showErrorModal('Missing Information', 'Please fill in all required fields: Name, Email, and Phone.');
        return;
    }

    const submitBtn = document.querySelector('#bookingForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
        const success = await submitBooking(formData);
        console.log('🔍 DEBUG: submitBooking returned:', success);

        if (success) {
            console.log('✅ DEBUG: Success, resetting form');
            resetBookingForm();
        } else {
            console.log('❌ DEBUG: Booking failed, keeping form data for correction');
        }
    } catch (error) {
        console.error('❌ DEBUG: Unexpected error in form submission:', error);
        showErrorModal('Unexpected Error', 'There was an unexpected error. Please contact us directly.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        console.log('🔍 DEBUG: Form submission process completed');
    }
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };

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

    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        window.open(`mailto:fionacreations21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');

        const contactSuccessHTML = `
            <div style="text-align: center; padding: 30px 20px;">
                <div style="font-size: 3rem; color: #5e2c3e; margin-bottom: 1rem;">✓</div>
                <h2 style="color: #5e2c3e; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600;">Message Sent</h2>
                <p style="color: #666; line-height: 1.5; margin-bottom: 1rem;">
                    Thank you, <strong>${formData.name}</strong>. Your message has been sent to Fiona Creations.
                </p>
                <p style="color: #666; font-size: 0.9rem;">We will get back to you within 24 hours.</p>
            </div>
        `;

        document.getElementById('successMessage').innerHTML = contactSuccessHTML;
        openModal(successModal);
        document.getElementById('contactForm').reset();
    } catch (error) {
        showErrorModal('Message Failed', 'There was an error sending your message. Please try again.');
    }

    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Hero slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        showSlide(nextIndex);
    }

    setInterval(nextSlide, 4000);
    showSlide(0);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    initImageSliders();
    initHeroSlideshow();
});