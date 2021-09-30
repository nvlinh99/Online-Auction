const path = require("path");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const envPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: envPath });

exports.authorize = async (req, res, next) => {
  // Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({
      message: "Bạn không đăng nhập! Vui lòng đăng nhập để có quyền truy cập!",
    });
  }
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  req.user = decoded.id;
  next();
};
