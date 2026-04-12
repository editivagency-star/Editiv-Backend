const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail({ to, subject, html })
 */
module.exports = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return data;
};
