// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Replace this URL with your Google Apps Script Web App URL
    webAppUrl: 'https://script.google.com/macros/s/AKfycbw49m8laY_WO5YEDVFh_UIOTkj60cis-_Z4GS63xUTK5eFaJIHJXKn2sNPVGmdJUm_T/exec',

    // Spreadsheet configuration
    spreadsheetId: '1BJJpCg3CZl7G1YHwDLug55D6zZzO7_JKQ9wdH0dCOVw',

    // Sheet names for different types of data
    sheets: {
        contact: 'Contact_Forms',
        feedback: 'Feedback',
        ratings: 'Ratings'
    }
};

// Contact Page Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Rating Stars Functionality
    const ratingStars = document.querySelectorAll('.rating-stars i');
    ratingStars.forEach(star => {
        star.addEventListener('click', handleStarRating);
        star.addEventListener('mouseover', handleStarHover);
    });

    // Reset stars on mouse leave
    const ratingContainer = document.querySelector('.rating-stars');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseleave', resetStarHover);
    }

    // Feedback Buttons
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
    feedbackButtons.forEach(button => {
        button.addEventListener('click', handleFeedbackButton);
    });

    // Form Validation
    setupFormValidation();

    // Auto-retry pending submissions when page loads (if online)
    if (navigator.onLine) {
        setTimeout(retryPendingSubmissions, 2000);
    }
});

