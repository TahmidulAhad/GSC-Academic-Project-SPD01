import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  getUserRequests,
} from "../controllers/request.controller";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/documents";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, JPG, PNG) are allowed"));
    }
  },
});

router.post("/", authenticate, upload.single("document"), createRequest);
router.get("/", getAllRequests);
router.get("/my-requests", authenticate, getUserRequests);
router.get("/:id", getRequestById);
router.patch(
  "/:id/status",
  authenticate,
  authorizeRoles("volunteer", "admin"),
  updateRequestStatus
);

export default router;
