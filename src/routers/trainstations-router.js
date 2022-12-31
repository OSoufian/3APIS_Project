import { Trainstation } from "../mongo.js";
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const re = /(?:\.([^.]+))?$/;

router.post("/", upload.single("image"), async (request, response) => {
    let ext;
    let data;

    request.file ? ext = re.exec(request.file.originalname)[1] : ext = null;
    request.file ? data = fs.readFileSync("uploads/" + request.file.filename) : data = null;

    const newTrainstation = Trainstation({
        ...request.body,
        open_hour: { hours: request.body.open_hours, minutes: request.body.open_minutes },
        close_hour: { hours: request.body.close_hours, minutes: request.body.close_minutes },
        image: {
            name: request.file ? request.file.originalname : null,
            ext: ext,
            data: data,          
        },
    });
    newTrainstation.save();
    response.status(201).json(newTrainstation);
});
  
router.get("/", async (request, response) => {
    const trainstations = Trainstation.find();

    if (request.headers.sort == "name") {
        const order = (request.headers.ascending === "false" ? -1 : 1);
        trainstations.sort({ [request.headers.sort]: order });
    }
    response.status(200).json(await trainstations);
});

router.put("/:id", upload.single("image"), async (request, response) => {
    const id = request.params.id;
    let ext;
    request.file ? ext = re.exec(request.file.originalname)[1] : null;
    let data;
    request.file ? data = fs.readFileSync("uploads/" + request.file.filename) : data = null;
    const trainstation = await Trainstation.findByIdAndUpdate(id,
        {
            name: request.body.name,
            open_hour: { hours: request.body.open_hours, minutes: request.body.open_minutes },
            close_hour: { hours: request.body.close_hours, minutes: request.body.close_minutes },
            image: {
                name: request.file ? request.file.originalname : null,
                ext: ext,
                data: data,
            }
        },         
        { new: true });
  
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

    response.status(200).json({ message: `La gare ${request.params.id} a bien été supprimé !`, });
});

export default router;