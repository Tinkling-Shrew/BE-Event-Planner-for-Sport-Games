import "dotenv/config";
import nodemailer from "nodemailer";

export const inviteMail = async (req, resp) => {
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
        resp.send("Success!");
    });
};
