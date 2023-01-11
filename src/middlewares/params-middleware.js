import mongoose from "mongoose";

import { User, Train, Trainstation, Ticket } from "../mongo.js";

export function isValidIDParameters() {
    return (request, response, next) => {
        if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
            response.status(400).json({ message: "Le format de l'ID n'est pas valide !" });
            return;
        } else {
            next();
        }
    };  
};

export function isAnExistingUser() {
    return async (request, response, next) => {
        const user = await User.findById(request.params.id);
        if (!user) {
            response.status(404).json({ message: "Utilisateur inexistant !" });
            return;
        } else {
            next();
        }
    };  
};

export function isAnExistingTrain() {
    return async (request, response, next) => {
        const train = await Train.findById(request.params.id);
        if (!train) {
            response.status(404).json({ message: "Train inexistant !" });
            return;
        } else {
            next();
        }
    };  
};

export function isAnExistingTrainstation() {
    return async (request, response, next) => {
        const trainstation = await Trainstation.findById(request.params.id);
        if (!trainstation) {
            response.status(404).json({ message: "Gare inexistante !" });
            return;
        } else {
            next();
        }
    };  
};

export function isAnExistingTicket() {
    return async (request, response, next) => {
        const ticket = await Ticket.findById(request.params.id);
        if (!ticket) {
            response.status(404).json({ message: "Billet inexistant !" });
            return;
        } else {
            next();
        }
    };  
};
  
export const isValidID = isValidIDParameters();
export const userExists = isAnExistingUser();
export const trainExists = isAnExistingTrain();
export const trainstationExists = isAnExistingTrainstation();
export const ticketExists = isAnExistingTicket();