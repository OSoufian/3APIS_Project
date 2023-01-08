import express from "express";
import bcrypt from "bcrypt";

import { User, Ticket } from "../mongo.js";
import { isCurrentUser } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isCurrentUser, async (request, response) => {
  const id = request.session.userID;
  const user = await User.findById(id);
  response.status(200).json(user);
});

router.put("/", isCurrentUser, async (request, response) => {
  const user = await User.findOne({ email: request.body.email });

  if (user !== null && user.email !== request.session.userEmail) {
    response
      .status(409)
      .json({
        message: "Email déjà existant, veuillez utiliser une autre adresse !",
      });
    return;
  }
<<<<<<< HEAD
=======
  // TODO : vérifier si aucune modification a été faite (optionnel)
>>>>>>> 750d201778923506f450aabe14dc501939735e4e

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

  response.status(200).json({
    message: `Votre compte a bien été supprimé !`,
  });
});

router.get("/tickets", isCurrentUser, async (request, response) => {
  const id = request.session.userID;
<<<<<<< HEAD
  const tickets = await Ticket.find({ user : {user_id: id } });
  response.status(200).json(tickets);
});

router.get("/logout", isCurrentUser, async (request, response) => {
  request.session.destroy();
  response.status(200).send("Vous avez été déconnecté avec succcès !");
=======
  const tickets = await Ticket.find({ user_id: id });
  response.status(200).json(tickets);
>>>>>>> 750d201778923506f450aabe14dc501939735e4e
});

export default router;
