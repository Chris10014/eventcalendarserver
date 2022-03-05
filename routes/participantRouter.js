const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");
const Yup = require("yup");

const Participants = require("../models/participants");
const Teams = require("../models/teams");

const participantRouter = express.Router();

participantRouter.use(express.json());

const regFormSchema = Yup.object({
  firstName: Yup.string().min(3, "Vorname muss mindestens aus 3 Buchstaben bestehen").max(15, "Maximal 15 Buchstaben").required("Vorname angeben"),
  lastName: Yup.string().min(3, "Nachname muss mindestens aus 3 Buchstaben bestehen").max(20, "Maximal 15 Buchstaben").required("Nachname angeben"),
  hideLastName: Yup.boolean("hideLastName hat falschen Wert"),
  email: Yup.string().email("Ungültige E-Mail Adresse").required("E-Mail Adresse angeben"),
  gender: Yup.string().required("Geschlecht angeben"),
  yearOfBirth: Yup.number()
    .min(1900, "Geburtsjahr prüfen")
    .max(new Date().getFullYear() - 15, "Geburtsjahr prüfen")
    .required("Geburtsjahr angeben"),
  team: Yup.string().nullable().min(5, "Teamname muss mindestens aus 5 Buchstaben bestehen"),
  estimatedFinishTime: Yup.string(),
  acceptTermsAndConditions: Yup.boolean().oneOf([true],"Verzichtserklärung und Haftungsfreistellung akzeptieren"),
  acceptRaceInfo: Yup.boolean().oneOf([true], "Infounterlage zur Kenntnis nehmen"),
});

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
      Participants.findOne({"email": req.body.email})
        .then(
          (participant) => {
            console.log("Part: ", participant)
            if (participant !== null) {
               err = new Error("Teilnehmer mit " + req.body.email + " ist bereits registriert");
               err.status = 403;
               err.message = "Teilnehmer mit " + req.body.email + " ist bereits registriert";
               return next(err);              
            } else {
              //find team id
              Teams.findOne({ name: req.body.team }).then(
                (team) => {
                  if (!team) {
                    console.log("no team");
                    err = new Error("Team " + req.body.team + " ist nicht berechtigt teilzunehmen");
                    err.status = 403;
                    err.message = "Team " + req.body.team + " ist nicht berechtigt teilzunehmen";
                    return next(err);
                  } else {
                    console.log("Team: ", team);
                    req.body.team = team._id;
                    regFormSchema
                      .validate(req.body)
                      .catch((err) => {
                        console.log("Fehler: ", err.errors);
                        err = new Error(err.errors);
                        err.status = 422;
                        return next(err);
                      })
                      .then(
                        (valid) => {
                          if (valid) {
                            console.log("valid: ", valid);
                            Participants.create(req.body).then(
                              (Participant) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(Participant);
                              },
                              (err) => next(err)
                            );
                          } else {
                            err = new Error(err.errors);
                            err.status = 422;
                            err.message = err.errors;
                            return next(err);
                          }
                        },
                        (err) => next(err)
                      )
                      .catch((err) => next(err));
                  }
                },
                (err) => next(err)
              );
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));      
  })
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
