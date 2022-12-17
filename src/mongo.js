import mongoose from "mongoose";

const MONGODB_URI = "mongodb://supinfo:supinfo2022@mongo.cyprientaib.com";

const DBNAME = "railroad-soufian-lounes";

mongoose.connect(MONGODB_URI, {
    dbName: DBNAME,
});

mongoose.connection.on("error", (e) => {
    console.log("Erreur", e.toString());
});

mongoose.connection.on("connected", () => {
    console.log("Connection à MongoDB établi !");
});

const UserSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    role: { type: String, default: 'user' },
});

export const User = mongoose.model("User", UserSchema);