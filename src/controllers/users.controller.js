import User from "../models/User.js";

export const getUsers = async (req, resp) => {
	try {
		const users = await User.find().lean();
		resp.send(users);
	} catch (err) {
		resp.send({ message: err });
	}
};
