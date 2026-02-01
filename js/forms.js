// Forms Module - Validation & Submission

const Forms = {
    contactForm: null,

    init() {
        this.contactForm = document.getElementById('contactForm');
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    },

    async handleContactSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            company: formData.get('company') // Honeypot
        };

        // Validate
        if (!this.validateContactForm(data)) {
            this.showMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Honeypot check
        if (data.company) {
            console.log('Honeypot triggered');
            this.showMessage('Thank you for your submission!', 'success');
            form.reset();
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: data.message
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit form');
            }

            this.showMessage('Thank you! We\'ll be in touch soon.', 'success');
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('An error occurred. Please try again.', 'error');
        }
    },

    validateContactForm(data) {
        if (!data.name || !data.email || !data.message) {
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        return true;
    },

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            background-color: ${type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
            color: ${type === 'success' ? '#10b981' : '#ef4444'};
            border: 1px solid ${type === 'success' ? '#10b981' : '#ef4444'};
        `;

        const form = this.contactForm;
        form.parentElement.insertBefore(messageDiv, form);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    Forms.init();
});
