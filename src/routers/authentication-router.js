import express from "express";

import { User } from "../mongo.js";

const router = express.Router();

router.post("/login", async (request, response) => {
    const log = await User.findOne()
})

router.post('/signup', (request, response) => {

});