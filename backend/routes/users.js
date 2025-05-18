import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUser,
} from "../controllers/users.js";
import {
  sendFriendRequest,
  confirmFriendRequest,
} from "../controllers/users.js"
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
router.patch("/:id/send-request/:targetId", verifyToken, sendFriendRequest);
router.patch("/:id/confirm-request/:senderId", verifyToken, confirmFriendRequest);

//  ONLY THIS update route (with upload)
router.put("/:id", verifyToken, upload.single("picture"), updateUser);

// Search users by name or username
router.get("/search/friends", verifyToken, async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Missing search query" });
    }

    // Case-insensitive search by firstName or lastName
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } }
      ]
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

export default router;

