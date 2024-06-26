import express from "express";
import mongoose from "mongoose";
import { Ticket, Train, User } from "../mongo.js";

import { isAdmin, isCurrentUser, isAdminOrCurrentUser } from "../middlewares/authentication-middleware.js";
import { isValidID, trainExists, ticketExists } from "../middlewares/params-middleware.js";

const router = express.Router();

router.get("/", isAdmin, async (request, response) => {
    const tickets = await Ticket.find();
    response.status(200).json(tickets);
});

router.post("/:id", isCurrentUser, isValidID, trainExists, async (request, response) => {
    const user = await User.findById(request.session.userID);
    const train = await Train.findById(request.params.id);

    const frenchTimezone = new Date().getTimezoneOffset() * 6E4;
    if (new Date(train.time_of_departure).getTime() < new Date().getTime() - frenchTimezone) {
        console.log(new Date(train.time_of_departure));
        console.log(new Date());
        response.status(404).json({ message: "La validité de ce ticket a expiré !" });
        return;
    };

    const newTicket = await Ticket.create({
        user: user,
        train: train,
        reservation_time: new Date()
    });
    
    response.status(201).json(newTicket);
});

router.post("/", isAdmin, async (request, response) => {
    const user = await User.findById(request.body.user_id);
    const train = await Train.findById(request.body.train_id);

    if (!train) {
        response.status(404).json({ message: "Train inexistant !" });
        return;
    }

    if (!user) {
        response.status(404).json({ message: "Utilisateur inexistant !" });
        return;
    }

    const newTicket = await Ticket.create({
        user: user,
        train: train,
        reservation_time: new Date()
    });
    
    response.status(201).json(newTicket);
});

router.put("/:id", isAdmin, isValidID, ticketExists, async (request, response) => {
    if (!mongoose.Types.ObjectId.isValid(request.body.user_id)) {
        response.status(400).json({ message: "Le format de l'ID n'est pas valide !" });
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(request.body.train_id)) {
        response.status(400).json({ message: "Le format de l'ID n'est pas valide !" });
        return;
    }

    const user = await User.findById(request.body.user_id);
    const train = await Train.findById(request.body.train_id);

    const ticket = await Ticket.findByIdAndUpdate(request.params.id, {
        user: user,
        train: train,
    });

    if (!ticket) {
        response.status(404).json({ message: "Ticket inexistant !" });
        return;
    }
  
    response.status(200).json(train);
});
  
router.delete("/:id", isAdminOrCurrentUser, isValidID, ticketExists, async (request, response) => {
    const id = request.params.id;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
        response.status(404).json({ message: "Ticket inexistant !" });
        return;
    }
    response.status(200).json({ message: `Le ticket ${id} a bien été supprimé !`, });
});


export default router;