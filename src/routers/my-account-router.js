import express from "express";

import { User, Ticket } from "../mongo.js";
import { isCurrentUser } from "../middlewares/authentication-middleware.js";

const router = express.Router();

router.get("/", isCurrentUser, async (request, response) => {
    const id = request.session.userID;
    const user = await User.findById(id);  
    response.status(200).json(user);    
});

router.put("/", isCurrentUser, async (request, response) => {
    const id = request.session.userID;
    const user = await User.findByIdAndUpdate(id, request.body, { new: true });
  
    response.status(200).json(user);
});
  
router.delete("/", isCurrentUser, async (request, response) => {
    const id = request.session.userID;
    const user = await User.findByIdAndDelete(id);

    response.status(200).json({
        message: `L'utilisateur ${request.session.username} a bien été supprimé !`,
    });
});

router.get("/tickets", isCurrentUser, async (request, response) => {
    const id = request.session.userID;
    const tickets = await Ticket.find( {user_id: id} );  
    response.status(200).json(tickets);    
});

export default router;