import express from "express";
import { User } from "../mongo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";

const rounds = 10;
const secretToken = 'lounes-soufian'

const router = express.Router();

router.post('/inscription', (request, response) => {
    bcrypt.hash(request.body.password, rounds, async (error, hash) => {
        if(error) response.status(500).json(error);
        else {
            const newUser = User({...request.body, password: hash});
            const userEmail = await User.findOne({ email: newUser.email});
            if (userEmail !== null) {
                response.status(409).json({ message: "Email déjà existant, veuillez utiliser une autre adresse !" });
                return;
            }
            request.headers.authorization = generateToken(newUser);
            newUser.save()
            .then(
                user => {
                    response.status(200).json({message: `Bienvenue ${user.username}, ton compte a été créé avec succès. Tu peux te connecter !`})
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
    return jwt.sign({data: user}, secretToken, {expiresIn: '240h'})
}

router.get("/login", (request, response) => {
    User.findOne({email : request.body.email})
    .then(user => {
            if (!user) response.status(404).json({error: "Pas d'utilisateur avec cet email"})
            else {
                bcrypt.compare(request.body.password, user.password, (error, match) => {
                    if (error) response.status(500).json(error);
                    else if (match) {
                        request.session.username = user.username;
                        request.session.userRole = user.role;
                        request.session.userID = user._id;
                        response.status(200).json({message: `Salut ${user.username}, tu as été connecté avec succès !`, 
                        id: user._id})
                    }
                    else response.status(403).json({error: "Le mot de passe est incorrect !"});
                })
            }
        }
    )
    .catch(error => {
        response.status(500).json(error)
    })

})

export default router;