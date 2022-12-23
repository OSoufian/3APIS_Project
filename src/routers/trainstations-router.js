import { Trainstation } from "../mongo.js";
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (request, response) => {
    // const newTrain = await Train.create(request.body);
    // console.log(request.body);
    // response.status(201).json(newTrain);

    var re = /(?:\.([^.]+))?$/;

    var ext = re.exec(request.file.originalname)[1];

    const newTrainstation =  Trainstation({
        ...request.body,
        open_hour: { hours: request.body.open_hours, minutes: request.body.open_minutes },
        close_hour: { hours: request.body.close_hours, minutes: request.body.close_minutes },
        image: {
            name: request.file.originalname,
            ext: ext,
            data: fs.readFileSync("uploads/" + request.file.filename),          
        },
    });
    newTrainstation.save();
    response.status(201).json(newTrainstation);
});

// router.post("/", async (request, response) => {
//     const newTrainstation = await Trainstation.create(request.body);
//     response.status(201).json(newTrainstation);
// });
  
// router.get("/", async (request, response) => {
//     const trainstations = await Trainstation.find();
//     response.status(200).json(trainstations);
// });

// router.put("/:id", async (request, response) => {
//     const id = request.params.id;
//     const trainstation = await Trainstation.findByIdAndUpdate(id, request.body, { new: true });
  
//     if (!trainstation) {
//       response.status(404).json({ message: "Gare inexistante !" });
//       return;
//     }
  
//     response.status(200).json(trainstation);
// });
  
// router.delete("/:id", async (request, response) => {
//     const id = request.params.id;
//     const trainstation = await Trainstation.findByIdAndDelete(id);

//     if (!trainstation) {
//         response.status(404).json({ message: "Gare inexistante !" });
//         return;
//     }

//     console.log(request.params);
//     response.status(200).json({ message: `La gare ${request.params.id} a bien été supprimé !`, });
// });

export default router;