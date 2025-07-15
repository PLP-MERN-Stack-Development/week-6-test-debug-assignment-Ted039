const jwt = require('jsonwebtoken');
const SECRET = 'your_secret_key_here';

function generateToken(user) {
  return jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch {
    res.sendStatus(403);
  }
}

module.exports = { generateToken, authenticateToken };
