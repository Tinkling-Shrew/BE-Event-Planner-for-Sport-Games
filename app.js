const express = require('express');
const Joi = require('joi');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;
let events = [
    {"id": "27f9cc70-d41a-4e0a-ba7a-99946c19a000", "name":"Football Night", "date":"30.05.2022"}, 
    {"id": "c9b3a1f3-4ee7-415d-9ce8-a22039a747ea", "name":"Sunday PingPong", "date":"1.06.2022"}, 
    {"id": "43d35bcb-2b2e-4ef6-9236-ceb28962fa29", "name":"Monday HIIT", "date":"2.06.2022"}
];

function validateEvent(event) {
    const eventSchema = Joi.object({
        "name": Joi.string().required(),
        "date": Joi.string().required()
    });

    return eventSchema.validate(event);
} 

app.use(express.json());

app.get('/', (req, resp) => {
    resp.send("Hello World");
});

app.get('/api/events', (req, resp) => {
    resp.send(events);
});

app.get('/api/event/:id', (req, resp) => {
    const event = events.find(el => el.id==req.params.id);
    if(!event) 
        return resp.status(404).send({});

    resp.send(event);
});

app.post('/api/event/:id', (req, resp) => {
    const {error} = validateEvent(req.body);
    if(error) 
        return resp.status(400).send(error.details[0].message);

    const newevent = 
        {
            "id": crypto.randomUUID(),
            "name": req.body.name,
            "date": req.body.date
        };
    events.push(newevent);
    resp.status(201);
    resp.send(newevent);
});

app.put('/api/event/:id', (req, resp) => {
    // check if event exists
    const event = events.find(el => el.id==req.params.id);
    if(events.indexOf(event) == -1)
        return resp.status(404).send("Event not found!");

    // check if replacement event is valid
    const {error} = validateEvent(req.body);
    if(error)
        return resp.status(400).send(error.details[0].message);

    // update the event
    event.name = req.body.name;
    event.date = req.body.date;
    resp.send(event);
});

app.delete('/api/event/:id', (req, resp) => {
    const event = events.find(el => el.id==req.params.id);
    if(events.indexOf(event) == -1)
        return resp.status(404).send("Event not found!");

    events.splice(events.indexOf(event), 1);
    resp.send("OK");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));