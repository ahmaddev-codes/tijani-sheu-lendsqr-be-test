import { Request, Response } from "express";
import knex from "../models/db";

export async function fundWallet(req: Request, res: Response) {
  const { userId, amount } = req.body;
  try {
    await knex("wallets")
      .where({ user_id: userId })
      .increment("balance", amount);
    return res.json({ message: "Wallet funded successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Funding failed", error: (err as Error).message });
  }
}

export async function transferFunds(req: Request, res: Response) {
  const { fromUserId, toUserId, amount } = req.body;
  try {
    await knex.transaction(async (trx) => {
      const fromWallet = await trx("wallets")
        .where({ user_id: fromUserId })
        .first();
      if (!fromWallet || fromWallet.balance < amount) {
        throw new Error("Insufficient funds");
      }
      await trx("wallets")
        .where({ user_id: fromUserId })
        .decrement("balance", amount);
      await trx("wallets")
        .where({ user_id: toUserId })
        .increment("balance", amount);
    });
    return res.json({ message: "Transfer successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Transfer failed", error: (err as Error).message });
  }
}

export async function withdrawFunds(req: Request, res: Response) {
  const { userId, amount } = req.body;
  try {
    await knex.transaction(async (trx) => {
      const wallet = await trx("wallets").where({ user_id: userId }).first();
      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient funds");
      }
      await trx("wallets")
        .where({ user_id: userId })
        .decrement("balance", amount);
    });
    return res.json({ message: "Withdrawal successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Withdrawal failed", error: (err as Error).message });
  }
}
