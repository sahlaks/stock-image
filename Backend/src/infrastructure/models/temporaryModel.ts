import mongoose, { Model, Schema } from "mongoose";
import ITemp from "../../domain/entities/temporary";

const tempSchema: Schema<ITemp> = new mongoose.Schema({
    email: {type: String},
    mobile: {type: String},
    password: { type: String},
    otp: { type: String},
    createdAt: { type: Date, default: Date.now, expires: '1h' }
})

const tempModel: Model<ITemp> = mongoose.model('Temp', tempSchema)
export default tempModel;