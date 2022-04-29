import validateCreateEvent from "../util/validation.js";
import Event from "../models/Event.js"
import crypto from "crypto";
import express from "express";

const eventRouter = express.Router();

eventRouter.get('/:id', async (req, resp) => {
    const event = await Event.find({id: req.params.id});
    if(!event[0]) 
        return resp.status(404).send({});
    if(event[0].password !== null && (!req.headers.password || crypto.createHash('sha256').update(req.headers.password).digest('hex') != event[0].password))
        return resp.status(401).send({});

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

eventRouter.put('/:id', async (req, resp) => {
    // check if event exists and user is authorized to view it
    const event = await Event.find({id: req.params.id});
    if(!event[0]) 
        return resp.status(404).send({});
    if(event[0].password !== null && (!req.headers.password || crypto.createHash('sha256').update(req.headers.password).digest('hex') != event[0].password))
        return resp.status(401).send({});

    // check if replacement event is valid
    const {error} = validateCreateEvent(req.body);
    if(error)
        return resp.status(400).send(error.details[0].message);

    // update the event
    await Event.updateOne({id: req.params.id}, {
        $set: {
            "max_participants": req.body.max_participants,
            "name": req.body.name,
            "sport": req.body.sport,
            "description": req.body.description && req.body.description != "" ? req.body.description : "No description available.",
            "location": req.body.location,
            "password": req.body.password && req.body.password != "" ? crypto.createHash('sha256').update(req.body.password).digest('hex') : null,
            "starttime": req.body.starttime,
            "endtime": req.body.endtime
        },
        $currentDate: { lastModified: true }
    });
    resp.send(await Event.find({id: req.params.id}));
});

eventRouter.delete('/:id', async (req, resp) => {
    // check if event exists and user is authorized to view it
    const event = await Event.find({id: req.params.id});
    if(!event[0]) 
        return resp.status(404).send("Event not found!");
    if(event[0].password !== null && (!req.headers.password || crypto.createHash('sha256').update(req.headers.password).digest('hex') != event[0].password))
        return resp.status(401).send("Wrong password!");

    // delete event
    await Event.deleteOne({id: req.params.id});
    resp.send("Deleted successfully!");
});

export default eventRouter;