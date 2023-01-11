import express from "express";
import multer from "multer";
import fs from "fs";
import sharp from "sharp";

import { Trainstation, Train } from "../mongo.js";
import { isAdmin } from "../middlewares/authentication-middleware.js";
import { isValidID, trainstationExists } from "../middlewares/params-middleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/original/" });

const re = /(?:\.([^.]+))?$/;

router.post("/", isAdmin, upload.single("image"), async (request, response) => {
    let ext;
    let data;

    if (request.file) {
        ext = re.exec(request.file.originalname)[1];
        data = fs.readFileSync("uploads/original/" + request.file.filename);
        await sharp("uploads/original/" + request.file.filename).resize({
            width: 200,
            height: 200
        }).toFile(`uploads/resized/${request.file.filename}-resized`);

        data = fs.readFileSync(`uploads/resized/${request.file.filename}-resized`)
    } else {
        ext = null;
        data = null;
    }

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

router.put("/:id", isAdmin, isValidID, trainstationExists, upload.single("image"), async (request, response) => {
    let ext;
    request.file ? ext = re.exec(request.file.originalname)[1] : null;
    let data;
    request.file ? data = fs.readFileSync("uploads/original/" + request.file.filename) : data = null;
    const trainstation = await Trainstation.findByIdAndUpdate(request.params.id,
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
  
    response.status(200).json(trainstation);
});
  
router.delete("/:id", isAdmin, isValidID, trainstationExists, async (request, response) => {
    const trainstation = await Trainstation.findByIdAndDelete(request.params.id);

    const start_trains = Train.find({ start_station: trainstation.name });
    const end_trains = Train.find({ end_station: trainstation.name });
    const trains = Object.entries(await start_trains).concat(Object.entries(await end_trains));
    start_trains.clone().deleteMany().exec();
    end_trains.clone().deleteMany().exec();

    let json = [{trainstation: `La ${trainstation.name} a bien été supprimé !`}];
    trains.forEach(train => json.push({train: `Le train ${train[1].name} a bien été supprimé !`}));

    response.status(200).json(json);
});

export default router;