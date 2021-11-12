const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");


const SportEvents = require('../models/sportEvents');

const SportEventRouter = express.Router();

SportEventRouter.use(express.json());

SportEventRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    SportEvents.find(req.query)
      .then(
        (SportEvents) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(SportEvents);
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
      console.log("user: ", req.user);
      SportEvents.create(req.body)
        .then(
          (SportEvent) => {
            console.log("SportEvent Created ", SportEvent);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(SportEvent);
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
      res.end("PUT operation not supported on /SportEvents");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      SportEvents.remove({})
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

SportEventRouter
  .route("/:SportEventId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    SportEvents.findById(req.params.SportEventId)
      .then(
        (SportEvent) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(SportEvent);
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
      res.end("POST operation not supported on /SportEvents/" + req.params.SportEventId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      SportEvents.findByIdAndUpdate(
        req.params.SportEventId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (SportEvent) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(SportEvent);
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
      SportEvents.findByIdAndRemove(req.params.SportEventId)
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
  
module.exports = SportEventRouter;
