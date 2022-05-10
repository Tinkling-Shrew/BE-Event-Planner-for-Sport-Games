import validateCreateUser from "../util/userValidation.js";
import generateUserObj from "../util/userMaker.js";
import User from "../models/User.js";

/* =============================================================================
   ||                   GET user DATA FUNCTION (for route)                   ||
   ============================================================================= */
export const getUser = async (req, resp) => {
	const user = await User.find({ id: req.query.id }).lean();

	if (!user[0]) return resp.status(404).send({});

	resp.send(user[0]);
};

/* =============================================================================
   ||                    CREATE user FUNCTION (for route)                    ||
   ============================================================================= */
export const createUser = async (req, resp) => {
	const { error } = validateCreateUser(req.body);
	if (error) return resp.status(400).send(error.details[0].message);

	const newuser = new User(generateUserObj(req.body));
	try {
		const saveduser = await newuser.save();
		resp.status(201).send(saveduser);
	} catch (err) {
		resp.status(400).send(err.message);
	}
};

/* =============================================================================
   ||                    UPDATE user FUNCTION (for route)                    ||
   ============================================================================= */
export const updateUser = async (req, resp) => {
	// check if user exists
	const user = await User.find({ id: req.query.id });
	if (!user[0]) return resp.status(404).send({});

	// check if replacement user is valid
	const { error } = validateCreateUser(req.body);
	if (error) return resp.status(400).send(error.details[0].message);

	// update the user
	await user.updateOne(
		{ id: req.query.id },
		{
			$set: generateUserObj(req.body, user[0]),
			$currentDate: { lastModified: true },
		}
	);
	resp.send(await User.find({ id: req.query.id }));
};

/* =============================================================================
   ||                    DELETE user FUNCTION (for route)                    ||
   ============================================================================= */
export const deleteUser = async (req, resp) => {
	// check if user exists
	const user = await User.find({ id: req.query.id });
	if (!user[0]) return resp.status(404).send("user not found!");

	// delete user
	await User.deleteOne({ id: req.query.id });
	resp.send("Deleted successfully!");
};
