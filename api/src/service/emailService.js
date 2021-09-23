/* eslint-disable no-console */
const path = require("path");
const nodemailer = require("nodemailer");

const envPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: envPath });
console.log(process.env.EMAIL_HOST);

class EmailService {
  constructor(user) {
    this.to = user.email;
    this.displayName = user.name;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    };
    await this.newTransport().sendMail(mailOptions, (err, response) => {
      if (err) {
        console.log(err);
      }
      console.log(response);
    });
  }

  async sendResetPasswordCode(verifyCode) {
    const template = `Your verify code is: ${verifyCode}. Don't share it with anyone.`;
    await this.send(template, "Reset your password!");
  }

  async sendOTPCode(otpCode) {
    const template = `Your OTP code is: ${otpCode}.`;
    await this.send(template, "Verify OTP Code!");
  }
}

module.exports = EmailService;
