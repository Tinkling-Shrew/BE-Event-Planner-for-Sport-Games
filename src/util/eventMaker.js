import crypto from "crypto";

function generateEventObj(data, update = undefined) {
    return new Object({
        id: update ? update.id : crypto.randomUUID(),
        participants: update ? update.participants : [],
        max_participants: data.max_participants,
        name: data.name,
        sport: data.sport,
        description:
            data.description && data.description != ""
                ? data.description
                : "No description available.",
        host: update
            ? update.host
            : {
                  username: data.host.username,
                  email: data.host.email ? data.host.email : "No email address",
              },
        location: data.location,
        password:
            data.password && data.password != ""
                ? crypto
                      .createHash("sha256")
                      .update(data.password)
                      .digest("hex")
                : null,
        start_time: data.start_time,
        end_time: data.end_time,
        repeat: {
            mode: data.repeat && data.repeat.mode ? data.repeat.mode : "once",
            count:
                data.repeat && data.repeat.mode !== "once"
                    ? data.repeat.count
                    : 0,
        },
    });
}

export default generateEventObj;
