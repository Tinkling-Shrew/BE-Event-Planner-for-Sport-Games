import { events } from "../app.js";
import validateCreateEvent from "../util/validation.js";
import Event from "../models/Event.js"
import crypto from "crypto";
import express from "express";

const eventRouter = express.Router();

eventRouter.get('/:id', (req, resp) => {
    const event = events.find(el => el.id==req.params.id);
    if(!event) 
        return resp.status(404).send({});

    resp.send(event);
});

eventRouter.post('/', async (req, resp) => {
    const {error} = validateCreateEvent(req.body);
    if(error) 
        return resp.status(400).send(error.details[0].message);

    const newevent = new Event({
            id: crypto.randomUUID(),
            participants: [],
            max_participants: req.body.max_participants,
            name: req.body.name,
            sport: req.body.sport,
            description: req.body.description && req.body.description != "" ? req.body.description : "No description available.",
            host: "USER000000-00000-000000-000000",
            location: req.body.location,
            password: req.body.password && req.body.password != "" ? crypto.createHash('sha256').update(req.body.password).digest('hex') : null,
            starttime: req.body.starttime,
            endtime: req.body.endtime
        });
    try {
        const savedevent = await newevent.save();
        resp.status(201);
        resp.send(savedevent);
    } catch (err) {
        resp.status(400);
        resp.send({message: err})
    }
});

eventRouter.put('/:id', (req, resp) => {
    // check if event exists
    const event = events.find(el => el.id==req.params.id);
    if(events.indexOf(event) == -1)
        return resp.status(404).send("Event not found!");

    // check if replacement event is valid
    const {error} = validateCreateEvent(req.body);
    if(error)
        return resp.status(400).send(error.details[0].message);

    // update the event
    event.name = req.body.name;
    event.date = req.body.date;
    resp.send(event);
});

eventRouter.delete('/:id', (req, resp) => {
    const event = events.find(el => el.id==req.params.id);
    if(events.indexOf(event) == -1)
        return resp.status(404).send("Event not found!");

    events.splice(events.indexOf(event), 1);
    resp.send("OK");
});

export default eventRouter;