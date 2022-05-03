import crypto from "crypto";
import moment from "moment";
import validateCreateEvent from "../util/validation.js";
import generateEventObj from "../util/eventMaker.js";
import Event from "../models/Event.js";

/* =============================================================================
   ||                   GET EVENT DATA FUNCTION (for route)                   ||
   ============================================================================= */
export const getEvent = async (req, resp) => {
    const event = await Event.find({ id: req.query.id }).lean();
    const currentTime = moment();
    if (!event[0]) return resp.status(404).send({});
    if (
        event[0].password !== null &&
        (!req.headers.password ||
            crypto
                .createHash("sha256")
                .update(req.headers.password)
                .digest("hex") != event[0].password)
    )
        return resp.status(401).send({});

    event[0].state =
        currentTime < event[0].starttime
            ? "Upcoming"
            : currentTime < event[0].endtime
            ? "Ongoing"
            : "Past";
    resp.send(event[0]);
};

/* =============================================================================
   ||                    CREATE EVENT FUNCTION (for route)                    ||
   ============================================================================= */
export const createEvent = async (req, resp) => {
    const { error } = validateCreateEvent(req.body);
    if (error) return resp.status(400).send(error.details[0].message);

    const newevent = new Event(generateEventObj(req.body));
    try {
        const savedevent = await newevent.save();
        resp.status(201).send(savedevent);
    } catch (err) {
        resp.status(400).send(err.message);
    }
};

/* =============================================================================
   ||                    UPDATE EVENT FUNCTION (for route)                    ||
   ============================================================================= */
export const updateEvent = async (req, resp) => {
    // check if event exists and user is authorized to view it
    const event = await Event.find({ id: req.query.id });
    if (!event[0]) return resp.status(404).send({});
    if (
        event[0].password !== null &&
        (!req.headers.password ||
            crypto
                .createHash("sha256")
                .update(req.headers.password)
                .digest("hex") != event[0].password)
    )
        return resp.status(401).send({});

    // check if replacement event is valid
    const { error } = validateCreateEvent(req.body);
    if (error) return resp.status(400).send(error.details[0].message);

    // update the event
    await Event.updateOne(
        { id: req.query.id },
        {
            $set: generateEventObj(req.body, event[0]),
            $currentDate: { lastModified: true },
        }
    );
    resp.send(await Event.find({ id: req.query.id }));
};

/* =============================================================================
   ||                    DELETE EVENT FUNCTION (for route)                    ||
   ============================================================================= */
export const deleteEvent = async (req, resp) => {
    // check if event exists and user is authorized to view it
    const event = await Event.find({ id: req.query.id });
    if (!event[0]) return resp.status(404).send("Event not found!");
    if (
        event[0].password !== null &&
        (!req.headers.password ||
            crypto
                .createHash("sha256")
                .update(req.headers.password)
                .digest("hex") != event[0].password)
    )
        return resp.status(401).send("Wrong password!");

    // delete event
    await Event.deleteOne({ id: req.query.id });
    resp.send("Deleted successfully!");
};
