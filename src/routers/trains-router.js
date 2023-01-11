import express from "express";

import { Train } from "../mongo.js";
import { isAdmin } from "../middlewares/authentication-middleware.js";
import { isValidID, trainExists } from "../middlewares/params-middleware.js";

const router = express.Router();

router.post("/", isAdmin, async (request, response) => {
    const newTrain = await Train.create(request.body);
    response.status(201).json(newTrain);
});
  
router.get("/", async (request, response) => {
    let trains = Train.find();

    if (request.headers.sort !== '') {
        const order = (request.headers.ascending === "false" ? -1 : 1);
        trains.sort({ [request.headers.sort]: order });
    }

    const limit = (request.headers.limit === '' ? 10 : request.headers.limit);
    trains.limit(limit);
    
    response.status(200).json(await trains);
});

router.put("/:id", isAdmin, isValidID, trainExists, async (request, response) => {
    const train = await Train.findByIdAndUpdate(request.params.id, request.body, { new: true });
  
    response.status(200).json(train);
});
  
router.delete("/:id", isAdmin, isValidID, trainExists, async (request, response) => {
    const id = request.params.id;
    await Train.findByIdAndDelete(id);

    response.status(200).json({ message: `Le train ${id} a bien été supprimé !`, });
});

export default router;