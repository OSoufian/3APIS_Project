import express from "express";
import { Ticket, Train, User } from "../mongo.js";

import { isAdmin, isCurrentUser, isAdminOrCurrentUser } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isAdmin, async (request, response) => {
    const tickets = await Ticket.find();
    response.status(200).json(tickets);
  });

router.post("/:id", isCurrentUser, async (request, response) => {
    const user = await User.findById(request.session.userID);
    const train = await Train.findById(request.params.id);

    if (!train) {
        response.status(404).json({ message: "Train inexistant !" });
        return;
    }

<<<<<<< HEAD
    if (new Date(train.time_of_departure).getTime() < new Date().getTime()) {
        response.status(404).json({ message: "La validité de ce ticket a expiré !" });
        return;
    };
=======
    // TODO: verify the validity of the ticket
>>>>>>> 750d201778923506f450aabe14dc501939735e4e

    const newTicket = await Ticket.create({
        user: user,
        train: train,
        reservation_time: new Date() // TODO : Arranger la timezone
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

router.put("/:id", isCurrentUser, async (request, response) => {
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

router.put("/:id", isAdmin, async (request, response) => {
    const user = await User.findById(request.session.userID);
    const train = await Train.findById(request.body.train_id);

    const ticket = await Ticket.findByIdAndUpdate(request.params.id, {
        user: user,
        train: train,
    });
  
    if (!ticket) {
      response.status(404).json({ message: "Train inexistant !" });
      return;
    }
  
    response.status(200).json(train);
});
  
router.delete("/:id", isAdminOrCurrentUser, async (request, response) => {
    const id = request.params.id;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
        response.status(404).json({ message: "Ticket inexistant !" });
        return;
    }

    console.log(request.params);
    response.status(200).json({ message: `L'utilisateur ${request.params.id} a bien été supprimé !`, });
});


export default router;