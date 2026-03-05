import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const emailTemplates = {
  welcomeEmail: (name: string, emailAddr: string) => ({
    subject: '🙏 Welcome to Our Church Community',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome, ${name}!</h1>
        <p>We are delighted to have you join our church community.</p>
        <p>Explore our sermons, events, and ways to get involved.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit Our Website</a>
      </div>
    `,
  }),

  eventNotification: (eventName: string, date: string, link: string) => ({
    subject: `📅 You're Registered for: ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Event Registration Confirmed</h1>
        <p>Thank you for registering for <strong>${eventName}</strong></p>
        <p><strong>Date:</strong> ${date}</p>
        <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Event Details</a>
      </div>
    `,
  }),

  donationReceipt: (name: string, amount: string, date: string) => ({
    subject: '🙏 Thank You For Your Generous Donation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Donation Received - ${amount}</h1>
        <p>Dear ${name},</p>
        <p>Thank you for your generous donation of <strong>${amount}</strong> on ${date}.</p>
        <p>Your contribution helps us serve our community better.</p>
        <p>May God bless you abundantly.</p>
      </div>
    `,
  }),

  contactFormResponse: (name: string, subject: string) => ({
    subject: `Re: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>We Received Your Message</h1>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us about "${subject}".</p>
        <p>We will get back to you as soon as possible.</p>
      </div>
    `,
  }),
};

export const email = {
  // Send using Resend (preferred)
  sendViaResend: async (
    to: string,
    subject: string,
    html: string,
    from?: string
  ) => {
    try {
      const response = await resend.emails.send({
        from: from || 'noreply@elimthronerm.com',
        to,
        subject,
        html,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to send email via Resend: ${error}`);
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (name: string, emailAddr: string) => {
    const template = emailTemplates.welcomeEmail(name, emailAddr);
    return email.sendViaResend(emailAddr, template.subject, template.html);
  },

  // Send event notification
  sendEventNotification: async (
    emailAddr: string,
    eventName: string,
    date: string,
    link: string
  ) => {
    const template = emailTemplates.eventNotification(eventName, date, link);
    return email.sendViaResend(emailAddr, template.subject, template.html);
  },

  // Send donation receipt
  sendDonationReceipt: async (
    emailAddr: string,
    name: string,
    amount: string,
    date: string
  ) => {
    const template = emailTemplates.donationReceipt(name, amount, date);
    return email.sendViaResend(emailAddr, template.subject, template.html);
  },

  // Send contact form response
  sendContactFormResponse: async (
    emailAddr: string,
    name: string,
    subject: string
  ) => {
    const template = emailTemplates.contactFormResponse(name, subject);
    return email.sendViaResend(emailAddr, template.subject, template.html);
  },

  // Send raw email
  sendRawEmail: async (to: string, subject: string, html: string) => {
    return email.sendViaResend(to, subject, html);
  },
};

// Fallback nodemailer configuration (for local testing)
export const getNodemailerTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};
