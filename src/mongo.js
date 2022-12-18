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

const TrainSchema = new mongoose.Schema({
    name: String,
    start_station: String,
    end_station: String,
    time_of_departure: Date,
});
const TrainstationSchema = new mongoose.Schema({
    name: String,
    open_hour: Date,
    close_hour: Date,
});

export const User = mongoose.model("User", UserSchema);
export const Train = mongoose.model("Train", TrainSchema);
export const Trainstation = mongoose.model("Trainstation", TrainstationSchema);