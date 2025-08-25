import { Request, Response } from "express";
import axios from "axios";
import knex from "../models/db";

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body;
  // Check blacklist via Adjutor API
  try {
    const karmaRes = await axios.get(
      `${process.env.ADJUTOR_KARMA_URL}?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`,
        },
      }
    );
    if (karmaRes.data && karmaRes.data.blacklisted) {
      return res.status(403).json({ message: "User is blacklisted" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Blacklist check failed",
      error: (err as Error).message,
    });
  }

  // Create user in DB
  try {
    const [id] = await knex("users").insert({ name, email });
    await knex("wallets").insert({ user_id: id, balance: 0 });
    return res.status(201).json({ id, name, email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "User creation failed", error: (err as Error).message });
  }
}
