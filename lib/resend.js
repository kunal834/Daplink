import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, html) {
  return await resend.emails.send({
    from: "DapLink <noreply@daplink.online>", // Changed .dev to .online
    to: to,
    subject: subject,
    html: html,
  });
}