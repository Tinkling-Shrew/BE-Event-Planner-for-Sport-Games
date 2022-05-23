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
//eventsRouter.put("/:id", updateEvent);        // As there is no way to verify the identity of a user, events
//eventsRouter.delete("/:id", deleteEvent);     // are read-only after creation and they get automatically deleted

export default eventsRouter;
