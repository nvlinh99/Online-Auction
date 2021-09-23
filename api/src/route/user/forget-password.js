const joi = require("joi");
const md5 = require("md5");
const UserModel = require("../../model/user");
const UserConstant = require("../../constant/user");
const configuration = require("../../configuration");
const genRequestValidation = require("../../middleware/gen-request-validation");
const SendEmailService = require("../../service/emailService");
const crypto = require("crypto");

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      email: joi.string().email().required().invalid("", null),
    })
    .unknown(false),
});

const forgetPasswordHandler = async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({
    email,
    status: UserConstant.USER_STATUS.ACTIVE,
  });
  if (!user) {
    return res.json({
      code: -1000,
      data: {
        message: "Tài khoản không tồn tại",
      },
    });
  }
  const verifyCode = await new Promise((rsl, rjt) => {
    crypto.randomBytes(configuration.verifyCodeBytesLength, (err, buf) => {
      if (err) return rjt(err);
      rsl(buf.toString("base64"));
    });
  });
  const hashedVerifyCode = md5(verifyCode);
  const updatedUser = await UserModel.findOneAndUpdate(
    { id: user.id },
    {
      $set: { verifyCode: hashedVerifyCode },
    },
    { new: true }
  );
  if (!updatedUser) {
    return res.json({
      code: -1000,
      data: {
        message: "Gửi yêu cầu thất bại!",
      },
    });
  }
  res.json({
    code: 1000,
    data: {
      message: "Gửi yêu cầu thành công",
    },
  });
  console.log(updatedUser);
  const sendEmailService = new SendEmailService({
    name: `${updatedUser.firstName} ${updatedUser.lastName}`,
    email: updatedUser.email,
  });

  const confirmationLink = `${
    configuration.client.host
  }/forget-password?token=${encodeURIComponent(verifyCode)}`;
  const content = getConfirmationEmailContent(confirmationLink);
  sendEmailService.send(content, "[AUCTION ONLINE] - Quên mật khẩu");
};
function getConfirmationEmailContent(link) {
  return `
    <p>Bạn vừa gửi yêu cầu forget mật khẩu, Ấn vào link bên dưới đẻ thực hiện forget mật khẩu</p>
    <a href="${link}"><p>${link}</p></a>
  `;
}
module.exports = [requestValidationHandler, forgetPasswordHandler];
