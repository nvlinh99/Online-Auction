const joi = require("joi");
const md5 = require("md5");
const bcrypt = require("bcrypt");

const UserModel = require("../../model/user");
const UserConstant = require("../../constant/user");
const configuration = require("../../configuration");
const genRequestValidation = require("../../middleware/gen-request-validation");

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      token: joi.string().trim().required().invalid("", null),
      password: joi.string().trim().required().invalid("", null),
      confirmPassword: joi.string().trim().required().invalid("", null),
    })
    .unknown(false),
});

const resetPasswordHandler = async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.json({
      code: -1000,
      data: {
        message: "Mật khẩu và xác nhận mật khẩu không giống nhau.",
      },
    });
  }
  console.log(md5(token));
  const user = await UserModel.findOne({
    verifyCode: md5(token),
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
  console.log("run ");
  const hasedPassword = await new Promise((rsl, rjt) => {
    bcrypt.hash(password, configuration.bcryptSaltRounds, (err, hashed) => {
      if (err) return rjt(err);
      rsl(hashed);
    });
  });

  const updatedUser = await UserModel.findOneAndUpdate(
    { id: user.id },
    {
      $set: { verifyCode: null, password: hasedPassword },
    },
    { new: true }
  );
  if (!updatedUser) {
    return res.json({
      code: -1000,
      data: {
        message: "Cập nhật mật khẩu thất bại",
      },
    });
  }
  res.json({
    code: 1000,
    data: {
      message: "Cập nhật mật khẩu thành công",
    },
  });
};
module.exports = [requestValidationHandler, resetPasswordHandler];
