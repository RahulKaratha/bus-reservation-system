import dotenv from "dotenv";
dotenv.config();

export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL,
  BUS: process.env.BUS_SERVICE_URL,
  BOOKING: process.env.BOOKING_SERVICE_URL,
  PAYMENT: process.env.PAYMENT_SERVICE_URL,
  USER: process.env.USER_SERVICE_URL,
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL
};