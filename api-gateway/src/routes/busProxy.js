import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/services.js";

export const busProxy = createProxyMiddleware({
  target: SERVICES.BUS,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      // Express strips the mount path, so we restore the full /api/bus/... path
      const original = req.originalUrl.split('?')[0]
      const query = req.originalUrl.includes('?') ? '?' + req.originalUrl.split('?')[1] : ''
      proxyReq.path = original + query
    },
    error: (err, req, res) => {
      res.status(502).json({ message: "Bus service unavailable" });
    }
  }
});
