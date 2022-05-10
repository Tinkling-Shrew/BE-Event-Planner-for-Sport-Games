import Event from "../models/Event.js";
import moment from "moment";

export const getEvents = async (req, resp) => {
	try {
		const currentTime = moment();
		const events = await Event.find().lean();

		events.forEach((ev) => {
			ev.state =
				currentTime < ev.starttime
					? "Upcoming"
					: currentTime < ev.endtime
					? "Ongoing"
					: "Past";
		});

		resp.send(
			events.filter((ev) => {
				return ev.password === null;
			})
		);
	} catch (err) {
		resp.send({ message: err });
	}
};
