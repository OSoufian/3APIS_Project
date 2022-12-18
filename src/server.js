import express from "express";

import usersRouter from "./routers/users-router.js";
import authRoute from "./routers/authentication-router";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/api/auth", authRoute);

export default app;