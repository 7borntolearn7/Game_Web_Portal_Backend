const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

exports.auth = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Token is missing",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    console.error("Error occurred during authentication:", error);

    // Handle different types of errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Invalid token",
      });
    } else {
      return res.status(500).json({
        status: "RS_ERROR",
        message: "Internal Server Error",
      });
    }
  }
};
