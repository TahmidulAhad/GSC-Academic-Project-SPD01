import { Router } from "express";
import {
  createMessage,
  getAllMessages,
} from "../controllers/message.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createMessage);
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "volunteer"),
  getAllMessages
);

export default router;
