const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");

const Participants = require("../models/participants");

const participantRouter = express.Router();

participantRouter.use(express.json());

participantRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Participants.find(req.query)
    .populate("team")
      .then(
        (Participants) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Participants);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    (req, res, next) => {
      console.log("user: ", req.user);
      Participants.create(req.body)
        .then(
          (Participant) => {
            console.log("Participant Created ", Participant);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Participant);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /Participants");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Participants.remove({})
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

participantRouter
  .route("/:ParticipantId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Participants.findById(req.params.ParticipantId)
      .then(
        (Participant) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Participant);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation not supported on /Participants/" +
          req.params.ParticipantId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    (req, res, next) => {
      Participants.findByIdAndUpdate(
        req.params.ParticipantId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (Participant) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Participant);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Participants.findByIdAndRemove(req.params.ParticipantId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(resp);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );


//End routes for courses array within participants

module.exports = participantRouter;
