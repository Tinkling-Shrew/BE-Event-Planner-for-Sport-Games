import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	phone: { type: Number, required: false },
});

export default mongoose.model("User", UserSchema);
