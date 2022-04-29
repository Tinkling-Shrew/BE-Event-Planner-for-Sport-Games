import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
    id: { type: String, required: true },
    participants: [{type: String, required: false}],
    max_participants: { type: Number, required: true},
    name: { type: String, required: true },
    sport: { type: String, required: true },
    description: { type: String, required: false },
    host: { type: String, required: true },
    location: { type: String, required: true },
    password: { type: String, required: false },
    starttime: { type: String, required: true },
    endtime: { type: String, required: true }
});

export default mongoose.model('Event', EventSchema);