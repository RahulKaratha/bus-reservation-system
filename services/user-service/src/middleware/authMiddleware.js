import axios from "axios";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const response = await axios.get(
      `${process.env.AUTH_SERVICE_URL}/api/auth/validate`,
      { headers: { Authorization: authHeader } }
    );

    req.user = response.data;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
