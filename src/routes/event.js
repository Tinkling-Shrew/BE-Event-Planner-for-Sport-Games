import express from "express";
import {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.get("/", getEvent);
eventRouter.post("/", createEvent);
eventRouter.put("/", updateEvent);
eventRouter.delete("/", deleteEvent);

export default eventRouter;
