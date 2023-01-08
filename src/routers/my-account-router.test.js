import supertest from "supertest";
import session from "supertest-session";
import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";
import app from "../server.js";

let testSession = null;

describe("My account Router GET /", () => {
  beforeAll(async () => {
    testSession = session(app);
    await testSession.post("/api/auth/inscription").send({
      email: "test2.user@gmail.com",
      username: "tester",
      password: "test12",
    });
  });

  it("should get the current user", async () => {
    const user = await testSession.get("/api/auth/login").send({
      email: "test2.user@gmail.com",
      password: "test12",
    });

    testSession.userID = user.body.id;
    const response = await testSession.get("/my_account").expect(200);

    expect(response.body["email"]).toEqual("test2.user@gmail.com");
  });
});

describe("My account Router GET /", () => {

  it("should get the tickets of the user", async () => {
    const user = await testSession.get("/api/auth/login").send({
      email: "test2.user@gmail.com",
      password: "test12",
    });

    testSession.userID = user.body.id;
    await testSession.get("/my_account/tickets").expect(200);
  });
});

describe("My account Router GET /", () => {

  it("should logout the current user", async () => {
    const user = await testSession.get("/api/auth/login").send({
      email: "test2.user@gmail.com",
      password: "test12",
    });

    testSession.userID = user.body.id;
    const response = await testSession.get("/my_account/logout").expect(200);

    expect(response).toEqual("Vous avez été déconnecté avec succcès !");
  });
});

describe("My account Router PUT /", () => {
  it("should update the user", async () => {
    const user = await testSession.get("/api/auth/login").send({
      email: "test2.user@gmail.com",
      password: "test12",
    });

    bcrypt.hash("tesm", 10, async (error, hash) => {
      if (error) response.status(500).json(error);
      else {
        await testSession
          .put(`/my_account`)
          .send({
            password: hash,
          })
          .expect(200);
        }});
  });
});

describe("My account Router DELETE /", () => {
  it("should delete the user", async () => {

    const response = await testSession.delete(`/my_account`).expect(200);

    expect(response.body).toMatchObject({});
  });
});