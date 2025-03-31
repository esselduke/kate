const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
        
        const { 
            name, 
            company, 
            email, 
            phone, 
            service, 
            'selected-package': selectedPackage, 
            budget, 
            goals 
        } = req.body;

        // Format services array for email
        const services = Array.isArray(service) ? service.join(', ') : service;

        // Email to admin
        const adminMsg = {
            to: process.env.EMAIL_USER,
            from: process.env.EMAIL_USER, // Must be verified in SendGrid
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

        await sgMail.send(adminMsg);
        console.log('Admin email sent successfully');

        // Confirmation email to client
        const clientMsg = {
            to: email,
            from: process.env.EMAIL_USER, // Must be verified in SendGrid
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

        await sgMail.send(clientMsg);
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
        const adminMsg = {
            to: process.env.EMAIL_USER,
            from: process.env.EMAIL_USER,
            subject: 'New Newsletter Subscription',
            html: `
                <h2>New Newsletter Subscription</h2>
                <p><strong>Email:</strong> ${EMAIL}</p>
            `
        };

        await sgMail.send(adminMsg);

        // Confirmation to subscriber
        const clientMsg = {
            to: EMAIL,
            from: process.env.EMAIL_USER,
            subject: 'Welcome to My Newsletter!',
            html: `
                <h2>Thank You for Subscribing!</h2>
                <p>You've successfully subscribed to receive updates and insights from Kate.</p>
                <p>Stay tuned for valuable content to help you grow your online presence!</p>
                <p>Best regards,<br>Kate</p>
            `
        };

        await sgMail.send(clientMsg);

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