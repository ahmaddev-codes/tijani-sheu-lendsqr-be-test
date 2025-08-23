import request from "supertest";
import app from "../index";

// Mock axios for testing
jest.mock("axios");
const mockedAxios = jest.mocked(require("axios"));

// Mock knex database
jest.mock("../models/db", () => {
  const mockKnex: any = jest.fn(() => ({
    insert: jest.fn().mockResolvedValue([1]),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue({ id: 1, balance: 0 }),
  }));

  return mockKnex;
});

describe("User API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not onboard blacklisted user", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { blacklisted: true },
    });

    const res = await request(app)
      .post("/api/users")
      .send({ name: "Blacklisted", email: "blacklisted@example.com" });
    expect(res.status).toBe(403);
  });

  it("should create user and wallet", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { blacklisted: false },
    });

    const res = await request(app)
      .post("/api/users")
      .send({ name: "Test User", email: "test@example.com" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
