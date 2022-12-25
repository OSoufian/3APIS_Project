import supertest from "supertest";
import express from "express";

import { User } from "../mongo.js";
import app from "../server.js";

describe("Users Router GET /", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await User.create({
      email: "lounes.behloul@supinfo.com",
      password: "lounesBehloul",
    });
    await User.create({
      email: "soufian.oualla@supinfo.com",
      password: "soufianOualla",
    });
  });

  it("should get the list of users", async () => {
    const response = await supertest(app)
      .get("/users")
      .expect(200);

    expect(response.body[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        email: "lounes.behloul@supinfo.com",
        password: "lounesBehloul",
      })
    );
  });
});

describe("Users Router PUT /", () => {
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
      .put(`/users/${id}`)
      .set("Authorization", "admin")
      .send({
        email: "test.user@gmail.com",
        password: "tesm",
      })
      .expect(200);

    expect(response.body).toMatchObject({ password: "tesm" });
  });
});

describe("Users Router DELETE /", () => {
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
      .delete(`/users/${id}`)
      .set("Authorization", "admin")
      .expect(200);

    expect(response.body).toMatchObject({});
  });
});
