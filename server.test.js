const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { app, users } = require("./server"); // import shared users

describe("Auth API", () => {
  beforeEach(() => {
    users.length = 0; // reset before each test
  });

  // ---------- REGISTER ----------
  describe("POST /register", () => {
    it("should register a new user with valid data", async () => {
      const res = await request(app).post("/register").send({
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "User registered successfully");
      expect(users.length).toBe(1);
      expect(await bcrypt.compare("StrongPass123", users[0].password)).toBe(true);
    });

    it("should not register with an existing email", async () => {
      users.push({ email: "test@example.com", password: "hashed" });

      const res = await request(app).post("/register").send({
        email: "test@example.com",
        password: "AnotherPass",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "User already exists");
    });

    it("should return 400 for invalid input", async () => {
      const res = await request(app).post("/register").send({
        email: "",
        password: "",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  // ---------- LOGIN ----------
  describe("POST /login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("StrongPass123", 10);
      users.push({ email: "test@example.com", password: hashedPassword });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app).post("/login").send({
        email: "test@example.com",
        password: "StrongPass123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");

      const decoded = jwt.verify(
        res.body.token,
        process.env.JWT_SECRET || "secretkey"
      );
      expect(decoded.email).toBe("test@example.com");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/login").send({
        email: "test@example.com",
        password: "WrongPass",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials");
    });

    it("should not login with unregistered email", async () => {
      const res = await request(app).post("/login").send({
        email: "unknown@example.com",
        password: "somepass",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "Invalid credentials");
    });
  });

  // ---------- PROFILE ----------
  describe("GET /profile", () => {
    let token;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("StrongPass123", 10);
      users.push({ email: "test@example.com", password: hashedPassword });

      token = jwt.sign(
        { email: "test@example.com" },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1h" }
      );
    });

    it("should access profile with valid token", async () => {
      const res = await request(app)
        .get("/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("email", "test@example.com");
    });

    it("should not access profile without token", async () => {
      const res = await request(app).get("/profile");

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("error", "No token provided");
    });

    it("should not access profile with invalid token", async () => {
      const res = await request(app)
        .get("/profile")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("error", "Invalid token");
    });
  });
});
