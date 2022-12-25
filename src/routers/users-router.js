import express from "express";
import session from "express-session";

import { User } from "../mongo.js";
import { isAdmin, isAdminOrEmployee } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isAdminOrEmployee, async (request, response) => {
  const users = await User.find();
  console.log(request.session);
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
  const id = request.params.id;
  const user = await User.findByIdAndUpdate(id, request.body, { new: true });

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response.status(200).json(user);
});

router.delete("/:id", isAdmin, async (request, response) => {
  const id = request.params.id;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response
    .status(200)
    .json({
      message: `L'utilisateur ${request.params.id} a bien été supprimé !`,
    });
});

export default router;