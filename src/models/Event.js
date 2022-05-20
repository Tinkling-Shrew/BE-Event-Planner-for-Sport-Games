import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
    id: { type: String, required: true },
    participants: [{ type: String, required: false }],
    max_participants: { type: Number, required: true },
    name: { type: String, required: true },
    sport: { type: String, required: true },
    description: { type: String, required: false },
    host: {
        username: { type: String, required: true },
        email: { type: String, required: false },
    },
    location: { type: String, required: true },
    password: { type: String, required: false },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    repeat: {
        mode: { type: String, required: true },
        count: { type: Number, required: false },
    },
});

export default mongoose.model("Event", EventSchema);
