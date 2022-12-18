import { Train } from "../mongo.js";
import express from "express";

const router = express.Router();

router.post("/", async (request, response) => {
    const newTrain = await Train.create(request.body);
    response.status(201).json(newTrain);
});
  
router.get("/", async (request, response) => {
    const trains = await Train.find();
    response.status(200).json(trains);
});

router.put("/:id", async (request, response) => {
    const id = request.params.id;
    const train = await Train.findByIdAndUpdate(id, request.body, { new: true });
  
    if (!train) {
      response.status(404).json({ message: "Train inexistant !" });
      return;
    }
  
    response.status(200).json(train);
});
  
router.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const train = await Train.findByIdAndDelete(id);

    if (!train) {
        response.status(404).json({ message: "Train inexistant !" });
        return;
    }

    console.log(request.params);
    response.status(200).json({ message: `L'utilisateur ${request.params.id} a bien été supprimé !`, });
});

export default router;