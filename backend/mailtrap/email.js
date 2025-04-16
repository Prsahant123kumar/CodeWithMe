const { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } = require("./htmlEmail");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


const sendVerificationEmail = expressAsyncHandler(async (email, verificationToken) => {
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Verify your email',
    html: htmlContent.replace("{verificationToken}", verificationToken)
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});






const sendWelcomeEmail = expressAsyncHandler(async (email, name) => {
  const htmlContent = generateWelcomeEmailHtml(name);
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Welcome to CodeWithMe',
    html: htmlContent,
    template_variables: {
      company_info_name: "CodeWithMe",
      name: name
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
});


const sendPasswordResetEmail = expressAsyncHandler(async (email, resetURL) => {
  const htmlContent = generatePasswordResetEmailHtml(resetURL);
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Reset your password',
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to reset password   "+error.message);
  }
});



const sendResetSuccessEmail = expressAsyncHandler(async (email) => {
  const htmlContent = generateResetSuccessEmailHtml();
  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Password Reset Successfully',
    html: htmlContent,
    category: "Password Reset"
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password reset success email   "+error.message);
  }
});



module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
};
