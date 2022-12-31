import supertest from "supertest";
import express from "express";
import { isCurrentUser } from "../middlewares/authentication-middleware.js";

import { User } from "../mongo.js";
import app from "../server.js";

describe("My account Router GET /", () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await supertest(app)
        .post("/api/auth/inscription")
        .send({
            email: "test.user@gmail.com",
            username: "tester",
            password: "test12",
        });
        await supertest(app)
        .get("/api/auth/login")
        .send({
            email: "test.user@gmail.com",
            password: "test12",
        });
    });
  
    it("should get the current user", async () => {
      const response = await supertest(app).get("/my_account").expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          email: "test.user@gmail.com",
          username: "tester",
          password: "test12",
        })
      );
    });
  });  

describe("My account Router PUT /", () => {
  let id;
  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      email: "test.user@gmail.com",
      password: "test12",
    });
    id = user._id;
  });

  it("should update the user", async () => {
    const response = await supertest(app)
      .put(`/my_account`)
      .send({
        email: "test.user@gmail.com",
        password: "tesm"
      })
      .expect(200);

    expect(response.body).toMatchObject({ password: "tesm" });
  });
});

describe("My account Router DELETE /", () => {
  let id;
  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      email: "test.user@gmail.com",
      password: "test12",
    });
    id = user._id;
  });

  it("should delete the user", async () => {
    const response = await supertest(app)
      .delete(`/my_account`)
      .expect(200);

    expect(response.body).toMatchObject({});
  });
});
