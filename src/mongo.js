import mongoose from "mongoose";
import yup from "yup";

const MONGODB_URI = "mongodb://localhost:27017/railroad";

const DBNAME =
  process.env.NODE_ENV === "test"
    ? "railroad-test"
    : "railroad";

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
    role: { type: String, default: 'user' }
});

const UserValidationSchema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required().min(8),
    role: yup.string().oneOf(['user', 'admin', 'employee']).default('user')
});

const TrainSchema = new mongoose.Schema({
    name: String,
    start_station: String,
    end_station: String,
    time_of_departure: Date
});

const TrainValidationSchema = yup.object().shape({
    name: yup.string().required(),
    start_station: yup.string().required(),
    end_station: yup.string().required(),
    time_of_departure: yup.date().required()
});

const TrainstationSchema = new mongoose.Schema({
    name: String,
    open_hour: {
        hours: {
            type: String
        },
        minutes: {
            type: String
        }
    },
    close_hour: {
        hours: {
            type: String
        },
        minutes: {
            type: String
        }
    },
    image: {
        name: String,
        ext: String,
        data: Buffer
    }
});

const TrainstationValidationSchema = yup.object().shape({
    name: yup.string().required(),
    open_hour: yup.object().shape({
        hours: yup.string().required(),
        minutes: yup.string().required()
    }),
    close_hour: yup.object().shape({
        hours: yup.string().required(),
        minutes: yup.string().required()
    }),
    image: yup.object().shape({
        name: yup.string().required(),
        ext: yup.string().required(),
        data: yup.mixed().required()
    })
});

TrainstationSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.image.data;
    return obj;
}

const TicketSchema = new mongoose.Schema({
    user: [UserSchema],
    train: [TrainSchema],
    reservation_time: Date
});


const TicketValidationSchema = yup.object().shape({
    user: yup.array().of(yup.object().shape({
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().required().min(8),
        role: yup.string().oneOf(['user', 'admin', 'employee']).default('user')
    }).required()),
    train: yup.array().of(yup.object().shape({
        name: yup.string().required(),
        start_station: yup.string().required(),
        end_station: yup.string().required(),
        time_of_departure: yup.date().required()
    }).required()),
    reservation_time: yup.date().required()
});

export const User = mongoose.model("User", UserSchema);
// export const UserValidation = mongoose.model("User", UserValidationSchema);
export const Train = mongoose.model("Train", TrainSchema);
// export const TrainValidation = mongoose.model("Train", TrainValidationSchema);
export const Trainstation = mongoose.model("Trainstation", TrainstationSchema);
// export const TrainstationValidation = mongoose.model("Trainstation", TrainstationValidationSchema);
export const Ticket = mongoose.model("Ticket", TicketSchema);
// export const TicketValidation = mongoose.model("Ticket", TicketValidationSchema);