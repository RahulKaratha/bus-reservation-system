import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services.js";

export const authProxy = createProxyMiddleware({
  target: SERVICES.AUTH,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      const original = req.originalUrl.split('?')[0]
      const query = req.originalUrl.includes('?') ? '?' + req.originalUrl.split('?')[1] : ''
      proxyReq.path = original + query
    },
    error: (err, req, res) => {
      res.status(502).json({ message: "Auth service unavailable" });
    }
  }
});
