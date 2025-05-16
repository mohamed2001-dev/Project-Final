import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

/* Multer Setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

// ✅ ONLY THIS update route (with upload)
router.put("/:id", verifyToken, upload.single("picture"), updateUser);

export default router;

