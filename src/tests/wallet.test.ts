import request from "supertest";
import app from "../index";

// Mock knex database for wallet operations
jest.mock("../models/db", () => {
  const mockKnex: any = jest.fn((table: string) => {
    if (table === "wallets") {
      return {
        where: jest.fn().mockReturnThis(),
        increment: jest.fn().mockResolvedValue({}),
        decrement: jest.fn().mockResolvedValue({}),
        first: jest.fn().mockResolvedValue({ id: 1, balance: 100 }),
      };
    }
    return {
      where: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue([1]),
      first: jest.fn().mockResolvedValue({ id: 1 }),
    };
  });

  mockKnex.transaction = jest.fn().mockImplementation((callback) => {
    const mockTrx: any = jest.fn((table: string) => ({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ id: 1, balance: 100 }),
      increment: jest.fn().mockResolvedValue({}),
      decrement: jest.fn().mockResolvedValue({}),
    }));

    return callback(mockTrx);
  });

  return mockKnex;
});

describe("Wallet API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fund wallet", async () => {
    const res = await request(app)
      .post("/api/wallet/fund")
      .set("Authorization", "token")
      .send({ userId: 1, amount: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Wallet funded successfully");
  });

  it("should transfer funds", async () => {
    const res = await request(app)
      .post("/api/wallet/transfer")
      .set("Authorization", "token")
      .send({ fromUserId: 1, toUserId: 2, amount: 50 });

    if (res.status !== 200) {
      console.log("Transfer error:", res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Transfer successful");
  });
  it("should withdraw funds", async () => {
    const res = await request(app)
      .post("/api/wallet/withdraw")
      .set("Authorization", "token")
      .send({ userId: 1, amount: 30 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Withdrawal successful");
  });

  it("should return 401 if no authorization header", async () => {
    const res = await request(app)
      .post("/api/wallet/fund")
      .send({ userId: 1, amount: 100 });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message", "No token provided");
  });
});
