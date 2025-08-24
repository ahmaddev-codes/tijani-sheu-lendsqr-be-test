import express from "express";
import userRoutes from "./routes/userRoutes";
import walletRoutes from "./routes/walletRoutes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
