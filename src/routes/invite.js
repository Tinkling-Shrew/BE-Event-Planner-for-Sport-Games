import express from "express";
import { inviteMail } from "../controllers/invite.controller.js";

const inviteRouter = express.Router();

inviteRouter.post("/", inviteMail);

export default inviteRouter;
