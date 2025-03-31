// server.js - Main server file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // For development only; restrict this in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // This should be an app password, not your regular password
    }
});

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

        // Email options for the admin notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to the same email account (admin)
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

        // Send email
        await transporter.sendMail(mailOptions);

        // Also send a confirmation email to the client
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
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

        await transporter.sendMail(clientMailOptions);

        res.status(200).json({ success: true, message: 'Your consultation request has been sent successfully!' });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ success: false, message: 'There was an error sending your request. Please try again.' });
    }
});

// API route for newsletter subscription (as a backup to Mailchimp)
app.post('/api/subscribe-newsletter', async (req, res) => {
    try {
        const { EMAIL } = req.body;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to the same email account (admin)
            subject: 'New Newsletter Subscription',
            html: `
                <h2>New Newsletter Subscription</h2>
                <p><strong>Email:</strong> ${EMAIL}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Also send a confirmation email to the subscriber
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: EMAIL,
            subject: 'Welcome to My Newsletter!',
            html: `
                <h2>Thank You for Subscribing!</h2>
                <p>You've successfully subscribed to receive updates and insights from Kate.</p>
                <p>Stay tuned for valuable content to help you grow your online presence!</p>
                <p>Best regards,<br>Kate</p>
            `
        };

        await transporter.sendMail(clientMailOptions);

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