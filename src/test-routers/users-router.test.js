import session from "supertest-session";

import { User } from "../mongo.js";
import app from "../server.js";

let testSession = null;

describe("Users Router GET /", () => {
  beforeAll(async () => {
    await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
    await User.findOneAndDelete({ email: "test3.user@gmail.com" });
    testSession = session(app);

    await testSession.post("/api/auth/inscription").send({
      email: "lounes.behloul@supinfo.com",
      username: "loki7even",
      password: "lounesBehloul",
      role: "admin",
    });
  });

  it("should get the list of users", async () => {
    await testSession.get("/api/auth/login").send({
      email: "lounes.behloul@supinfo.com",
      password: "lounesBehloul",
    });

    const response = await testSession.get("/users").expect(200);
    expect(response.body.length).not.toEqual(0);
  });
});

describe("Users Router GET /", () => {

  let id;
  beforeAll(async () => {
    const user = await testSession.post("/api/auth/inscription").send({
      email: "test3.user@gmail.com",
      username: "tester3",
      password: "test123",
    });
    id = user.body.id;
  });

  it("should get a user by id", async () => {
    await testSession.get("/api/auth/login").send({
      email: "lounes.behloul@supinfo.com",
      password: "lounesBehloul",
    });

    const response = await testSession.get(`/users/${id}`).expect(200);
    expect(response.body["username"]).toEqual("tester3");
  });
});

describe("Users Router DELETE /", () => {
  let id;
  beforeAll(async () => {
    await User.findOneAndDelete({ email: "test3.user@gmail.com" });
    const user = await testSession.post("/api/auth/inscription").send({
      email: "test3.user@gmail.com",
      username: "tester3",
      password: "test123",
    });
    id = user.body.id;
  });

  it("should delete the user", async () => {
    await testSession.get("/api/auth/login").send({
      email: "lounes.behloul@supinfo.com",
      password: "lounesBehloul",
    });

    const response = await testSession.delete(`/users/${id}`).expect(200);

    expect(response.body).toMatchObject({});
  });
});

  describe("Users Router PUT /", () => {
    let id;
    beforeAll(async () => {
      testSession = session(app);
      const user = await testSession.post("/api/auth/inscription").send({
        email: "test3.user@gmail.com",
        username: "tester3",
        password: "test123",
      });
      id = user.body.id;
    });
  
    it("should update the user", async () => {
      await testSession.get("/api/auth/login").send({
        email: "lounes.behloul@supinfo.com",
        password: "lounesBehloul",
      });
  
      const response = await testSession
        .put(`/users/${id}`)
        .send({
          email: "test3.user@gmail.com",
          username: "tesmaa",
          password: "test123"
        })
        .expect(200);
  
      expect(response.body.user).toMatchObject({ username: "tesmaa" });
    });
  });