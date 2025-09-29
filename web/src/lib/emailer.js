import nodemailer from "nodemailer";

// Create a transporter for SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'zolookorzoloo@gmail.com',
    pass: process.env.GMAIL_API_KEY,
  },
});

export const sendEmail = async (html, email) => {
  try {
    await transporter.sendMail({
      from: 'zolookorzoloo@gmail.com', 
      to: email,
      subject: "Fitness app OTP",
      html: html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};