import supertest from "supertest";
import session from "supertest-session";
import bcrypt from "bcrypt";
import express from "express";

import { User } from "../mongo.js";
import app from "../server.js";

let testSession = null;

// describe("Users Router GET /", () => {
//     beforeAll(async () => {
//       await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
//       await User.findOneAndDelete({ email: "test3.user@gmail.com" });
//       testSession = session(app);
  
//       await testSession.post("/api/auth/inscription").send({
//         email: "lounes.behloul@supinfo.com",
//         username: "loki7even",
//         password: "lounesBehloul",
//         role: "admin",
//       });
//     });
  
//     it("should get the list of users", async () => {
//       await testSession.get("/api/auth/login").send({
//         email: "lounes.behloul@supinfo.com",
//         password: "lounesBehloul",
//       });
  
//       const response = await testSession.get("/users").expect(200);
//       expect(response.body[0]["email"]).toEqual("lounes.behloul@supinfo.com");
//     });
//   });

//   describe("Users Router GET /", () => {
//     beforeAll(async () => {
//       await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
//       await User.findOneAndDelete({ email: "test3.user@gmail.com" });
//       testSession = session(app);
  
//       await testSession.post("/api/auth/inscription").send({
//         email: "lounes.behloul@supinfo.com",
//         username: "loki7even",
//         password: "lounesBehloul",
//         role: "admin",
//       });
//     });
  
//     it("should get the list of users", async () => {
//       await testSession.get("/api/auth/login").send({
//         email: "lounes.behloul@supinfo.com",
//         password: "lounesBehloul",
//       });
  
//       const response = await testSession.get("/users").expect(200);
//       expect(response.body[0]["email"]).toEqual("lounes.behloul@supinfo.com");
//     });
//   });