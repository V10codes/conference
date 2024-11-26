import nodemailer from "nodemailer";

export const mailer = async (email, registrationId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: "postmaster@sandbox0e7c25e04ee04334be5952ce544b91e0.mailgun.org",
        pass: process.env.MAILGUN_API_PASS,
      },
    });

    const mailOptions = {
      from: "postmaster@sandbox0e7c25e04ee04334be5952ce544b91e0.mailgun.org",
      to: email,
      subject: "Conference Approval Confirmation",
      text: `You have been approved for registration ID: ${registrationId}.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
