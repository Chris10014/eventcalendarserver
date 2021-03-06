const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");

const Races = require("../models/races");

const raceRouter = express.Router();

raceRouter.use(express.json());

raceRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Races.find(req.query)
      .then(
        (races) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(races);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    console.log("user: ", req.user);
    Races.create(req.body)
      .then(
        (race) => {
          console.log("Raceday Created ", race);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(race);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /races");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Races.remove({})
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

raceRouter
  .route("/:raceId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Raceday);
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
        "POST operation not supported on /races/" +
          req.params.raceId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Races.findByIdAndUpdate(
        req.params.raceId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (race) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(race);
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
      Races.findByIdAndRemove(req.params.raceId)
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


//End routes for races array within racedays


//End routes for courses array within racedays

module.exports = raceRouter;
