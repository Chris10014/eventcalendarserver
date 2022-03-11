const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");

const RaceRegistrations = require("../models/raceRegistrations");

const raceRegistrationRouter = express.Router();

raceRegistrationRouter.use(express.json());

raceRegistrationRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    RaceRegistrations.find(req.query)
      .then(
        (raceRegistrations) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(raceRegistrations);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    console.log("user: ", req.user);
    RaceRegistrations.create(req.body)
      .then(
        (raceRegistration) => {
          console.log("RaceRegistrationday Created ", raceRegistration);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(raceRegistration);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /raceRegistrations");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    RaceRegistrations.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

raceRegistrationRouter
  .route("/:raceRegistrationId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    RaceRegistrations.findById(req.params.raceRegistrationId)
      .then(
        (raceRegistration) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(RaceRegistrationday);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "POST operation not supported on /raceRegistrations/" +
          req.params.raceRegistrationId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      RaceRegistrations.findByIdAndUpdate(
        req.params.raceRegistrationId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (raceRegistration) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(raceRegistration);
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
      RaceRegistrations.findByIdAndRemove(req.params.raceRegistrationId)
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


//End routes for raceRegistrations array within raceRegistrationdays


//End routes for courses array within raceRegistrationdays

module.exports = raceRegistrationRouter;
