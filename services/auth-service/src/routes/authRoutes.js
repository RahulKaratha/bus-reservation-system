const express = require("express");
const router = express.Router();
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/validate", protect, (req, res) => {
  res.json({ id: req.user._id, email: req.user.email, isAdmin: req.user.role === "admin" });
});

router.get("/profile", protect, (req, res) => {
  res.json(req.user); // The user info comes from the middleware
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}`);
  }
);


module.exports = router;