import crypto from "crypto";
import moment from "moment";
import validateCreateEvent from "../util/eventValidation.js";
import generateEventObj from "../util/eventMaker.js";
import Event from "../models/Event.js";
import nodemailer from "nodemailer";

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
			crypto.createHash("sha256").update(req.headers.password).digest("hex") !=
				event[0].password)
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
	///////////
	//sending the invite email to selected people
	console.log("Ok ..");
	var transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,

		auth: {
			user: "jacklondon13552@gmail.com",
			pass: "MarieLuise5",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	console.log(newevent.participants);

	var mailOptions = {
		from: "'JackLondon' <jacklondon13552@gmail.com>", // sender address
		to: newevent.participants, // list of receivers
		subject: "Eveniment sportiv", // Subject line
		text: "Vrei sa participi la un eveniment sportiv?", // plain text body
	};
	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log("Message sent: %s", info.messageId);
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl);
	});

	///////////////////
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
			crypto.createHash("sha256").update(req.headers.password).digest("hex") !=
				event[0].password)
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
			crypto.createHash("sha256").update(req.headers.password).digest("hex") !=
				event[0].password)
	)
		return resp.status(401).send("Wrong password!");

	// delete event
	await Event.deleteOne({ id: req.query.id });
	resp.send("Deleted successfully!");
};
