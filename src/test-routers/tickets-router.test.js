import session from "supertest-session";

import { User, Train } from "../mongo.js";
import app from "../server.js";

let testSession = null;

describe("Tickets Router GET /", () => {
    beforeAll(async () => {
      await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
      testSession = session(app);
  
      await testSession.post("/api/auth/inscription").send({
        email: "lounes.behloul@supinfo.com",
        username: "loki7even",
        password: "lounesBehloul",
        role: "admin",
      });
    });
  
    it("should get the list of tickets", async () => {
      await testSession.get("/api/auth/login").send({
        email: "lounes.behloul@supinfo.com",
        password: "lounesBehloul",
      });
  
      await testSession.get("/tickets").expect(200);
    });
  });

//   describe("Tickets Router POST /", () => {
//     let userId;
//     let trainId;
//     beforeAll(async () => {
//       await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
//       await Train.deleteMany({});

//         const train = await Train.create({
//             name: "RER C",
//             start_station: "Gare de Nord",
//             end_station: "Gare de Nord",
//             time_of_departure: "2022-01-14T14:35:00.220Z"
//         });

//         trainId = (train._id).toString();
//       testSession = session(app);
  
//       await testSession.post("/api/auth/inscription").send({
//         email: "lounes.behloul@supinfo.com",
//         username: "loki7even",
//         password: "lounesBehloul",
//         role: "admin",
//       });
//     });
  
//     it("should add a ticket", async () => {
//         await testSession.get("/api/auth/login").send({
//         email: "lounes.behloul@supinfo.com",
//         password: "lounesBehloul",
//       });
  
//       const response = await testSession
//         .post(`/tickets/${trainId}`)
//         .expect(201);

//         expect(response.body["name"]).toEqual("RER C");
//     });
//   });

//   describe("Tickets Router POST /", () => {
//     let userId;
//     let trainId;
//     beforeAll(async () => {
//       await User.findOneAndDelete({ email: "lounes.behloul@supinfo.com" });
//       await Train.deleteMany({});

//         const train = await Train.create({
//         name: "Paris-Lyon",
//         start_station: "Paris",
//         end_station: "Lyon",
//         time_of_departure: "2022-12-10T03:26:00.000Z",
//         });

//         await User.findOneAndDelete({ email: "test3.user@gmail.com" });
//         const user = await testSession.post("/api/auth/inscription").send({
//         email: "test3.user@gmail.com",
//         username: "tester3",
//         password: "test123",
//         });
//         userId = user.body.id;
//         trainId = train._id;
//         console.log(trainId, userId)
//       testSession = session(app);
  
//       await testSession.post("/api/auth/inscription").send({
//         email: "lounes.behloul@supinfo.com",
//         username: "loki7even",
//         password: "lounesBehloul",
//         role: "admin",
//       });
//     });
  
//     it("should add a ticket", async () => {
//       await testSession.get("/api/auth/login").send({
//         email: "lounes.behloul@supinfo.com",
//         password: "lounesBehloul",
//       });
  
//       const response = await testSession
//         .post("/tickets")
//         .send({
//             user_id: userId,
//             train_id: trainId
//         })
//         .expect(201);

//         expect(response.body["name"]).toEqual("Paris-Lyon");
//     });
//   });