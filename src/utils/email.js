import nodemailer from 'nodemailer';

// Create a generic transporter. 
// For a real app, you would use SendGrid, Mailgun, or Gmail SMTP via environment variables.
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER || 'ethereal_user',
    pass: process.env.EMAIL_PASS || 'ethereal_pass'
  }
});

export const sendBudgetExceededEmail = async (email, categoryName, amount, limit) => {
  try {
    const mailOptions = {
      from: '"Finance Tracker" <alerts@financetracker.local>',
      to: email,
      subject: `🚨 Budget Exceeded for ${categoryName}`,
      text: `Hello, you have exceeded your budget for ${categoryName}.\nYou have spent ${amount}, but your limit was ${limit}. Please review your expenses.`,
    };

    // In a real environment with correct credentials, this would send an email.
    // For now, we just attempt it and catch the auth error gracefully, or log it.
    if (process.env.EMAIL_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${email} for exceeding budget in ${categoryName}`);
    } else {
      console.log(`[MOCK EMAIL] To: ${email} | Subject: ${mailOptions.subject}`);
    }
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};
