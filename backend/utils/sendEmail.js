const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail({ to, subject, html }) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    });

    // With Ethereal, this logs a preview URL you can open to see the "sent" email
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('Preview email at:', previewUrl);
}

module.exports = sendEmail;