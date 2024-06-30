const { expect, it } = require("@jest/globals");
const { Category, User } = require("../models");
const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");

let tokenAdmin1;

beforeAll(async () => {
  const newUser1 = {
    username: "admin1",
    email: "admin1@mail.com",
    password: "123456",
    role: "admin",
  };

  const admin1 = await User.create(newUser1);
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
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Create category", () => {
  it("Should create a new category", async () => {
    const newCategory = {
      name: "Motor",
    };

    const response = await request(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.statusCode).toEqual(201);
    expect(response.body.message).toEqual("Category added successfully");
    expect(response.body.data.name).toEqual(newCategory.name);
  });

  it("error if name is empty", async () => {
    const newCategory = {
      name: "",
    };

    const response = await request(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("Name is required");
  });
});

describe("Get categories", () => {
  it("Should get all categories", async () => {
    const response = await request(app)
      .get("/category")
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Categories fetched");
    expect(response.body.data.length).toEqual(5);
  });
});

describe("Update category", () => {
  it("Should update a category", async () => {
    const newCategory = {
      name: "Motor",
    };

    const response = await request(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    const updatedCategory = {
      name: "Motor > 1000cc",
    };

    const responseUpdate = await request(app)
      .put(`/category/${response.body.data.id}`)
      .send(updatedCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(responseUpdate.statusCode).toEqual(200);
    expect(responseUpdate.body.message).toEqual("Category updated");
    expect(responseUpdate.body.data.name).toEqual(updatedCategory.name);
  });

  it("error if category not found", async () => {
    const updatedCategory = {
      name: "Motor > 1000cc",
    };

    const response = await request(app)
      .put(`/category/100`)
      .send(updatedCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(response.statusCode).toEqual(404);
    expect(response.body.message).toEqual("Category not found");
  });

  it("error if name is empty", async () => {
    const newCategory = {
      name: "Motor",
    };

    const response = await request(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    const updatedCategory = {
      name: "",
    };

    const responseUpdate = await request(app)
      .put(`/category/${response.body.data.id}`)
      .send(updatedCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    expect(responseUpdate.statusCode).toEqual(400);
    expect(responseUpdate.body.message).toEqual("Name is required");
  });

  it("error if user not authorized when update", async () => {
    const newCategory = {
      name: "Mobil Keren",
    };

    const response = await request(app)
      .post("/category")
      .send(newCategory)
      .set("Authorization", `Bearer ${tokenAdmin1}`);

    const newUser2 = {
      username: "user2",
      email: "user2@mail.com",
      password: "123456",
      role: "user",
    };

    const user2 = await User.create(newUser2);
    const tokenUser2 = generateToken({ id: user2.id });

    const updatedCategory = {
      name: "Mobil Sport",
    };

    const responseUpdate = await request(app)
      .put(`/category/${response.body.data.id}`)
      .send(updatedCategory)
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(responseUpdate.statusCode).toEqual(401);
    expect(responseUpdate.body.message).toEqual("You are not authorized");
  });
});
