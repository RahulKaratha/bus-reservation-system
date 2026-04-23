export const logger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} -> ${req.url}`);
  next();
};