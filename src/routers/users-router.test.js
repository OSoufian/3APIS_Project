import supertest from "supertest";
import session from "supertest-session";
import bcrypt from "bcrypt";
import express from "express";

import { User } from "../mongo.js";
import app from "../server.js";

let testSession = null;

describe("Users Router GET /", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    testSession = session(app);
    bcrypt.hash("lounesBehloul", 10, async (error, hash) => {
      if (error) response.status(500).json(error);
      else {
        const newUser = User({
          email: "lounes.behloul@supinfo.com",
          username: "loki7even",
          password: hash,
          role: "admin",
        });

        newUser.save();
      }
    });
  });

  it("should get the list of users", async () => {
    await testSession.get("/api/auth/login").send({
      email: "lounes.behloul@supinfo.com",
      password: "lounesBehloul",
    });

    await testSession.get("/my_account");
    // console.log(user);
    const response = await testSession.get("/users").expect(200);

    expect(response.body[0]["email"]).toEqual("lounes.behloul@supinfo.com");
  });
});

// describe("Users Router PUT /", () => {
//   let id;
//   beforeAll(async () => {
//     await User.deleteMany({});
//     const user = await User.create({
//       email: "test.user@gmail.com",
//       password: "test12",
//     });
//     id = user._id;
//   });

//   it("should update the user", async () => {
//     const response = await supertest(app)
//       .put(`/users/${id}`)
//       .send({
//         email: "test.user@gmail.com",
//         password: "tesm"
//       })
//       .expect(200);

//     expect(response.body).toMatchObject({ password: "tesm" });
//   });
// });

// describe("Users Router DELETE /", () => {
//   let id;
//   beforeAll(async () => {
//     await User.deleteMany({});
//     const user = await User.create({
//       email: "test.user@gmail.com",
//       password: "test12",
//     });
//     id = user._id;
//   });

//   it("should delete the user", async () => {
//     const response = await supertest(app)
//       .delete(`/users/${id}`)
//       .expect(200);

//     expect(response.body).toMatchObject({});
//   });
// });
