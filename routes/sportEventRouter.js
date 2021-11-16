const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");


const SportEvents = require('../models/sportEvents');

const sportEventRouter = express.Router();

sportEventRouter.use(express.json());

sportEventRouter
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

sportEventRouter
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
      res.end(
        "POST operation not supported on /SportEvents/" +
          req.params.SportEventId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyEditor,
    (req, res, next) => {
      console.log("from put: ", req.body);
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

  //Routes for dates array within sportEvents
  sportEventRouter
    .route("/:sportEventId/dates")
    .options(cors.corsWithOptions, (req, res) => {
      res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(sportEvent.dates);
            } else {
              err = new Error(
                "SportEvent " + req.params.sportEventId + " not found"
              );
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              sportEvent.dates.push(req.body);
              sportEvent.save().then(
                (sportEvent) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(sportEvent);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("SportEvent " + req.params.sportEventId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .put((req, res, next) => {
      res.statusCode = 403;
      res.end(
        "PUT operation not supported on /sportEventes/" +
          req.params.sportEventId +
          "/dates"
      );
    })
    .delete((req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              for (var i = sportEvent.dates.length - 1; i >= 0; i--) {
                sportEvent.dates.id(sportEvent.dates[i]._id).remove();
              }
              sportEvent.save().then(
                (sportEvent) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(sportEvent);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("SportEvent " + req.params.sportEventId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });

    sportEventRouter
      .route("/:sportEventId/dates/:dateId")
      .get((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.dates.id(req.params.dateId) != null
              ) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(sportEvent.dates.id(req.params.dateId));
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Date " + req.params.dateId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
          "POST operation not supported on /sportEvents/" +
            req.params.sportEventId +
            "/dates/" +
            req.params.dateId
        );
      })
      .put((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.dates.id(req.params.dateId) != null
              ) {
                if (req.body.start) {
                  sportEvent.dates.id(req.params.dateId).start =
                    req.body.start;
                }
                if (req.body.end) {
                  sportEvent.dates.id(req.params.dateId).end =
                    req.body.end;
                }
                sportEvent.save().then(
                  (sportEvent) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(sportEvent);
                  },
                  (err) => next(err)
                );
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Date " + req.params.dateId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .delete((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.dates.id(req.params.dateId) != null
              ) {
                sportEvent.dates.id(req.params.dateId).remove();
                sportEvent.save().then(
                  (sportEvent) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(sportEvent);
                  },
                  (err) => next(err)
                );
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Date " + req.params.dateId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      });
      //End routes for dates array within sportEvents

        //Routes for owners array within sportEvents
  sportEventRouter
    .route("/:sportEventId/owners")
    .options(cors.corsWithOptions, (req, res) => {
      res.sendStatus(200);
    })
    .get(cors.cors, (req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(sportEvent.owners);
            } else {
              err = new Error(
                "SportEvent " + req.params.sportEventId + " not found"
              );
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .post((req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              sportEvent.owners.push(req.body);
              sportEvent.save().then(
                (sportEvent) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(sportEvent);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("SportEvent " + req.params.sportEventId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .put((req, res, next) => {
      res.statusCode = 403;
      res.end(
        "PUT operation not supported on /sportEvents/" +
          req.params.sportEventId +
          "/owners"
      );
    })
    .delete((req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              for (var i = sportEvent.owners.length - 1; i >= 0; i--) {
                sportEvent.owners.id(sportEvent.owners[i]._id).remove();
              }
              sportEvent.save().then(
                (sportEvent) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(sportEvent);
                },
                (err) => next(err)
              );
            } else {
              err = new Error("SportEvent " + req.params.sportEventId + " not found");
              err.status = 404;
              return next(err);
            }
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    });

    sportEventRouter
      .route("/:sportEventId/owners/:ownerId")
      .get((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.owners.id(req.params.ownerId) != null
              ) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(sportEvent.owners.id(req.params.ownerId));
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Owner " + req.params.ownerId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .post((req, res, next) => {
        res.statusCode = 403;
        res.end(
          "POST operation not supported on /sportEvents/" +
            req.params.sportEventId +
            "/owners/" +
            req.params.ownerId
        );
      })
      .put((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.owners.id(req.params.ownerId) != null
              ) {
                if (req.body.start) {
                  sportEvent.owners.id(req.params.ownerId).start =
                    req.body.start;
                }
                if (req.body.end) {
                  sportEvent.owners.id(req.params.ownerId).end =
                    req.body.end;
                }
                sportEvent.save().then(
                  (sportEvent) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(sportEvent);
                  },
                  (err) => next(err)
                );
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Owner " + req.params.ownerId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      })
      .delete((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.owners.id(req.params.ownerId) != null
              ) {
                sportEvent.owners.id(req.params.ownerId).remove();
                sportEvent.save().then(
                  (sportEvent) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(sportEvent);
                  },
                  (err) => next(err)
                );
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Owner " + req.params.ownerId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      });
      //End routes for owners array within sportEvents





module.exports = sportEventRouter;
