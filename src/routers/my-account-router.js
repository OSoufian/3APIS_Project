import express from "express";

import { User } from "../mongo.js";

const router = express.Router();

router.get("/", async (request, response) => {
    const id = request.session.userID;
  
    if (!id) {
      response.status(404).json({ message: "Aucun utilisateur connecté !" });
      return;
    }
  
    const user = await User.findById(id);
  
    response.status(200).json(user);    
});

export default router;