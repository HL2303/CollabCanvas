// server/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if there's a header
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // The header format is "Bearer <token>". We need to split it.
  const token = authHeader.split(' ')[1];

  // Check if token exists after split
  if (!token) {
    return res.status(401).json({ msg: 'Token format is incorrect, authorization denied' });
  }

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's info from the token's payload to the request object
    req.user = decoded.user;

    // Call next() to proceed to the actual route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
