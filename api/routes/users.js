import express from "express";
import {
  deleteUser,
  getUsers,
  getUser,
  updatedUser,
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, async (req, res, next) => {
//   res.send("Hello user, you are logged in!");
// });

// router.get("/checkuser/:id", verifyUser, async (req, res, next) => {
//   res.send("Hello user, you are logged in and you can delete your account!");
// });

// router.get("/checkadmin/:id", verifyAdmin, async (req, res, next) => {
//   res.send("Hello admin, you are logged in and you can delete all accounts!");
// });

// UPDATE
router.put("/:id", verifyUser, updatedUser);
// DELETE
router.delete("/:id", verifyUser, deleteUser);
// GET
router.get("/:id", verifyUser, getUser);
// GET ALL
router.get("/", verifyAdmin, getUsers);

export default router;
