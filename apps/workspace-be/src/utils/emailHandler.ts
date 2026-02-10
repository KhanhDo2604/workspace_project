import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const emailTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await emailTransport.sendMail({
      from: "no-reply@collaborative-workspace.com",
      to: to,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
