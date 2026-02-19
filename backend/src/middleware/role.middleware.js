const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.role) {
    return res.status(401).json({ message: "Invalid token. Please login again." });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
};

const requireAnyRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.user.role) {
    return res.status(401).json({ message: "Invalid token. Please login again." });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return next();
};

module.exports = {
  requireRole,
  requireAnyRole,
};
