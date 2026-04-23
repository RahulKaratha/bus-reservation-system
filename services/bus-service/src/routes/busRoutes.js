import express from "express";
import {
  addBus,
  getBuses,
  getBus,
  searchBus,
  updateBus,
  deleteBus,
  getCitiesList
} from "../controllers/busController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/cities", getCitiesList);
router.get("/", getBuses);
router.get("/search", searchBus);
router.get("/:id", getBus);

router.post("/add", adminOnly, addBus);
router.put("/:id", adminOnly, updateBus);
router.delete("/:id", adminOnly, deleteBus);

export default router;