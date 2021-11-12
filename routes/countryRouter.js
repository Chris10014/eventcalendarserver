const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");


const Countries = require('../models/countries');

const countryRouter = express.Router();

countryRouter.use(express.json());

countryRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Countries.find(req.query)
      .then(
        (countries) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(countries);
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
      Countries.create(req.body)
        .then(
          (country) => {
            console.log("Country Created ", country);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(country);
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
      res.end("PUT operation not supported on /countries");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Countries.remove({})
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

countryRouter
  .route("/:countryId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Countries.findById(req.params.countryId)
      .then(
        (country) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(country);
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
      res.end("POST operation not supported on /countries/" + req.params.countryId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Countries.findByIdAndUpdate(
        req.params.countryId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (country) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(country);
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
      Countries.findByIdAndRemove(req.params.countryId)
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
  
module.exports = countryRouter;
