const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");
const nodemailer = require('nodemailer');

const { route } = require("./sendMailRouter");

const sendMailRouter = express.Router();

sendMailRouter.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

sendMailRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: "anmeldung@1zf.de", // sender address
      to: to, // list of receivers
      subject: subject,
      text: text,
      html: "<h1>" + text + "</h1>",
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(501).send({message: "Mail not send." + " Reason: " + err.response})
          return console.log(err);
      }
      res.status(200).send({message: "mail send", message_id: info.messageId});
    });
  });

  module.exports = sendMailRouter;
//https://medium.com/coox-tech/send-mail-using-node-js-express-js-with-nodemailer-93f4d62c83ee