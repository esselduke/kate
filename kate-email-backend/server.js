const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mailgun = require('mailgun-js');

// Load environment variables
dotenv.config();

// Simple tracker for recent submissions
const recentSubmissions = new Map();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Mailgun
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Middleware
app.use(cors({
    origin: '*', // For development only
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API route for consultation form
app.post('/api/send-consultation', async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        
        // Create a simple signature of this request to detect duplicates
        const { email, phone } = req.body;
        const requestSignature = `${email}-${phone}`;
        
        // Check if we've seen this exact request recently (within last 5 seconds)
        const now = Date.now();
        if (recentSubmissions.has(requestSignature)) {
            const lastTime = recentSubmissions.get(requestSignature);
            if (now - lastTime < 5000) { // 5 seconds
                console.log('Duplicate submission detected, ignoring');
                return res.status(200).json({ 
                    success: true, 
                    message: 'Your consultation request has been sent successfully!' 
                });
            }
        }
        
        // Store this submission time
        recentSubmissions.set(requestSignature, now);
        
        // Clean up old entries every minute
        setTimeout(() => {
            const currentTime = Date.now();
            for (const [key, timestamp] of recentSubmissions.entries()) {
                if (currentTime - timestamp > 60000) { // 1 minute
                    recentSubmissions.delete(key);
                }
            }
        }, 60000);
        
        const { 
            name, 
            company, 
            service, 
            'selected-package': selectedPackage, 
            budget, 
            goals 
        } = req.body;

        // Format services array for email
        const services = Array.isArray(service) ? service.join(', ') : service;

        // Email to admin
        const adminData = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: process.env.EMAIL_USER,
            subject: 'New Consultation Request',
            html: `
                <h2>New Consultation Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Services Interested In:</strong> ${services}</p>
                <p><strong>Selected Package:</strong> ${selectedPackage}</p>
                <p><strong>Budget Range:</strong> ${budget}</p>
                <p><strong>Goals:</strong> ${goals}</p>
            `
        };

        await mg.messages().send(adminData);
        console.log('Admin email sent successfully');

        // Confirmation email to client
        const clientData = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Thank You for Your Interest',
            html: `
                <h2>Thank You for Reaching Out!</h2>
                <p>Hello ${name},</p>
                <p>Thank you for your interest in our services. We've received your consultation request and will get back to you shortly.</p>
                <p>Here's a summary of what you shared with us:</p>
                <ul>
                    <li><strong>Services Interested In:</strong> ${services}</li>
                    <li><strong>Selected Package:</strong> ${selectedPackage}</li>
                    <li><strong>Budget Range:</strong> ${budget}</li>
                </ul>
                <p>If you have any immediate questions, feel free to reply to this email.</p>
                <p>Best regards,<br>Kate</p>
            `
        };

        await mg.messages().send(clientData);
        console.log('Client email sent successfully');

        res.status(200).json({ success: true, message: 'Your consultation request has been sent successfully!' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ success: false, message: 'There was an error sending your request. Please try again.' });
    }
});

// API route for newsletter
app.post('/api/subscribe-newsletter', async (req, res) => {
    try {
        const { EMAIL } = req.body;

        // Admin notification
        const adminData = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: process.env.EMAIL_USER,
            subject: 'New Newsletter Subscription',
            html: `
                <h2>New Newsletter Subscription</h2>
                <p><strong>Email:</strong> ${EMAIL}</p>
            `
        };

        await mg.messages().send(adminData);

        // Confirmation to subscriber
        const clientData = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: EMAIL,
            subject: 'Welcome to My Newsletter!',
            html: `
                <h2>Thank You for Subscribing!</h2>
                <p>You've successfully subscribed to receive updates and insights from Kate.</p>
                <p>Stay tuned for valuable content to help you grow your online presence!</p>
                <p>Best regards,<br>Kate</p>
            `
        };

        await mg.messages().send(clientData);

        res.status(200).json({ success: true, message: 'You have been subscribed successfully!' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ success: false, message: 'There was an error with your subscription. Please try again.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});