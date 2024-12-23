import { Request, Response } from "express";
import { getUsers, saveUsers } from "../models/userModel";

// ID 중복 확인
export const checkId = async (req: Request, res: Response) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      error: "Username is required and must be a string",
    });
  }

  try {
    const users = await getUsers();
    const isTaken = users.some((user) => user.username === username);
    if (isTaken) {
      return res
        .status(409)
        .json({ success: false, error: "Username is already taken" });
    }
    res.status(200).json({ success: true, message: "Username is available" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// 이메일 중복 확인
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      error: "Email is required and must be a string",
    });
  }

  try {
    const users = await getUsers();
    const isTaken = users.some((user) => user.email === email);
    if (isTaken) {
      return res
        .status(409)
        .json({ success: false, error: "Email is already taken" });
    }
    res.status(200).json({ success: true, message: "Email is available" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// 로그인
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      error: "Email is required and must be a string",
    });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({
      success: false,
      error: "Password is required and must be a string",
    });
  }

  try {
    const users = await getUsers();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }

    res.status(200).json({ success: true, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      error: "Username is required and must be a string",
    });
  }
  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      error: "Email is required and must be a string",
    });
  }
  if (!password || typeof password !== "string" || password.length < 4) {
    return res.status(400).json({
      success: false,
      error:
        "Password is required, must be a string, and at least 4 characters long",
    });
  }

  try {
    const users = await getUsers();

    // ID 중복 확인
    const isUsernameTaken = users.some((user) => user.username === username);
    if (isUsernameTaken) {
      return res
        .status(409)
        .json({ success: false, error: "Username is already taken" });
    }

    // 이메일 중복 확인
    const isEmailTaken = users.some((user) => user.email === email);
    if (isEmailTaken) {
      return res
        .status(409)
        .json({ success: false, error: "Email is already taken" });
    }

    // 관심도 초기화 값
    const initialInterest = {
      Concerts: 0.25,
      Musical: 0.25,
      "Children/Family": 0.25,
      Exhibition: 0.25,
    };

    // 새 사용자 추가
    const newUser = { username, email, password, interest: initialInterest };
    users.push(newUser);

    // 파일에 저장
    await saveUsers(users);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// 비밀번호 변경
export const changePassword = async (req: Request, res: Response) => {
  const { username, newPassword } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      error: "Username is required and must be a string",
    });
  }
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.length < 4
  ) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 4 characters long and a string",
    });
  }

  try {
    const users = await getUsers();

    // 사용자 찾기
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 비밀번호 변경
    users[userIndex].password = newPassword;

    // 파일에 저장
    await saveUsers(users);

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const verifyPassword = async (req: Request, res: Response) => {
  const { username, currentPassword } = req.query;

  // 요청 데이터 검증
  if (!username || typeof username !== "string") {
    return res.status(400).json({
      success: false,
      error: "Username is required and must be a string",
    });
  }
  if (!currentPassword || typeof currentPassword !== "string") {
    return res.status(400).json({
      success: false,
      error: "Current password is required and must be a string",
    });
  }

  try {
    const users = await getUsers();

    // 사용자 검색
    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 비밀번호 확인
    if (user.password === currentPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, error: "Current password is incorrect" });
    }
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateUserInterest = async (req: Request, res: Response) => {
  const { username, genre, action } = req.query;

  if (!username || !genre || !action) {
    return res.status(400).json({
      success: false,
      error: "Username, genre, and action are required.",
    });
  }

  try {
    const users = await getUsers();

    // 유저 검색
    const user = users.find((u) => u.username === username);
    if (!user || !user.interest) {
      return res.status(404).json({
        success: false,
        error: "User not found or interest not initialized.",
      });
    }

    // 관심도 업데이트
    const increment = action === "reservation" ? 20 : 1;
    user.interest[genre as string] =
      (user.interest[genre as string] || 0) + increment;

    // 관심도 정규화
    const total = Object.values(user.interest).reduce(
      (sum, value) => sum + value,
      0
    );
    for (const key in user.interest) {
      user.interest[key] /= total;
    }

    // 저장
    await saveUsers(users);

    res.status(200).json({
      success: true,
      message: "Interest updated successfully",
      interest: user.interest,
    });
  } catch (error) {
    console.error("Error updating interest:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
