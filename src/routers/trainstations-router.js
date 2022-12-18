import { Trainstation } from "../mongo.js";
import express from "express";

const router = express.Router();

router.post("/", async (request, response) => {
    const newTrainstation = await Trainstation.create(request.body);
    response.status(201).json(newTrainstation);
});
  
router.get("/", async (request, response) => {
    const trainstations = await Trainstation.find();
    response.status(200).json(trainstations);
});

router.put("/:id", async (request, response) => {
    const id = request.params.id;
    const trainstation = await Trainstation.findByIdAndUpdate(id, request.body, { new: true });
  
    if (!trainstation) {
      response.status(404).json({ message: "Gare inexistante !" });
      return;
    }
  
    response.status(200).json(trainstation);
});
  
router.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const trainstation = await Trainstation.findByIdAndDelete(id);

    if (!trainstation) {
        response.status(404).json({ message: "Gare inexistante !" });
        return;
    }

    console.log(request.params);
    response.status(200).json({ message: `La gare ${request.params.id} a bien été supprimé !`, });
});

export default router;