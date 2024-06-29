const { expect, it } = require("@jest/globals");
const { User } = require("../models");
const request = require("supertest");
const app = require("../app");

beforeAll(async () => {});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("User model register", () => {
  it("should can create a user", async () => {
    const newUser = {
      username: "test1",
      email: "test1@mail.com",
      role: "user",
      password: "123456",
    };

    const response = await request(app).post("/user/register").send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Success create user");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("username", newUser.username);
    expect(response.body.data).toHaveProperty("email", newUser.email);
    expect(response.body.data).toHaveProperty("role", newUser.role);
  });

  it("error if username is empty", async () => {
    const newUser = {
      username: "",
      email: "test2@mail.com",
      role: "user",
      password: "123456",
    };

    const response = await request(app).post("/user/register").send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Username is require");
  });

  it("error if email is empty", async () => {
    const newUser = {
      username: "test2",
      email: "",
      role: "user",
      password: "123456",
    };

    const response = await request(app).post("/user/register").send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is require");
  });

  it("error if email is not unique", async () => {
    const newUser = {
      username: "test1",
      email: "test1@mail.com",
      role: "user",
      password: "123456",
    };

    const response = await request(app).post("/user/register").send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already used");
  });

  it("error if role not between user or admin", async () => {
    const newUser = {
      username: "test2",
      email: "test2@mail.com",
      role: "",
      password: "123456",
    };

    const response = await request(app).post("/user/register").send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Role must be user or admin"
    );
  });
});

describe("User model login", () => {
  it("should can login", async () => {
    const user = {
      email: "test1@mail.com",
      password: "123456",
    };

    const response = await request(app).post("/user/login").send(user);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Success login");
    expect(response.body.data).toHaveProperty("email", user.email);
    expect(response.body.data).toHaveProperty("token");
  });

  it("error if email and password is empty", async () => {
    const user = {
      email: "",
      passwprd: "",
    };

    const response = await request(app).post("/user/login").send(user);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and password require"
    );
  });

  it("error if email is not found", async () => {
    const user = {
      email: "test999@mail.com",
      password: "123456",
    };

    const response = await request(app).post("/user/login").send(user);

    console.log(response.body);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Incorrect email or password"
    );
  });

  it("error if password is incorrect", async () => {
    const user = {
      email: "test1@mail.com",
      password: "wrongpassword",
    };

    const response = await request(app).post("/user/login").send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Incorrect email or password"
    );
  });
});
