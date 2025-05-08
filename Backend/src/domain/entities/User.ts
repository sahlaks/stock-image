import { Document } from "mongoose";

interface IUser extends Document {
    _id: string
    email: string
    mobile: string
    password: string
}

export default IUser