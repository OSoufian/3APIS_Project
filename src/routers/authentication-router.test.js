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
      .send({
        email: "test.user@gmail.com",
        username: "tester",
        password: "test12",
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: `Bienvenue tester, ton compte a été créé avec succès. Tu peux te connecter !`
      })
    );
  });
});

describe("Users Router GET /", () => {

  it("should login to the User", async () => {
    const response = await supertest(app)
      .get("/api/auth/login")
      .send({
        email: "test.user@gmail.com",
        password: "test12",
      })
      .expect(200);

      expect(response.body).toEqual(
      expect.objectContaining({
        message: `Salut tester, tu as été connecté avec succès !`
      })
    );
  });
});