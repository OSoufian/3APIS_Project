import express from "express";
import { User } from "../mongo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";

const rounds = 10;
const secretToken = 'lounes-soufian'

const router = express.Router();

router.post('/inscription', (request, response) => {
    bcrypt.hash(request.body.password, rounds, (error, hash) => {
        if(error) response.status(500).json(error)
        else {
            const newUser = User({...request.body, password: hash});
            newUser.save()
            .then(
                user => {
                    response.status(200).json({user: user, token: generateToken(user)})
                }
            )
            .catch(
                error => {
                    response.status(500).json(error)
                }
            )
        }
    })
});

function generateToken(user) {
    return jwt.sign({data: user}, secretToken, {expiresIn: '24h'})
}

router.get("/login", (request, response) => {
    User.findOne({email : request.body.email})
    .then(user => {
            if (!user) response.status(404).json({error: "Pas d'utilisateur avec cet email"})
            else {
                bcrypt.compare(request.body.password, user.password, (error, match) => {
                    if (error) response.status(500).json(error);
                    else if (match) {
                        request.session.userRole = user.role;
                        request.session.userID = user._id;
                        response.status(200).json({user: user, token: generateToken(user)})
                    }
                    else response.status(403).json({error: "Le mot de passe est incorrect"});
                })
            }
        }
    )
    .catch(error => {
        response.status(500).json(error)
    })

})

export default router;