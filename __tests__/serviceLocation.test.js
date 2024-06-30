const { expect, it } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, ServiceLocation } = require("../models");
const { generateToken } = require("../helpers/jwt");

let tokenAdmin1;

beforeAll(async () => {
  const admin1 = await User.create({
    username: "admin1",
    email: "admin1@mail.com",
    password: "123456",
    role: "admin",
  });
  tokenAdmin1 = generateToken({ id: admin1.id });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, rstartIdentity: true });
  await ServiceLocation.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Service location create", () => {
  it("should create service location", async () => {
    const newServiceLocation = {
      name: "Service Location 1",
      address: "Jl. Service Location 1",
      city: "Jakarta",
      state: "DKI Jakarta",
      zipCode: "12345",
      description: "Service Location 1 Description",
    };
    const response = await request(app)
      .post("/service-location")
      .set("Authorization", `Bearer ${tokenAdmin1}`)
      .send(newServiceLocation);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Success add service location"
    );
    expect(response.body.data).toHaveProperty("name", newServiceLocation.name);
  });

  it("error if name is empty", async () => {
    const newServiceLocation = {
      name: "",
      address: "Jl. Service Location 1",
      city: "Jakarta",
      state: "DKI Jakarta",
      zipCode: "12345",
      description: "Service Location 1 Description",
    };

    const response = await request(app)
      .post("/service-location")
      .set("Authorization", `Bearer ${tokenAdmin1}`)
      .send(newServiceLocation);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Service location name is require"
    );
  });
});

describe("Service location get", () => {
  it("should get all service locations", async () => {
    const response = await request(app)
      .get("/service-location")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    console.log(response.body, "<<<<<<<<<");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success get all service locations"
    );
    expect(response.body).toHaveProperty("data", expect.any(Array));
    expect(response.body.data).toHaveLength(1);
  });
});

describe("Service location update", () => {
  it("should update service location", async () => {
    const updatedServiceLocation = {
      name: "Service Location 1 Updated",
      address: "Jl. Service Location 1 Updated",
      city: "Jakarta Updated",
      state: "DKI Jakarta Updated",
      zipCode: "54321",
      description: "Service Location 1 Description Updated",
    };

    const response = await request(app)
      .put(`/service-location/1`)
      .set("Authorization", `Bearer ${tokenAdmin1}`)
      .send(updatedServiceLocation);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success update service location"
    );
    expect(response.body.data).toHaveProperty(
      "name",
      updatedServiceLocation.name
    );
  });

  it("error if update service location not found", async () => {
    const updatedServiceLocation = {
      name: "Service Location 1 Updated",
      address: "Jl. Service Location 1 Updated",
      city: "Jakarta Updated",
      state: "DKI Jakarta Updated",
      zipCode: "54321",
      description: "Service Location 1 Description Updated",
    };

    const response = await request(app)
      .put(`/service-location/99`)
      .set("Authorization", `Bearer ${tokenAdmin1}`)
      .send(updatedServiceLocation);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Service location not found"
    );
  });

  it("error if user is not authorized to update", async () => {
    const updatedServiceLocation = {
      name: "Service Location 1 Updated",
      address: "Jl. Service Location 1 Updated",
      city: "Jakarta Updated",
      state: "DKI Jakarta Updated",
      zipCode: "54321",
      description: "Service Location 1 Description Updated",
    };

    const user = await User.create({
      username: "user1",
      email: "user1@mail.com",
      password: "123456",
      role: "user",
    });

    const tokenUser = generateToken({ id: user.id });

    const response = await request(app)
      .put(`/service-location/1`)
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(updatedServiceLocation);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
});
