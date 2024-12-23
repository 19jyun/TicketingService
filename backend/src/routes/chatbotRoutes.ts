import express from "express";
import { handleChatbot } from "../controllers/chatbotController";

const router = express.Router();

router.post("/", handleChatbot);

export default router;
