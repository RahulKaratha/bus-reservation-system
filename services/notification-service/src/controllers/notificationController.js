import { sendEmail } from "../services/emailService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, "../templates");

export const sendResetEmail = async (req, res) => {
  try {
    const { email, resetLink } = req.body;

    let template = fs.readFileSync(path.join(templatesDir, "resetPassword.html"), "utf-8");
    template = template.replace("{{RESET_LINK}}", resetLink);

    await sendEmail(email, "Reset Your Password", template);
    res.json({ message: "Reset email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendBookingEmail = async (req, res) => {
  try {
    const { email, bus, seats, amount } = req.body;

    let template = fs.readFileSync(path.join(templatesDir, "bookingConfirmation.html"), "utf-8");
    template = template
      .replace("{{BUS}}", bus)
      .replace("{{SEATS}}", seats.join(", "))
      .replace("{{AMOUNT}}", amount);

    await sendEmail(email, "Booking Confirmed", template);
    res.json({ message: "Booking email sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
