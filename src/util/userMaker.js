import crypto from "crypto";

function generateUserObj(data, update = undefined) {
	return new Object({
		id: update ? update.id : crypto.randomUUID(),
		name: data.name,
		email: data.email,
		phone: data.phone,
	});
}

export default generateUserObj;
