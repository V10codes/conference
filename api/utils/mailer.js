import nodemailer from "nodemailer";

export const mailer = async (email, message) => {
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
      subject: "Notification from Conference Team",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">📢 Message</h2>
          <p style="font-size: 1.1em; margin-bottom: 20px;">${
            message || "No message provided."
          }</p>
          <p style="font-size: 0.9em; color: #555; text-align: center;">
            If you have any questions, feel free to reply to this email.
          </p>
          <p style="text-align: center; margin-top: 20px;">Best regards,<br><strong>The Conference Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
