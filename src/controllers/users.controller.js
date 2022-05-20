import User from "../models/User.js";
import validateCreateUser from "../util/userValidation.js";
import generateUserObj from "../util/userMaker.js";

/* =============================================================================
   ||                   GET ALL USERS FUNCTION (for route)                   ||
   ============================================================================= */
// SHOULDN'T EXIST. BAD FOR SECURITY. REMOVE LATER !!!!
export const getUsers = async (req, resp) => {
    try {
        const users = await User.find().lean();
        resp.send(users);
    } catch (err) {
        resp.send({ message: err });
    }
};

/* =============================================================================
   ||                   GET USER DATA FUNCTION (for route)                   ||
   ============================================================================= */
export const getUser = async (req, resp) => {
    const user = await User.find({ id: req.params.id }).lean();

    if (!user[0]) return resp.status(404).send({});
    delete user[0].password;
    resp.send(user[0]);
};

/* =============================================================================
   ||                    CREATE USER FUNCTION (for route)                    ||
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
   ||                    UPDATE USER FUNCTION (for route)                    ||
   ============================================================================= */
export const updateUser = async (req, resp) => {
    // check if user exists
    const user = await User.find({ id: req.params.id });
    if (!user[0]) return resp.status(404).send({});

    // check if replacement user is valid
    const { error } = validateCreateUser(req.body);
    if (error) return resp.status(400).send(error.details[0].message);

    // update the user
    await User.updateOne(
        { id: req.params.id },
        {
            $set: generateUserObj(req.body, user[0]),
            $currentDate: { lastModified: true },
        }
    );
    resp.send(await User.find({ id: req.params.id }));
};

/* =============================================================================
   ||                    DELETE USER FUNCTION (for route)                    ||
   ============================================================================= */
export const deleteUser = async (req, resp) => {
    // check if user exists
    const user = await User.find({ id: req.params.id });
    if (!user[0]) return resp.status(404).send("user not found!");

    // delete user
    await User.deleteOne({ id: req.params.id });
    resp.send("Deleted successfully!");
};
