import express from "express";

import usersRouter from "./routers/users-router.js";
import authRoute from "./routers/authentication-router.js";
import trainsRouter from "./routers/trains-router.js";
import trainstationsRouter from "./routers/trainstations-router.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/api/auth", authRoute);
app.use("/trains", trainsRouter);
app.use("/trainstations", trainstationsRouter);

export default app;