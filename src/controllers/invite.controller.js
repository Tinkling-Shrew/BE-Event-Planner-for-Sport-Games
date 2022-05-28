import "dotenv/config";
import nodemailer from "nodemailer";
import Event from "../models/Event.js";
import Invite from "../models/Invite.js";
import crypto from "crypto";
import moment from "moment";
import { fileToString } from "../util/fileToString.js";

const emailTemplate = await fileToString("../util/template_email.html");

export const inviteMail = async (req, resp) => {
    const event = await Event.find({ id: req.body.event }).lean();
    if (!event[0]) resp.status(404).send({});

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

    let successfulEmails = [];
    let failedEmails = [];
    let invites = [];

    req.body.emails.forEach((email) => {
        const inviteObj = new Invite({
            id: crypto.randomBytes(15).toString("hex"),
            email: email,
            event: event[0].id,
        });

        const link = `http://localhost:3000/invite/${inviteObj.id}`;

        // email options
        var mailOptions = {
            from: `'Sport Event Planner' <${process.env.MAIL_USER}>`, // sender address
            to: email, // list of receivers
            subject: `Event invitation: ${event[0].name}`, // Subject line
            html: eval("`" + emailTemplate + "`"), // html text body
        };

        try {
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;

                // console.log("Message sent: %s", info.messageId);
                // console.log("Preview URL: %s", nodemailer.getTestMessageUrl);
            });

            successfulEmails.push(email);
            invites.push(inviteObj);
        } catch {
            failedEmails.push(email);
        }
    });

    await Invite.create(invites);

    resp.status(200).send({
        successfulEmails: successfulEmails,
        failedEmails: failedEmails,
    });
};

export const inviteInfo = async (req, resp) => {
    const invite = await Invite.find({ id: req.params.id }).lean();
    if (!invite[0]) return resp.status(404).send({});
    resp.send(invite[0]);
};

export const inviteResponse = async (req, resp) => {
    // search for invite
    const invite = await Invite.find({ id: req.params.id }).lean();
    if (!invite[0])
        return resp
            .status(404)
            .send("Invitation link expired or doesn't exist!");

    // search for event
    const event = await Event.find({ id: invite[0].event }).lean();
    if (!event[0])
        return resp
            .status(404)
            .send("Event associated with invitation no longer exists!");

    // add guest to participants list
    if (req.query.accept === "true") {
        event[0].participants.push(invite[0].email);

        // update database
        await Event.updateOne(
            { id: event[0].id },
            {
                $set: {
                    participants: event[0].participants,
                },
                $currentDate: { lastModified: true },
            }
        );

        resp.send("Invitation accepted!");
    } else if (req.query.accept === "false") {
        resp.send("Invitation rejected!");
    } else {
        return resp
            .status(400)
            .send("'accept' parameter must either be 'true' or 'false'!");
    }

    // delete invite
    await Invite.deleteOne({ id: invite[0].id });
};
