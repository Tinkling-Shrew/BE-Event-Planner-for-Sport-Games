import express from "express";
import { getEvents } from "../controllers/events.controller.js";

const eventsRouter = express.Router();

eventsRouter.get("/", getEvents);

export default eventsRouter;
