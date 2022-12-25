import supertest from "supertest";
import express from "express";

import { Train } from "../mongo.js";
import app from "../server.js";

describe("Trains Router POST /", () => {
  beforeAll(async () => {
    await Train.deleteMany({});
  });

  it("should add the Train", async () => {
    const response = await supertest(app)
      .post("/trains")
      .send({
        name: "SLOM",
        start_station: "Paris",
        end_station: "Lyon",
        time_of_departure: "2022-12-10T03:26:00.000Z",
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: "SLOM",
        start_station: "Paris",
        end_station: "Lyon",
        time_of_departure: "2022-12-10T03:26:00.000Z",
      })
    );
  });
});

describe("Trains Router GET /", () => {
  beforeAll(async () => {
    await Train.deleteMany({});
    await Train.create({
      name: "Paris-Lyon",
      start_station: "Paris",
      end_station: "Lyon",
      time_of_departure: "2022-12-10T03:26:00.000Z",
    });
    await Train.create({
      name: "Paris-Caen",
      start_station: "Paris",
      end_station: "Caen",
      time_of_departure: "2022-12-04T03:26:00.000Z",
    });
  });

  it("should get the list of train", async () => {
    const response = await supertest(app).get("/trains").expect(200);

    expect(response.body[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: "Paris-Lyon",
        start_station: "Paris",
        end_station: "Lyon",
        time_of_departure: "2022-12-10T03:26:00.000Z",
      })
    );
  });
});

describe("Trains Router PUT /", () => {
  let id;
  beforeAll(async () => {
    await Train.deleteMany({});
    const train = await Train.create({
      name: "Paris-Lyon",
      start_station: "Paris",
      end_station: "Lyon",
      time_of_departure: "2022-12-10T03:26:00.000Z",
    });
    id = train._id;
  });

  it("should update the train", async () => {
    const response = await supertest(app)
      .put(`/trains/${id}`)
      .send({
        start_station: "Caen",
      })
      .expect(200);

    expect(response.body).toMatchObject({ start_station: "Caen" });
  });
});

describe("Trains Router DELETE /", () => {
  let id;
  beforeAll(async () => {
    await Train.deleteMany({});
    const train = await Train.create({
      name: "Paris-Lyon",
      start_station: "Paris",
      end_station: "Lyon",
      time_of_departure: "2022-12-10T03:26:00.000Z",
    });
    id = train._id;
  });

  it("should delete the train", async () => {
    const response = await supertest(app).delete(`/trains/${id}`).expect(200);

    expect(response.body).toMatchObject({});
  });
});
