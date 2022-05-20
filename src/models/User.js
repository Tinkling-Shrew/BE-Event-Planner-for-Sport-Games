import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
