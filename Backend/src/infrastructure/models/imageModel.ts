import mongoose, { Model, Schema } from "mongoose";
import IImages from "../../domain/entities/images";

const imageSchema : Schema<IImages> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    url: {type: String},
    title: {type: String},
    position : {
        type: Number,
        default: 0}
})

const imageModel: Model<IImages> = mongoose.model('Image', imageSchema);
export default imageModel;