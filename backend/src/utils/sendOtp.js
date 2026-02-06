import nodemailer from "nodemailer";

export default async function sendOtp(email, otp) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"DocTrek" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}.It will expire in 5 minutes`,
  };

  await transporter.sendMail(mailOptions);
}

export  async function sendApproveEmail(email) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"DocTrek" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Clinic status for DocTrek login",
    text: `Your account has been approved, now you can login and use DocTrek`,
  };

  await transporter.sendMail(mailOptions);
}

export  async function sendRejectEmail(email) {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"DocTrek" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your Clinic status for DocTrek login",
    text: `Your account request has been rejected.
Please contact our admin team for further information or support.`,
  };

  await transporter.sendMail(mailOptions);
}
