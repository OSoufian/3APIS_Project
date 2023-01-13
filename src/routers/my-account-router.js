import express from "express";
import bcrypt from "bcrypt";

import { User, Ticket } from "../mongo.js";
import { isCurrentUser } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isCurrentUser, async (request, response) => {
  const user = await User.findById(request.session.userID);
  response.status(200).json(user);
});

router.put("/", isCurrentUser, async (request, response) => {
  const user = await User.findOne({ email: request.body.email });

  if (user !== null && user.email !== request.session.userEmail) {
    response.status(409).json({ message: "Email déjà existant, veuillez utiliser une autre adresse !" });
    return;
  }

  bcrypt.hash(request.body.password, 10, async (error, hash) => {
    if (error) response.status(500).json(error);
    else {
      const user = await User.findByIdAndUpdate(
        request.session.userID,
        { ...request.body, password: hash },
        { new: true }
      );
      response.status(200).json(user);
    }
  });
  
});

router.delete("/", isCurrentUser, async (request, response) => {
  await User.findByIdAndDelete(request.session.userID);
  response.status(200).json({ message: "Votre compte a bien été supprimé !" });
});

router.get("/tickets", isCurrentUser, async (request, response) => {
  const tickets = await Ticket.find({"user._id": request.session.userID });
  response.status(200).json(tickets);
});

router.get("/logout", isCurrentUser, async (request, response) => {
  request.session.destroy();
  response.status(200).json({message: "Vous avez été déconnecté avec succcès !" });
});

export default router;
