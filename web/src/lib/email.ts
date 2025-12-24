import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || '"JITTED Editorial" <no-reply@jitted.org>';

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST) {
    console.log("---------------------------------------------------");
    console.log(`[Email Dev Mode] To: ${to}`);
    console.log(`[Email Dev Mode] Subject: ${subject}`);
    console.log("---------------------------------------------------");
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendSubmissionReceivedEmail(to: string, userName: string, title: string) {
  const subject = "Submission Received: JITTED";
  const html = `
    <h1>Submission Received</h1>
    <p>Dear ${userName},</p>
    <p>Thank you for submitting your manuscript "<strong>${title}</strong>" to the Journal of Information Technology and Teacher Education.</p>
    <p>Your submission has been received and will undergo initial vetting shortly.</p>
    <p>You can track the status of your submission in your <a href="${process.env.NEXTAUTH_URL}/dashboard/author">dashboard</a>.</p>
    <br>
    <p>Best regards,</p>
    <p>The Editorial Team</p>
  `;
  await sendEmail({ to, subject, html });
}

export async function sendReviewerInvitationEmail(to: string, reviewerName: string, title: string, abstract: string) {
  const subject = "Review Invitation: JITTED";
  const html = `
    <h1>Invitation to Review</h1>
    <p>Dear ${reviewerName},</p>
    <p>We would like to invite you to review the following manuscript submitted to JITTED:</p>
    <p><strong>Title:</strong> ${title}</p>
    <p><strong>Abstract:</strong> ${abstract}</p>
    <p>Please log in to your <a href="${process.env.NEXTAUTH_URL}/dashboard/reviewer">reviewer dashboard</a> to accept or decline this invitation.</p>
    <br>
    <p>Best regards,</p>
    <p>The Editorial Team</p>
  `;
  await sendEmail({ to, subject, html });
}

export async function sendDecisionEmail(to: string, authorName: string, title: string, decision: string, comment?: string) {
  const subject = `Decision on Manuscript: ${title}`;
  let decisionText = "";
  
  switch (decision) {
    case "ACCEPTED":
      decisionText = "We are pleased to inform you that your manuscript has been <strong>ACCEPTED</strong> for publication.";
      break;
    case "REJECTED":
      decisionText = "We regret to inform you that your manuscript has been <strong>REJECTED</strong>.";
      break;
    case "REVISION_REQUESTED":
      decisionText = "Your manuscript requires <strong>REVISIONS</strong> before it can be reconsidered.";
      break;
    default:
      decisionText = `A decision of <strong>${decision}</strong> has been made.`;
  }

  const html = `
    <h1>Decision Notification</h1>
    <p>Dear ${authorName},</p>
    <p>Regarding your submission "<strong>${title}</strong>":</p>
    <p>${decisionText}</p>
    ${comment ? `<h3>Editor's Comments:</h3><p>${comment}</p>` : ""}
    <p>Please log in to your <a href="${process.env.NEXTAUTH_URL}/dashboard/author">dashboard</a> for more details.</p>
    <br>
    <p>Best regards,</p>
    <p>The Editorial Team</p>
  `;
  await sendEmail({ to, subject, html });
}

export async function sendVettingRejectionEmail(to: string, authorName: string, title: string) {
    const subject = `Update on Manuscript: ${title}`;
    const html = `
      <h1>Submission Update</h1>
      <p>Dear ${authorName},</p>
      <p>Thank you for submitting "<strong>${title}</strong>" to JITTED.</p>
      <p>After initial vetting, we regret to inform you that we are unable to proceed with your submission at this time. It may not meet our scope or submission guidelines.</p>
      <p>Please log in to your <a href="${process.env.NEXTAUTH_URL}/dashboard/author">dashboard</a> for more details.</p>
      <br>
      <p>Best regards,</p>
      <p>The Editorial Team</p>
    `;
    await sendEmail({ to, subject, html });
}
