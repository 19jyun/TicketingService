import express from "express";
import {
  checkId,
  checkEmail,
  loginUser,
  signupUser,
  changePassword,
  verifyPassword,
  updateUserInterest,
} from "../controllers/userController";

const router = express.Router();

router.get("/check-id", checkId);

router.get("/check-email", checkEmail);

router.get("/login", loginUser);

router.post("/signup", signupUser);

router.put("/change-password", changePassword);

router.post("/verify-password", verifyPassword);

router.post("/interest", updateUserInterest);

export default router;
