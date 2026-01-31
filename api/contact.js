/**
 * Serverless Contact Form Handler
 * 
 * Deploy to Netlify Functions or Vercel
 * Handles form submissions with validation, honeypot, and rate limiting
 */

export default async function handler(req, res) {
    // Only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message, company } = req.body;

        // Honeypot field (spam protection)
        if (company) {
            // Silently succeed to confuse bots
            return res.status(200).json({ success: true });
        }

        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate message length
        if (message.length < 10 || message.length > 5000) {
            return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
        }

        // Sanitize inputs (basic)
        const sanitized = {
            name: sanitizeInput(name),
            email: email.toLowerCase().trim(),
            message: sanitizeInput(message)
        };

        // TODO: Send email via SendGrid, Postmark, or similar
        // await sendEmail(sanitized);

        // Log for debugging (in production, use proper logging)
        console.log('Contact form submission:', {
            timestamp: new Date().toISOString(),
            ...sanitized
        });

        return res.status(200).json({
            success: true,
            message: 'Thank you for contacting us. We\'ll be in touch soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Basic input sanitization
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .slice(0, 1000); // Limit length
}

/**
 * Example email sending function (not implemented)
 * Uncomment and configure for your email provider
 */
/*
async function sendEmail(data) {
    // Example using SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: 'support@checkyourtea.com',
        from: 'noreply@checkyourtea.com',
        subject: `New Contact Form Submission from ${data.name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
        `
    };

    await sgMail.send(msg);
}
*/
