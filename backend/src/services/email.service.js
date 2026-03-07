const nodemailer = require("nodemailer");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test connection (optional)
const verifyEmailConfig = async () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️  Email service not configured (SMTP_USER/SMTP_PASS missing)");
    return false;
  }
  try {
    await transporter.verify();
    console.log("✅ Email service ready");
    return true;
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
};

// Send email helper
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 Email skipped (not configured):", subject);
    return { success: false, message: "Email service not configured" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"ATS System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("📧 Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return { success: false, error: error.message };
  }
}

// Template: Application Received
function applicationReceivedEmail(candidateName, jobTitle) {
  const subject = `Application Received - ${jobTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">Application Received</h2>
      <p>Dear ${candidateName},</p>
      <p>Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
      <p>We have received your application and our team will review it shortly. You will be notified about the next steps via email.</p>
      <br>
      <p>Best regards,<br><strong>Recruitment Team</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
  return { subject, html, text: `Application received for ${jobTitle}` };
}

// Template: Status Update
function statusUpdateEmail(candidateName, jobTitle, newStatus) {
  const statusMessages = {
    SHORTLISTED: {
      title: "🎉 Congratulations! You've Been Shortlisted",
      message: "We are impressed with your profile and would like to move forward with your application.",
      color: "#7c3aed",
    },
    REJECTED: {
      title: "Application Update",
      message: "After careful consideration, we have decided to move forward with other candidates at this time. We appreciate your interest and wish you the best in your job search.",
      color: "#ef4444",
    },
    HIRED: {
      title: "🎊 Welcome Aboard!",
      message: "We are thrilled to offer you the position! Our HR team will contact you shortly with further details.",
      color: "#10b981",
    },
  };

  const config = statusMessages[newStatus] || {
    title: "Application Status Updated",
    message: `Your application status has been updated to: ${newStatus}`,
    color: "#6b7280",
  };

  const subject = `${config.title} - ${jobTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${config.color};">${config.title}</h2>
      <p>Dear ${candidateName},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Status:</strong> ${newStatus}</p>
      </div>
      <p>${config.message}</p>
      <br>
      <p>Best regards,<br><strong>Recruitment Team</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
  return { subject, html, text: `Your application status: ${newStatus}` };
}

// Template: Interview Scheduled
function interviewScheduledEmail(candidateName, jobTitle, interviewDate, interviewLink) {
  const subject = `Interview Scheduled - ${jobTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">🎯 Interview Scheduled</h2>
      <p>Dear ${candidateName},</p>
      <p>We are pleased to invite you for an interview for the <strong>${jobTitle}</strong> position.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${interviewDate}</p>
        ${interviewLink ? `<p style="margin: 5px 0;"><strong>🔗 Join Link:</strong> <a href="${interviewLink}" style="color: #7c3aed;">${interviewLink}</a></p>` : ""}
      </div>
      <p>Please confirm your availability at your earliest convenience.</p>
      <p>We look forward to speaking with you!</p>
      <br>
      <p>Best regards,<br><strong>Recruitment Team</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
  return { subject, html, text: `Interview scheduled for ${jobTitle} on ${interviewDate}` };
}

module.exports = {
  sendEmail,
  verifyEmailConfig,
  applicationReceivedEmail,
  statusUpdateEmail,
  interviewScheduledEmail,
};
