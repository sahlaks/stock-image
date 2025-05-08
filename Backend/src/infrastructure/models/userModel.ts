import mongoose, { Model, Schema } from "mongoose";
import IUser from "../../domain/entities/User";

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: {type: String},
    mobile: {type: String},
    password: {type: String}
})

const userModel: Model<IUser> = mongoose.model('User', userSchema);
export default userModel;