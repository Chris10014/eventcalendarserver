const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");


const Dates = require('../models/dates');

const dateRouter = express.Router();

dateRouter.use(express.json());

dateRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Dates.find(req.query)
      .then(
        (dates) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dates);
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
      Dates.create(req.body)
        .then(
          (date) => {
            
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(date);
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
      res.end("PUT operation not supported on /dates");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dates.remove({})
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

dateRouter
  .route("/:dateId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Dates.findById(req.params.dateId)
      .then(
        (date) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(date);
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
      res.end("POST operation not supported on /dates/" + req.params.dateId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Dates.findByIdAndUpdate(
        req.params.dateId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (date) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(date);
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
      Dates.findByIdAndRemove(req.params.dateId)
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
  
module.exports = dateRouter;
