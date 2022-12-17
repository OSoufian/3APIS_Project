import express from "express";

import { User } from "../mongo.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const newUser = await User.create(request.body);
  response.status(201).json(newUser);
});

router.get("/", async (request, response) => {
  const users = await User.find();
  response.status(200).json(users);
});

router.put("/:id", async (request, response) => {
  const id = request.params.id;
  const user = await User.findByIdAndUpdate(id, request.body, { new: true });

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response.status(200).json(user);
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    response.status(404).json({ message: "Utilisateur inexistant !" });
    return;
  }

  response
    .status(200)
    .json({
      message: `L'utilisateur ${request.params.username} a bien été supprimé !`,
    });
});

export default router;
