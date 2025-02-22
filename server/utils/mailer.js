import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Crypto Admin" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendTransactionAlert = async (transaction, recipient) => {
  const subject = `Transaction Alert: ${transaction.status.toUpperCase()}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Transaction ${transaction.status.toUpperCase()}</h2>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Amount:</strong> ${transaction.amount} ${transaction.currency}</p>
        <p><strong>Network:</strong> ${transaction.network}</p>
        <p><strong>Wallet:</strong> ${transaction.walletAddress}</p>
        <p><strong>Status:</strong> ${transaction.status}</p>
        <p><strong>Time:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
      </div>
      <p>Please check your admin panel for more details.</p>
    </div>
  `;

  return sendMail({
    to: recipient,
    subject,
    html
  });
};