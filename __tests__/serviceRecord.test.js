const { expect, it } = require("@jest/globals");
const {
  ServiceRecord,
  Vehicle,
  User,
  Category,
  ServiceLocation,
} = require("../models");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");
const request = require("supertest");

let tokenAdmin1;

beforeAll(async () => {
  const admin1 = await User.create({
    username: "admin1",
    email: "admin1@mail.com",
    role: "admin",
    password: "123456",
  });
  tokenAdmin1 = generateToken({ id: admin1.id });

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

  const newServiceLocation = [
    {
      name: "Service Location 1",
      address: "Jl. Service Location 1",
      city: "Jakarta",
      state: "DKI Jakarta",
      zipCode: "12345",
      description: "Service Location 1 Description",
      roleAdd: admin1.role,
      UserId: admin1.id,
    },
    {
      name: "Service Location 2",
      address: "Jl. Service Location 2",
      city: "Jakarta",
      state: "DKI Jakarta",
      zipCode: "12345",
      description: "Service Location 2 Description",
      roleAdd: admin1.role,
      UserId: admin1.id,
    },
    {
      name: "Service Location 3",
      address: "Jl. Service Location 3",
      city: "Jakarta",
      state: "DKI Jakarta",
      zipCode: "12345",
      description: "Service Location 3 Description",
      roleAdd: admin1.role,
      UserId: admin1.id,
    },
  ];
  await ServiceLocation.bulkCreate(newServiceLocation);

  const newVehicles = [
    {
      UserId: admin1.id,
      merk: "Vario 150",
      CategoryId: 1,
      year: "2017",
      regNumber: "B 1234 CD",
      ownerName: "Admin 1",
    },
    {
      UserId: admin1.id,
      merk: "Avanza",
      CategoryId: 2,
      year: "2018",
      regNumber: "B 1235 CD",
      ownerName: "Admin 1",
    },
    {
      UserId: admin1.id,
      merk: "Innova",
      CategoryId: 2,
      year: "2019",
      regNumber: "B 1236 CD",
      ownerName: "Admin 1",
    },
  ];
  await Vehicle.bulkCreate(newVehicles);
});

afterAll(async () => {
  await ServiceRecord.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await Vehicle.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Service record add", () => {
  it("Should add new service record", async () => {
    const newServiceRecord = {
      VehicleId: 1,
      serviceDate: "2021-01-01",
      mileage: 1000,
      totalCost: 100000,
      note: "Service pertama",
      ServiceLocationId: 1,
    };

    const response = await request(app)
      .post("/service-record")
      .send(newServiceRecord)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Success add service record"
    );
    expect(response.body.data).toHaveProperty(
      "VehicleId",
      newServiceRecord.VehicleId
    );
  });

  it("error if vehicle id empty", async () => {
    const newServiceRecord = {
      VehicleId: "",
      serviceDate: "2021-01-01",
      mileage: 1000,
      totalCost: 100000,
      note: "Service pertama",
      ServiceLocationId: 1,
    };

    const response = await request(app)
      .post("/service-record")
      .send(newServiceRecord)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Vehicle id is required");
  });
});

describe("Service record get", () => {
  it("Should get all service record user", async () => {
    const response = await request(app)
      .get("/service-record/1")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "All service record");
    expect(response.body).toHaveProperty("data", expect.any(Array));
  });

  it("error if vehicle not found", async () => {
    const response = await request(app)
      .get("/service-record/999")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Vehicle not found and dont have service record"
    );
  });

  it("Should can get one service record", async () => {
    const response = await request(app)
      .get("/service-record/1/1")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Service record");
    expect(response.body).toHaveProperty("data", expect.any(Object));
  });

  it("error if vehicle not found when get one service record", async () => {
    const response = await request(app)
      .get("/service-record/999/1")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Vehicle not found");
  });

  it("error if service record not found", async () => {
    const response = await request(app)
      .get("/service-record/1/999")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Service record not found");
  });
});

describe("Service record update", () => {
  it("Should update service record", async () => {
    const updateServiceRecord = {
      serviceDate: "2021-01-01",
      mileage: 1500,
      totalCost: 100000,
      note: "Service pertama update",
      ServiceLocationId: 1,
    };

    const response = await request(app)
      .put("/service-record/1")
      .send(updateServiceRecord)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success update service record"
    );
    expect(response.body.data).toHaveProperty(
      "mileage",
      updateServiceRecord.mileage
    );
    expect(response.body.data).toHaveProperty("note", updateServiceRecord.note);
  });

  it("error if service record not found", async () => {
    const updateServiceRecord = {
      serviceDate: "2021-01-01",
      mileage: 1500,
      totalCost: 100000,
      note: "Service pertama update",
      ServiceLocationId: 1,
    };

    const response = await request(app)
      .put("/service-record/999")
      .send(updateServiceRecord)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Service record not found");
  });

  it("error if vehicle not found when update service record", async () => {
    const newServiceRecord = {
      VehicleId: 2,
      serviceDate: "2021-01-01",
      mileage: 1500,
      totalCost: 100000,
      note: "Service pertama mobil toyota",
      ServiceLocationId: 1,
    };

    const serviceRecord = await ServiceRecord.create(newServiceRecord);
    const vehicle2 = await Vehicle.findOne({
      where: { id: serviceRecord.VehicleId },
    });
    await vehicle2.update({ isDelete: true });

    const updateServiceRecord = {
      serviceDate: "2021-01-10",
      mileage: 1800,
      totalCost: 100000,
      note: "Service pertama mobil toyota update",
      ServiceLocationId: 1,
    };

    const response = await request(app)
      .put(`/service-record/${serviceRecord.id}`)
      .send(updateServiceRecord)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Vehicle not found");
  });
});

describe("Service record delete", () => {
  it("Should delete service record", async () => {
    const response = await request(app)
      .delete("/service-record/1")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success delete service record"
    );
    expect(response.body).toHaveProperty("data", expect.any(Object));
    expect(response.body.data).toHaveProperty("isDelete", true);
  });

  it("error if service record not found", async () => {
    const response = await request(app)
      .delete("/service-record/999")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Service record not found");
  });

  it("error if vehicle not found when delete service record", async () => {
    const newServiceRecord = {
      VehicleId: 2,
      serviceDate: "2021-01-01",
      mileage: 1500,
      totalCost: 100000,
      note: "Service lampu depan mobil toyota",
      ServiceLocationId: 1,
    };

    const serviceRecord = await ServiceRecord.create(newServiceRecord);
    const vehicle2 = await Vehicle.findOne({
      where: { id: serviceRecord.VehicleId },
    });
    await vehicle2.update({ isDelete: true });

    const response = await request(app)
      .delete(`/service-record/${serviceRecord.id}`)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Vehicle not found");
  });
});