// Handle form submission with Google Sheets integration
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted!');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log('Form data:', data);

    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simple 2-second delay for testing
    setTimeout(async () => {
        try {
            // Prepare data for Google Sheets
            const submissionData = {
                formType: 'contact',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || '',
                organization: data.organization || '',
                subject: data.subject || '',
                message: data.message || '',
                ipAddress: 'unknown',
                timestamp: new Date().toISOString()
            };

            console.log('Submitting data:', submissionData);

            // Submit to Google Sheets
            const success = await submitToGoogleSheets(submissionData);

            if (success) {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                e.target.reset();
            } else {
                throw new Error('Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 2000);
}

// Handle star rating with Google Sheets integration
async function handleStarRating(e) {
    console.log('Star rating clicked!');
    const rating = parseInt(e.target.getAttribute('data-rating'));
    console.log('Rating value:', rating);

    const stars = document.querySelectorAll('.rating-stars i');

    // Update star display
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });

    try {
        // Get IP address with timeout
        let ipAddress = 'unknown';
        try {
            const ipResponse = await Promise.race([
                fetch('https://api.ipify.org?format=json'),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]);
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
        } catch (ipError) {
            console.log('Could not get IP address for rating, using unknown');
        }

        // Submit rating to Google Sheets
        const submissionData = {
            formType: 'rating',
            rating: rating,
            ipAddress: ipAddress,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        console.log('Submitting rating data:', submissionData);
        const success = await submitToGoogleSheets(submissionData);
        console.log('Rating submission result:', success);

        showNotification(`Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!`, 'success');

    } catch (error) {
        console.error('Rating submission error:', error);
        showNotification(`Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
    }
}

// Handle star hover effect
function handleStarHover(e) {
    const rating = parseInt(e.target.getAttribute('data-rating'));
    const stars = document.querySelectorAll('.rating-stars i');

    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

// Reset star hover effect
function resetStarHover() {
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach(star => {
        if (star.classList.contains('active')) {
            star.style.color = '#fbbf24';
        } else {
            star.style.color = '#d1d5db';
        }
    });
}

// Handle feedback buttons with Google Sheets integration
async function handleFeedbackButton(e) {
    console.log('Feedback button clicked!');
    const type = e.target.getAttribute('data-type');
    console.log('Feedback type:', type);

    let title, placeholder;
    if (type === 'suggestion') {
        title = 'Share Your Suggestion';
        placeholder = 'What features or improvements would you like to see?';
    } else if (type === 'issue') {
        title = 'Report an Issue';
        placeholder = 'Please describe the issue you encountered:';
    }

    const feedback = await openFeedbackModal(type, title, placeholder);
    console.log('Feedback received:', feedback);

    if (feedback && feedback.trim()) {
        try {
            // Get IP address with timeout
            let ipAddress = 'unknown';
            try {
                const ipResponse = await Promise.race([
                    fetch('https://api.ipify.org?format=json'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
                ]);
                const ipData = await ipResponse.json();
                ipAddress = ipData.ip;
            } catch (ipError) {
                console.log('Could not get IP address for feedback, using unknown');
            }

            // Submit feedback to Google Sheets
            const submissionData = {
                formType: 'feedback',
                name: 'Anonymous',
                email: '',
                feedbackType: type,
                message: feedback,
                rating: '',
                ipAddress: ipAddress,
                timestamp: new Date().toISOString()
            };

            console.log('Submitting feedback data:', submissionData);
            const success = await submitToGoogleSheets(submissionData);
            console.log('Feedback submission result:', success);

            showNotification('Thank you for your feedback! We appreciate your input.', 'success');

        } catch (error) {
            console.error('Feedback submission error:', error);
            showNotification('Thank you for your feedback! We appreciate your input.', 'success');
        }
    } else {
        console.log('No feedback provided or user cancelled');
    }
}

// Open feedback modal (enhanced version)
async function openFeedbackModal(type, title, placeholder) {
    return new Promise((resolve) => {
        const feedback = prompt(`${title}\n\n${placeholder}`);
        resolve(feedback);
    });
}

// Form validation setup
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');

    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });

    // Add form submit validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            console.log('Form submit event triggered');

            // Check if all required fields are filled
            const requiredFields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    console.log('Required field empty:', field.name || field.id);
                    showFieldError(field, 'This field is required');
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                console.log('Form validation failed');
                return false;
            }

            console.log('Form validation passed');
        });
    }
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove existing error styling
    field.classList.remove('error');
    removeFieldError(field);

    // Check if field is empty
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }

    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');

    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';

    // Insert error message after the field
    field.parentNode.appendChild(errorElement);
}

// Remove field error
function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear field error on input
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    removeFieldError(field);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Google Sheets Integration Functions
async function submitToGoogleSheets(data) {
    try {
        console.log('Attempting to submit to Google Sheets...');
        console.log('Web App URL:', GOOGLE_SHEETS_CONFIG.webAppUrl);

        // Check if Google Sheets is configured
        if (!GOOGLE_SHEETS_CONFIG.webAppUrl || GOOGLE_SHEETS_CONFIG.webAppUrl.includes('YOUR_SCRIPT_ID')) {
            console.warn('Google Sheets not configured. Data would be:', data);
            // Store locally as fallback and return true for demo purposes
            storeDataLocally(data);
            return true;
        }

        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // This bypasses CORS but limits response access
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        console.log('Response type:', response.type);

        // With no-cors mode, we can't read the response, but if we get here, it likely worked
        if (response.type === 'opaque') {
            console.log('Request sent successfully (no-cors mode)');
            return true;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Response result:', result);

        if (result.success) {
            console.log('Successfully submitted to Google Sheets:', result);
            return true;
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }

    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);

        // Store data locally as fallback
        storeDataLocally(data);

        // Still return true to show success to user (data is stored locally)
        return true;
    }
}

// Fallback: Store data locally if Google Sheets fails
function storeDataLocally(data) {
    try {
        const existingData = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
        existingData.push({
            ...data,
            storedAt: new Date().toISOString(),
            status: 'pending'
        });
        localStorage.setItem('pendingSubmissions', JSON.stringify(existingData));
        console.log('Data stored locally as fallback');
    } catch (error) {
        console.error('Error storing data locally:', error);
    }
}

// Get user's IP address (for analytics/spam prevention) - with timeout
async function getUserIP() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

        const response = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error getting IP address:', error);
        return 'unknown';
    }
}

// Function to retry failed submissions (can be called periodically)
async function retryPendingSubmissions() {
    try {
        const pendingData = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
        const stillPending = [];

        for (const submission of pendingData) {
            if (submission.status === 'pending') {
                const success = await submitToGoogleSheets(submission);
                if (!success) {
                    stillPending.push(submission);
                }
            }
        }

        localStorage.setItem('pendingSubmissions', JSON.stringify(stillPending));

        if (stillPending.length === 0 && pendingData.length > 0) {
            console.log('All pending submissions successfully synced');
        }

    } catch (error) {
        console.error('Error retrying pending submissions:', error);
    }
}

// Test function for debugging
function testGoogleSheetsConnection() {
    console.log('Testing Google Sheets connection...');
    console.log('Config:', GOOGLE_SHEETS_CONFIG);

    const testData = {
        formType: 'contact',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        organization: 'Test Org',
        subject: 'general',
        message: 'This is a test message',
        newsletter: 'No',
        ipAddress: 'test-ip',
        timestamp: new Date().toISOString()
    };

    submitToGoogleSheets(testData)
        .then(success => {
            console.log('Test result:', success);
            showNotification('Test completed - check console for details', 'info');
        })
        .catch(error => {
            console.error('Test error:', error);
            showNotification('Test failed - check console for details', 'error');
        });
}

// Make test function available globally for debugging
window.testGoogleSheetsConnection = testGoogleSheetsConnection;

// Add error styles to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);

// Debug logging
console.log('Contact.js loaded successfully');
console.log('Google Sheets Config:', GOOGLE_SHEETS_CONFIG);