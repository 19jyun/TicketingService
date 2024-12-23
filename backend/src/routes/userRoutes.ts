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

// ID 중복 확인
router.get("/check-id", checkId);

// 이메일 중복 확인
router.get("/check-email", checkEmail);

// 로그인
router.get("/login", loginUser);

// 회원가입
router.post("/signup", signupUser);

// 비밀번호 변경
router.put("/change-password", changePassword);

// 비밀번호 확인
router.post("/verify-password", verifyPassword);

router.post("/interest", updateUserInterest);

export default router;
