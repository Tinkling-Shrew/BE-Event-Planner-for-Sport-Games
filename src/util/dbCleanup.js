import schedule from "node-schedule";
import Event from "../models/Event.js";
import Invite from "../models/Invite.js";
import moment from "moment";

const scheduleDBCleanup = () => {
    schedule.scheduleJob("5 * * * *", DBCleanup); // update every hour at HH:05
    // schedule.scheduleJob("*/1 * * * *", DBCleanup); // update every minute; for testing purposes
};

const updateEvent = async (event) => {
    let new_start;
    let new_end;

    switch (event.repeat.mode) {
        case "daily":
            new_start = moment(event.start_time).add(1, "day");
            new_end = moment(event.end_time).add(1, "day");
            break;

        case "weekly":
            new_start = moment(event.start_time).add(1, "week");
            new_end = moment(event.end_time).add(1, "week");
            break;

        case "monthly":
            new_start = moment(event.start_time).add(1, "month");
            new_end = moment(event.end_time).add(1, "month");
            break;

        default:
            new_start = moment(event.start_time);
            new_end = moment(event.end_time);

            console.log(
                `   [WARN] Unknown repeat mode (${event.repeat.mode}) for event: ${event.id}`
            );
            break;
    }

    await Event.updateOne(
        { id: event.id },
        {
            $set: {
                start_time: new_start.toDate(),
                end_time: new_end.toDate(),
                repeat: {
                    mode: event.repeat.mode,
                    count: event.repeat.count - 1,
                },
            },
            $currentDate: { lastModified: true },
        }
    );
};

const DBCleanup = async () => {
    console.log(
        `Cleanup started! Updating or deleting past events and invites...`
    );

    let deletedEvents = [];
    let updatedEvents = [];
    const currentTime = moment();
    const events = await Event.find().lean();

    events.forEach(async (ev) => {
        if (currentTime > ev.end_time) {
            if (ev.repeat.count == 0) {
                deletedEvents.push(ev.id);
                await Event.deleteOne({ id: ev.id });
                await Invite.deleteMany({ event: ev.id });
            } else {
                updatedEvents.push(ev.id);
                await updateEvent(ev);
            }
        }
    });

    console.log(
        `   ${
            deletedEvents.length > 0
                ? "Deleted events:"
                : "No events were deleted."
        } ${deletedEvents}\n   ${
            updatedEvents.length > 0
                ? "Updated events:"
                : "No events were updated."
        } ${updatedEvents}\nCleanup ended!`
    );
};

export default scheduleDBCleanup;
