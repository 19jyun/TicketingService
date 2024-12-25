import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";
import showRoutes from "./routes/showRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import chatbotRoutes from "./routes/chatbotRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
