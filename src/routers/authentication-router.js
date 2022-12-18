import express from "express";
import { User } from "../mongo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const rounds = 10;
const secretToken = 'lounes-soufian'

const router = express.Router();

router.post('/inscription', (request, response) => {
    bcrypt.hash(request.body.password, rounds, (error, hash) => {
        if(error) response.status(500).json(error)
        else {
            const newUser = User({email: request.body.email, password: hash});
            newUser.save()
            .then(
                user => {
                    response.status(200).json({token: generateToken(user)})
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

router.post("/login", async (request, response) => {
    const log = await User.findOne()
})

export default router;