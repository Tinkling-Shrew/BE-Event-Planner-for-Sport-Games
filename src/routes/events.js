import Event from "../models/Event.js";
import express from 'express';

const eventsRouter = express.Router();

eventsRouter.get('/', async (req, resp) => {
    try {
        const currentTime = new Date().getTime();
        const events = await Event.find().lean();
        
        events.forEach((ev) => {
            ev.state = currentTime < ev.starttime ? "Upcoming" : currentTime < ev.endtime ? "Ongoing" : "Past";
        });
        resp.send(events.filter((ev) => {return ev.password === null}));
    } catch(err) {
        resp.send({message: err})
    }
});

export default eventsRouter;