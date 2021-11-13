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
                if (req.body.rating) {
                  sportEvent.dates.id(req.params.dateId).rating =
                    req.body.rating;
                }
                if (req.body.date) {
                  sportEvent.dates.id(req.params.dateId).date =
                    req.body.date;
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

  //Routes for races array within sportEvents
  sportEventRouter
    .route("/:sportEventId/races")
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
              res.json(sportEvent.races);
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
              sportEvent.races.push(req.body);
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
          "/races"
      );
    })
    .delete((req, res, next) => {
      SportEvents.findById(req.params.sportEventId)
        .then(
          (sportEvent) => {
            if (sportEvent != null) {
              for (var i = sportEvent.races.length - 1; i >= 0; i--) {
                sportEvent.races.id(sportEvent.races[i]._id).remove();
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
      .route("/:sportEventId/races/:raceId")
      .get((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.races.id(req.params.raceId) != null
              ) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(sportEvent.races.id(req.params.raceId));
              } else if (sportEvent == null) {
                err = new Error("SportEvent " + req.params.sportEventId + " not found");
                err.status = 404;
                return next(err);
              } else {
                err = new Error(
                  "Race " + req.params.raceId + " not found"
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
            "/races/" +
            req.params.raceId
        );
      })
      .put((req, res, next) => {
        SportEvents.findById(req.params.sportEventId)
          .then(
            (sportEvent) => {
              if (
                sportEvent != null &&
                sportEvent.races.id(req.params.raceId) != null
              ) {
                if (req.body.rating) {
                  sportEvent.races.id(req.params.raceId).rating =
                    req.body.rating;
                }
                if (req.body.race) {
                  sportEvent.races.id(req.params.raceId).race =
                    req.body.race;
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
                  "Race " + req.params.raceId + " not found"
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
                sportEvent.races.id(req.params.raceId) != null
              ) {
                sportEvent.races.id(req.params.raceId).remove();
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
                  "Race " + req.params.raceId + " not found"
                );
                err.status = 404;
                return next(err);
              }
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      });
      //End routes for races array within sportEvents



module.exports = sportEventRouter;
