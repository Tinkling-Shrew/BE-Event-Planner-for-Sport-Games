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
        host: update ? update.host : "USER000000-00000-000000-000000",
        location: data.location,
        password:
            data.password && data.password != ""
                ? crypto
                      .createHash("sha256")
                      .update(data.password)
                      .digest("hex")
                : null,
        starttime: data.starttime,
        endtime: data.endtime,
        repeat: {
            mode: data.repeat.mode,
            count: data.repeat.mode !== "once" ? data.repeat.count : 0,
        },
    });
}

export default generateEventObj;
