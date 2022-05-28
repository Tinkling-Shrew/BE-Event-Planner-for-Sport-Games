import express from "express";
import {
    inviteMail,
    inviteResponse,
    inviteInfo,
} from "../controllers/invite.controller.js";

const inviteRouter = express.Router();

inviteRouter.post("/", inviteMail);
inviteRouter.post("/:id", inviteResponse);
inviteRouter.get("/:id", inviteInfo);

export default inviteRouter;
