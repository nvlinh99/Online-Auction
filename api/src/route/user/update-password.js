const joi = require("joi");
const md5 = require("md5");
const bcrypt = require("bcrypt");

const UserModel = require("../../model/user");
const UserConstant = require("../../constant/user");
const configuration = require("../../configuration");
const genRequestValidation = require("../../middleware/gen-request-validation");
const passwordValidator = require("../../util/passwordValidator");

const requestValidationHandler = genRequestValidation({
  body: joi
    .object({
      oldPassword: joi.string().trim().required().invalid("", null),
      password: joi.string().trim().required().invalid("", null),
      confirmPassword: joi.string().trim().required().invalid("", null),
    })
    .unknown(false),
});

const updatePasswordHandler = async (req, res) => {
  const { password, confirmPassword, oldPassword } = req.body;
  const id = req.user;
  if (password !== confirmPassword) {
    return res.json({
      code: -1000,
      data: {
        message: "Mật khẩu và xác nhận mật khẩu không giống nhau.",
      },
    });
  }

  const user = await UserModel.findOne({
    id,
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
  if (
    !(await passwordValidator.verifyHashedPassword(oldPassword, user.password))
  ) {
    return res.json({
      code: -1000,
      data: {
        message: "Mật khẩu cũ không chính xác",
      },
    });
  }
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
      message: "Cập nhật mật khẩu thành công ",
    },
  });
};
module.exports = [requestValidationHandler, updatePasswordHandler];
