import crypto from "crypto";

function generateUserObj(data, update = undefined) {
    return new Object({
        id: update ? update.id : crypto.randomUUID(),
        name: data.name,
        email: data.email,
        phone: data.phone ? data.phone : "-",
        password: data.password
            ? crypto.createHash("sha256").update(data.password).digest("hex")
            : update.password,
    });
}

export default generateUserObj;
