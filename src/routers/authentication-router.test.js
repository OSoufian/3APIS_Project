import supertest from "supertest";
import express from "express";

import { User } from "../mongo.js";
import app from "../server.js";

describe("Users Router POST /", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  it("should add the User", async () => {
    const response = await supertest(app)
      .post("/api/auth/inscription")
      .set("Authorization", "admin")
      .send({
        email: "test.user@gmail.com",
        username: "tester",
        password: "test12",
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });
});