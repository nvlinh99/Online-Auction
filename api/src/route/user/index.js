const { Router } = require("express");
const registerController = require("./register");
const registerConfirmationHandler = require("./register-confirmation");
const forgetPasswordHandler = require("./forget-password");

exports.path = "/users";

const userRouter = Router();
userRouter.post("/register", registerController);
userRouter.get("/register/confirmation", registerConfirmationHandler);
userRouter.post("/forget-password", forgetPasswordHandler);
exports.router = userRouter;
