import mongoose from "mongoose";

const InviteSchema = mongoose.Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    event: { type: String, required: true },
});

export default mongoose.model("Invite", InviteSchema);
