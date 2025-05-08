import mongoose, { Document, Mongoose } from "mongoose";

interface IImages extends Document{
    _id: string
    userId: mongoose.Schema.Types.ObjectId
    url: string
    title: string
    position: number
}
export default IImages;