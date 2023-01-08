import express from "express";
import bcrypt from "bcrypt";

import { User } from "../mongo.js";
import { isAdmin, isAdminOrEmployee } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isAdminOrEmployee, async (request, response) => {
  const users = await User.find();
  // console.log(request.session);
  response.status(200).json(users);
});

router.get("/:id", isAdminOrEmployee, async (request, response) => {
  const id = request.params.id;
  const user = await User.findById(id);

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response.status(200).json(user);
});

router.put("/:id", isAdmin, async (request, response) => {
  const user = await User.findById(request.params.id);
  const newEmailUser = await User.findOne({ email: request.body.email});

  if (newEmailUser !== null && request.body.email !== user.email) {
    response.status(409).json({ message: "Email déjà existant, veuillez utiliser une autre adresse !" });
    return;
  }
  
  bcrypt.hash(request.body.password, 10, async (error, hash) => {
    if (error) response.status(500).json(error);
    else {
      const user = await User.findByIdAndUpdate(
        request.params.id,
        { ...request.body, password: hash },
        { new: true }
      );
      if (!user) {
        response.status(404).json({ message: "Utilisateur inexistant !" });
        return;
      }
      response.status(200).json(user);
    }
  });
});

router.delete("/:id", isAdmin, async (request, response) => {
  const id = request.params.id;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response.status(200).json({ message: `L'utilisateur ${request.params.id} a bien été supprimé !` });
});

export default router;