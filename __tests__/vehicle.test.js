const { expect, it } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Category, Vehicle } = require("../models");
const { generateToken } = require("../helpers/jwt");

let tokenUser1;

beforeAll(async () => {
  const user1 = await User.create({
    username: "user1",
    email: "user1@mail.com",
    role: "user",
    password: "123456",
  });
  tokenUser1 = generateToken({ id: user1.id });

  const admin1 = await User.create({
    username: "admin1",
    email: "admin1@mail.com",
    role: "admin",
    password: "123456",
  });

  const newCategories = [
    {
      name: "Motor",
      UserId: admin1.id,
      roleAdd: admin1.role,
    },
    {
      name: "Mobil",
      UserId: admin1.id,
      roleAdd: admin1.role,
    },
    {
      name: "Bus",
      UserId: admin1.id,
      roleAdd: admin1.role,
    },
    {
      name: "Truk",
      UserId: admin1.id,
      roleAdd: admin1.role,
    },
  ];
  await Category.bulkCreate(newCategories);
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await Vehicle.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Vehicle create", () => {
  it("should can add new vehicle", async () => {
    const newVehicle = {
      merk: "Vario 150",
      CategoryId: 1,
      year: "2017",
      regNumber: "B 1234 ABC",
      ownerName: "User 1",
    };

    const response = await request(app)
      .post("/vehicle")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send(newVehicle);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Success add vehicle");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.merk).toBe(newVehicle.merk);
    expect(response.body.data.CategoryId).toBe(newVehicle.CategoryId);
    expect(response.body.data.year).toBe(newVehicle.year);
  });

  it("error add new vehicle with empty merk", async () => {
    const newVehicle = {
      merk: "",
      CategoryId: 1,
      year: "2017",
      regNumber: "B 1234 ABC",
      ownerName: "User 1",
    };

    const response = await request(app)
      .post("/vehicle")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send(newVehicle);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Merk is required");
  });
});

describe("Vehicle read", () => {
  it("should can get all vehicles", async () => {
    const response = await request(app)
      .get("/vehicle")
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success get all vehicles");
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it("should can get vehicle by id", async () => {
    const vehicles = await Vehicle.findAll();

    const response = await request(app)
      .get(`/vehicle/${vehicles[0].id}`)
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success get vehicle");
    expect(response.body.data).toHaveProperty("id");
  });

  it("error get vehicle by id not found", async () => {
    const response = await request(app)
      .get("/vehicle/999")
      .set("Authorization", `Bearer ${tokenUser1}`);

    console.log(response.body, "<<<<<<<<<<<<<<<");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vehicle not found");
  });
});

describe("Vehicle update", () => {
  it("should can update vehicle", async () => {
    const vehicles = await Vehicle.findAll();

    const updateVehicle = {
      merk: "Vario 125",
      CategoryId: 1,
      year: "2018",
      regNumber: "B 1234 ABC",
      ownerName: "User 1",
    };

    const response = await request(app)
      .put(`/vehicle/${vehicles[0].id}`)
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send(updateVehicle);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success update vehicle");
    expect(response.body.data.merk).toBe(updateVehicle.merk);
    expect(response.body.data.year).toBe(updateVehicle.year);
  });

  it("error update vehicle not found", async () => {
    const updateVehicle = {
      merk: "Vario 125",
      CategoryId: 1,
      year: "2018",
      regNumber: "B 1234 ABC",
      ownerName: "User 1",
    };

    const response = await request(app)
      .put("/vehicle/999")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send(updateVehicle);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vehicle not found");
  });
});

describe("Vehicle delete", () => {
  it("should can delete vehicle", async () => {
    const vehicles = await Vehicle.findAll();

    const response = await request(app)
      .delete(`/vehicle/${vehicles[0].id}`)
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success delete vehicle");
    expect(response.body.data).toHaveProperty("isDelete", true);
  });

  it("error delete vehicle not found", async () => {
    const response = await request(app)
      .delete("/vehicle/999")
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Vehicle not found");
  });
});
