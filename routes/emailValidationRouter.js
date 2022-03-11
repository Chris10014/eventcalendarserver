const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");


const EmailValidations = require('../models/emailValidation');

const emailValidationRouter = express.Router();

emailValidationRouter.use(express.json());

emailValidationRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    EmailValidations.find(req.query)
      .then(
        (emailValidations) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(emailValidations);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    console.log("email: ", req.email);
    EmailValidations.create(req.body)
      .then(
        (emailValidation) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(emailValidation);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /emailValidations");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    EmailValidations.remove({})
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

emailValidationRouter
  .route("/:emailValidationId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    EmailValidations.findById(req.params.emailValidationId)
      .then(
        (emailValidation) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(emailValidation);
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
      res.end("POST operation not supported on /emailValidations/" + req.params.emailValidationId);
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      EmailValidations.findByIdAndUpemailValidation(
        req.params.emailValidationId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (emailValidation) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(emailValidation);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    (req, res, next) => {
      EmailValidations.findByIdAndRemove(req.params.emailValidationId)
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
  
module.exports = emailValidationRouter;
