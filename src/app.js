import express from "express";

import { Database } from "./util/database.js";
import eventRouter from "./routes/event.js";
import eventsRouter from "./routes/events.js";
import userRouter from "./routes/user.js";
import usersRouter from "./routes/users.js";

const app = express();
const database = new Database();

// export let events = [
//     {"id": "27f9cc70-d41a-4e0a-ba7a-99946c19a000", "participants":[], "max_participants": 9, "name":"Football Night", "description": "This event do be ballin'. Don't forget to join. :D", "host": "USERc9b3a1f3-4ee7-415d-9ce8-a22039a747ea", "location": "Earth", "starttime":"30.05.2022 12:00", "endtime":"30.05.2022 13:00", "state": "Upcoming"},
//     {"id": "c9b3a1f3-4ee7-415d-9ce8-a22039a747ea", "participants":[], "max_participants": 9, "name":"Sunday PingPong", "description": "Ping 129ms. Don't forget to join. :D", "host": "USERc9b3a1f3-4ee7-415d-9ce8-a22039a747ea", "location": "Mars", "starttime":"1.06.2022 12:00", "endtime":"1.06.2022 13:00", "state": "Upcoming"},
//     {"id": "43d35bcb-2b2e-4ef6-9236-ceb28962fa29", "participants":[], "max_participants": 9, "name":"Monday HIIT", "description": "This is gonna HIIT hard. Don't forget to join. :D", "host": "USERc9b3a1f3-4ee7-415d-9ce8-a22039a747ea", "location": "Jupyter", "starttime":"2.06.2022 12:00", "endtime":"2.06.2022 13:00", "state": "Upcoming"},
// ];

database.connect();
app.use(express.json());

// allow cross-origin. disable after testing!
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.get("/", (req, resp) => {
	resp.send(
		"Backed server for Sports Planner.<br><br>If you see this message, then it means that the server is running."
	);
});

// use routes
app.use("/api/event", eventRouter);
app.use("/api/events", eventsRouter);
app.use("/api/user", userRouter);
app.use("/api/users", usersRouter);

export default app;
