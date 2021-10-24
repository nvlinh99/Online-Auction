/* eslint-disable no-console */
const path = require('path')
const nodemailer = require('nodemailer')

const configuration = require('../configuration')

const envPath = path.join(__dirname, '../../.env')
require('dotenv').config({ path: envPath, })

class EmailService {
  constructor(user) {
    this.to = user.email
    this.displayName = user.name
    this.from = process.env.EMAIL_FROM
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
    })
  }

  async send(template, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: template,
    }
    await this.newTransport().sendMail(mailOptions, (err, response) => {
      if (err) {
        console.log(err)
      }
      console.log(response)
    })
  }
  
  async sendConfirmMail(verifyCode) {
    const template = `
      <p>Bạn vừa đăng kí tài khoản trên hệ thống Online Auction.</p>
      <p>Vui lòng click vào link bên dưới để xác nhận tài khoản (link có hiệu lực trong vòng <strong>${configuration.verifyCodeExpireTimeInMin} phút</strong>). Nếu không phải là bạn, xin vui lòng bỏ qua email này.</p>
      <p><a href='${configuration.server.host}/users/register/confirmation?token=${encodeURIComponent(verifyCode)}' target='_blank'> CLICK VÀO ĐÂY</a> để xác nhận tài khoản.</p>
    `
    await this.send(template, '[Online Auction] - Xác nhận đăng ký tài khoản!')
  }

  async sendResetPassword(verifyCode) {
    const template = `
    <p>Bạn vừa gửi yêu cầu Quên mật khẩu. </p>
    <p>Vui lòng click vào link bên dưới để đổi mật khẩu (link có hiệu lực trong vòng <strong>${configuration.verifyCodeExpireTimeInMin} phút </strong>). Nếu không phải là bạn, xin vui lòng bỏ qua email này.</p>
    <p><a href='${configuration.client.host}/forget-password?token=${encodeURIComponent(verifyCode)}' target='_blank'> CLICK VÀO ĐÂY</a> để đổi mật khẩu.</p>
    `
    await this.send(template, '[Online Auction] - Quên mật khẩu')
  }

  async reject(seller, product) {
    const template = `
      <p>Bạn vừa bị <strong>${seller}</strong> từ chối ra giá sản phẩm <strong>${product}</strong> trên hệ thống Online Auction.</p>
    `
    await this.send(template, '[Online Auction] - Từ chối ra giá!')
  }

  async noWinner(product) {
    const template = `
      <p>Đã kết thúc đấu giá! Sản phẩm <strong>${product}</strong> của bạn trên hệ thống Online Auction vẫn chưa có người đấu giá.</p>`
    await this.send(template, '[Online Auction] - Không có người mua!')
  }

  async winner(product, winner) {
    const template = `<p>Chúc mừng <strong>${winner}</strong> là người chiến thắng trong phiên đấu giá sản phẩm <strong>${product}</strong>.</p>`
    await this.send(template, '[Online Auction] - Đấu giá kết thúc!')
  }

  async bid(bidder, product) {
    const template = `<p><strong>${bidder}</strong> vừa ra giá thành công sản phẩm <strong>${product}</strong> trên hệ thống Online Auction.</p>`
    await this.send(template, '[Online Auction] - Ra giá thành công!')
  }

  async update(product) {
    const template = `<p>Giá của sản phẩm <strong>${product}<strong> vừa cập nhật thành công.</p>`
    await this.send(template, '[Online Auction] - Cập nhật giá sản phẩm!')
  }
}

module.exports = EmailService
