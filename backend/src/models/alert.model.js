import mongoose, { Schema } from "mongoose";

const alertSchema = new Schema({
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    alerttype: {
        type: String,
        enum: ["emergency", "ambulance", "none"],
        default: "none"
    },
    women: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    guardian: [
        {
            type: Schema.Types.ObjectId,
            ref: "Guardian"
        },
    ],

}, { timestamps: true })

export const Alert = mongoose.model("Alert", alertSchema)