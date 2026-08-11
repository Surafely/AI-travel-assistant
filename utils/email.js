const axios = require('axios');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;

    this.from = {
      email: process.env.MAILERSEND_FROM_EMAIL,
      name: process.env.MAILERSEND_FROM_NAME || 'Surafel Yigezu',
    };
  }

  // Send email via MailerSend API
  async sendViaMailerSend({ subject, html, text }) {
    const apiKey = process.env.MAILERSEND_API_KEY;

    if (!apiKey || !this.from.email) {
      throw new Error(
        'Email is not configured. Set MAILERSEND_API_KEY and MAILERSEND_FROM_EMAIL.',
      );
    }

    await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        from: this.from,
        to: [
          {
            email: this.to,
            name: this.firstName,
          },
        ],
        subject,
        html,
        text: text || htmlToText(html),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  // Render template and send email
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    await this.sendViaMailerSend({
      subject,
      html,
      text: htmlToText(html),
    });
  }

  // Send welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the AI-Travel-Assistant Family! 🎉');
  }

  // Send password reset email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 min)',
    );
  }
};
