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
    user: "e32fda1bf53063",
    pass: "10514b0571a264",
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
      from: "youremail@gmail.com", // sender address
      to: to, // list of receivers
      subject: subject,
      text: text,
      html: "<h1>" + text + "</h1>",
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
          return console.log(error);
      }
      res.status(200).send({message: "mail send", message_id: info.messageId});
    });
  });

  module.exports = sendMailRouter;
//https://medium.com/coox-tech/send-mail-using-node-js-express-js-with-nodemailer-93f4d62c83ee