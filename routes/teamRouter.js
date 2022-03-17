const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
const cors = require("./cors");

const Teams = require("../models/teams");

const teamRouter = express.Router();

teamRouter.use(express.json());

teamRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Teams.find(req.query)
    .populate("country")
      .then(
        (teams) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(teams);
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
      Teams.create(req.body)
        .then(
          (Team) => {
            console.log("Team Created ", Team);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Team);
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
      res.end("PUT operation not supported on /Teams");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Teams.remove({})
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

teamRouter
  .route("/:TeamId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Teams.findById(req.params.TeamId)
    .populate("country")
    .populate("sport")
      .then(
        (Team) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Team);
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
        "POST operation not supported on /Teams/" +
          req.params.TeamId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Teams.findByIdAndUpdate(
        req.params.TeamId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (Team) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Team);
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
      Teams.findByIdAndRemove(req.params.TeamId)
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

module.exports = teamRouter;
