import "dotenv/config";
import Event from "../models/Event.js";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import moment from "moment";

const __dirname = dirname(fileURLToPath(import.meta.url));

let emailTemplate = null;
fs.readFile(
    path.resolve(__dirname, "../util/template_email.html"),
    "utf8",
    (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        emailTemplate = data;
    }
);

export const inviteMail = async (req, resp) => {
    const event = await Event.find({ id: req.body.event }).lean();
    if (!event[0]) resp.status(404).send({});
    const link = `http://localhost:3000/lobby/invite/${event[0].id}`;

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_SERVER || "smtp.gmail.com",
        port: process.env.MAIL_PORT || 465,
        secure: true,

        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    //console.log(newevent.participants);

    var mailOptions = {
        from: `'Sport Event Planner' <${process.env.MAIL_USER}>`, // sender address
        to: req.body.emails, // list of receivers
        subject: `Event invitation: ${event[0].name}`, // Subject line
        html: eval("`" + emailTemplate + "`"), // html text body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        // console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl);
        resp.send("Success!");
    });
};
