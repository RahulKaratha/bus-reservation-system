import jwt from "jsonwebtoken";

export const adminOnly = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied, admins only" });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
