const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async ({ subject, text }) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject,
    text
  });
};
