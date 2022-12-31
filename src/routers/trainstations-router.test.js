import supertest from "supertest";
import express from "express";

import { Trainstation } from "../mongo.js";
import app from "../server.js";
import { IMAGE, IMAGE2 } from "../../trainstationImage";
import { any } from "webidl-conversions";

describe("Trainstations Router POST /", () => {
    beforeAll(async () => {
      await Trainstation.deleteMany({});
    });
  
    it("should add the Trainstation", async () => {
      const response = await supertest(app)
        .post("/trainstations")
        .send({
            name: "Paris-Lyon",
            open_hour: {hours: "12", minutes: "00"},
            close_hour: {hours: "16", minutes: "00"},
            image: IMAGE
        })
        .expect(201);

        expect(response.body["name"]).toEqual("Paris-Lyon");
    });
  });

describe("Trainstations Router GET /", () => {
  beforeAll(async () => {
    await Trainstation.deleteMany({});
    await Trainstation.create({
      name: "Paris-Lyon",
      open_hour: {hours: "12", minutes: "00"},
      close_hour: {hours: "16", minutes: "00"},
      image: IMAGE
    });
    await Trainstation.create({
        name: "Paris-Caen",
        open_hour: {hours: "10", minutes: "00"},
        close_hour: {hours: "18", minutes: "00"},
        image: IMAGE
      });
  });

  it("should get the list of trainstations", async () => {
    const response = await supertest(app)
      .get("/trainstations")
      .expect(200);

    expect(response.body[0]).toEqual(
      {
        __v: expect.any(Number),
        _id: expect.any(String),
        name: "Paris-Lyon",
        open_hour: {hours: "12", minutes: "00"},
        close_hour: {hours: "16", minutes: "00"},
        image: IMAGE2
      }
    );
  });
});

describe("Trainstations Router PUT /", () => {
  let id;
  beforeAll(async () => {
    await Trainstation.deleteMany({});
    const trainstation = await Trainstation.create({
        name: "Paris-Lyon",
        open_hour: {hours: "12", minutes: "00"},
        close_hour: {hours: "16", minutes: "00"},
        image: IMAGE
    });
    id = trainstation._id;
  });

  it("should update the trainstation", async () => {
    const response = await supertest(app)
      .put(`/trainstations/${id}`)
      .send({
        name: "Paris-Bercy"
      })
      .expect(200);

      expect(response.body).toMatchObject({
        name: "Paris-Bercy"
      });
  });
});

describe("Trainstations Router DELETE /", () => {
  let id;
  beforeAll(async () => {
    await Trainstation.deleteMany({});
    const trainstation = await Trainstation.create({
        name: "Paris-Lyon",
        open_hour: {hours: "12", minutes: "00"},
        close_hour: {hours: "16", minutes: "00"},
        image: IMAGE
    });
    id = trainstation._id;
  });

  it("should delete the trainstation", async () => {
    const response = await supertest(app)
      .delete(`/trainstations/${id}`)
      .expect(200);

    expect(response.body).toMatchObject({});
  });
});
