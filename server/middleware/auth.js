/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Middleware to verify JWT token from request headers.
 * Ensures that protected routes are accessed only by authenticated users.
 */
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // If no token is found, return unauthorized
  if (!token) {
    return res.status(401).json({
      msg: 'No token, authorization denied'
    });
  }

  try {
    // Verify the token using the secret from config
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Attach user information to the request object
    req.user = { username: decoded.user };
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return unauthorized
    return res.status(401).json({
      msg: 'Token is not valid'
    });
  }
};
