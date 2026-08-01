const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendEmail({ to, subject, html })
 */
module.exports = async ({ to, subject, html }) => {
  const primaryFrom = process.env.FROM_EMAIL || "onboarding@resend.dev";

  try {
    const { data, error } = await resend.emails.send({
      from: primaryFrom,
      to,
      subject,
      html,
    });

    if (error) {
      console.warn("Resend primary send error, attempting fallback via onboarding@resend.dev:", error.message);
      // Fallback to default Resend onboarding sender if domain verification failed
      const fallback = await resend.emails.send({
        from: "EDiTiV <onboarding@resend.dev>",
        to,
        subject,
        html,
      });

      if (fallback.error) {
        console.error("Resend fallback error:", fallback.error);
        throw new Error(fallback.error.message);
      }
      return fallback.data;
    }

    return data;
  } catch (err) {
    console.error("sendEmail execution error:", err);
    throw err;
  }
};

