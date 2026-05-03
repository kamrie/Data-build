import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token not valid" });
    }

    req.user = user; // attach user info
                   // eg JWT verified → req.user = { id: 4, username: "Kamm" }
    next();
  });
};