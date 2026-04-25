
const jwt = require("jsonwebtoken");

const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null; // ✅ guest user
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    req.user = null; // ✅ invalid token → treat as guest
    next();
  }
};

module.exports = optionalAuthMiddleware;