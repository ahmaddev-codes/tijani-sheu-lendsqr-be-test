import { Router } from "express";
import {
  fundWallet,
  transferFunds,
  withdrawFunds,
} from "../controllers/walletController";
import { fauxAuth } from "../middleware/authMiddleware";

const router = Router();

router.post("/fund", fauxAuth, fundWallet);
router.post("/transfer", fauxAuth, transferFunds);
router.post("/withdraw", fauxAuth, withdrawFunds);

export default router;
