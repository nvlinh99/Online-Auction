/* eslint-disable no-console */
const path = require('path')
const _  = require('lodash')
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

  async winner(product, winner, price) {
    const template = `<p>Chúc mừng <strong>${winner}</strong> là người chiến thắng trong phiên đấu giá sản phẩm <strong>${product}</strong> với giá <strong>${price}</strong>.</p>`
    await this.send(template, '[Online Auction] - Đấu giá kết thúc!')
  }

  async sendToSellerHasWinner(productName, winnerName, price) {
    const template = `<p>Sản phẩm <strong>${productName}</strong> của bạn đã đã được <strong>${winnerName}</strong> đấu giá chiến thắng với giá <strong>${price}<strong>.</p>`
    await this.send(template, '[Online Auction] - Đấu giá kết thúc!')
  }

  async newBid(bidder, product, price, productId) {
    const template = `<p><strong>${bidder}</strong> vừa ra giá thành công sản phẩm <a target="_blank" href="${configuration.client.host}/products/${productId}"><strong>${product}</strong></a> với giá <strong>${price}</strong> trên hệ thống Online Auction.</p>`
    await this.send(template, '[Online Auction] - Lượt ra giá mới!')
  }

  async sendToSellerNewBid(bidder, product, price, productId) {
    const template = `<p>Sản phẩm của bạn - <strong>${product}</strong> vừa được <a target="_blank" href="${configuration.client.host}/products/${productId}"><strong>${bidder}</strong></a> ra giá thành công  với giá <strong>${price}</strong> trên hệ thống Online Auction.</p>`
    await this.send(template, '[Online Auction] - Lượt ra giá mới!')
  }

  async update(product) {
    const template = `<p>Giá của sản phẩm <strong>${product}<strong> vừa cập nhật thành công.</p>`
    await this.send(template, '[Online Auction] - Cập nhật giá sản phẩm!')
  }

  async productUpdateDesc(product, productId, desc) {
    const template = _.template(`
    <p>Sản phẩm <a target="_blank" href="<%= clientHost %>/products/<%= productId %>"><strong><%= product %><strong></a> vừa cập nhật mô tả.</p>
    <div style="border: solid 1px #ddd; padding: 1rem;">
    <%= desc %>
    <div>
    `)({ clientHost: configuration.client.host, product, productId, desc })
    await this.send(template, '[Online Auction] - Cập nhật mô tả sản phẩm!')
  }
}

module.exports = EmailService
