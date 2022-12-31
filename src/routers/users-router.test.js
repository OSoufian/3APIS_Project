import supertest from "supertest";
import express from "express";
import { isAdminEmployeeOrCurrentUser, isAdminOrEmployee, isAdminOrCurrentUser } from "../middlewares/authentication-middleware.js";

import { User } from "../mongo.js";
import app from "../server.js";

describe("Users Router GET /", () => {
    beforeAll(async () => {
      await User.deleteMany({});
        await User.create({
        email: "lounes.behloul@supinfo.com",
        password: "lounesBehloul",
        role: "admin"
      });
      await User.create({
        email: "soufian.oualla@supinfo.com",
        password: "soufianOualla",
      });
    });
  
    it("should get the list of users", async () => {
      const user = await User.findOne({email: "lounes.behloul@supinfo.com"})
      console.log(user, user.role)
      const response = await supertest(app).get("/users").auth(user.email, user.password).expect(200);
  
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
      .send({
        email: "test.user@gmail.com",
        password: "tesm"
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
      .expect(200);

    expect(response.body).toMatchObject({});
  });
});
