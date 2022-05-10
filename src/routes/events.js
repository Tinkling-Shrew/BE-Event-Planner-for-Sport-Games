import express from "express";
import {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/events.controller.js";

const eventsRouter = express.Router();

eventsRouter.get("/", getEvents);
eventsRouter.get("/:id", getEvent);
eventsRouter.post("/", createEvent);
eventsRouter.put("/:id", updateEvent);
eventsRouter.delete("/:id", deleteEvent);

export default eventsRouter;
