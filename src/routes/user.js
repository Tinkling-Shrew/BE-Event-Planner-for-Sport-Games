import express from "express";
import {
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/", createUser);
userRouter.put("/", updateUser);
userRouter.delete("/", deleteUser);

export default userRouter;
