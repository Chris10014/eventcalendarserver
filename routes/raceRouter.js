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
        (Races) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Races);
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
      Races.create(req.body)
        .then(
          (Race) => {
            console.log("Race Created ", Race);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Race);
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
      res.end("PUT operation not supported on /Races");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  );

raceRouter
  .route("/:RaceId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Races.findById(req.params.RaceId)
      .then(
        (Race) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(Race);
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
        "POST operation not supported on /Races/" +
          req.params.RaceId
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Races.findByIdAndUpdate(
        req.params.RaceId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then(
          (Race) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(Race);
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
      Races.findByIdAndRemove(req.params.RaceId)
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

//Routes for racedates array within races
raceRouter
  .route("/:raceId/racedates")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(race.racedates);
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
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            race.racedates.push(req.body);
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
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
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /races/" +
        req.params.raceId +
        "/racedates"
    );
  })
  .delete((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            for (var i = race.racedates.length - 1; i >= 0; i--) {
              race.racedates.id(race.racedates[i]._id).remove();
            }
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
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

raceRouter
  .route("/:raceId/racedates/:racedateId")
  .get((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.racedates.id(req.params.racedateId) != null
          ) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(race.racedates.id(req.params.racedateId));
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("racedate " + req.params.racedateId + " not found");
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
      "POST operation not supported on /races/" +
        req.params.raceId +
        "/racedates/" +
        req.params.racedateId
    );
  })
  .put((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.racedates.id(req.params.racedateId) != null
          ) {
            if (req.body) {
              race.racedates.id(req.params.racedateId) = req.body;
            }           
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("racedate " + req.params.racedateId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.racedates.id(req.params.racedateId) != null
          ) {
            race.racedates.id(req.params.racedateId).remove();
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("racedate " + req.params.racedateId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
//End routes for racedates array within races

//Routes for courses array within races
raceRouter
  .route("/:raceId/courses")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(race.courses);
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
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            race.courses.push(req.body);
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
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
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /races/" +
        req.params.raceId +
        "/courses"
    );
  })
  .delete((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (race != null) {
            for (var i = race.courses.length - 1; i >= 0; i--) {
              race.courses.id(race.courses[i]._id).remove();
            }
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
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

raceRouter
  .route("/:raceId/courses/:courseId")
  .get((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.courses.id(req.params.courseId) != null
          ) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(race.courses.id(req.params.courseId));
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("course " + req.params.courseId + " not found");
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
      "POST operation not supported on /races/" +
        req.params.raceId +
        "/courses/" +
        req.params.courseId
    );
  })
  .put((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.courses.id(req.params.courseId) != null
          ) {
            if (req.body.sport) {
              race.courses.id(req.params.courseId).sport = req.body.sport;
            }
            if (req.body.distance) {
              race.courses.id(req.params.courseId).distance = req.body.distance;
            }                      
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("course " + req.params.courseId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Races.findById(req.params.raceId)
      .then(
        (race) => {
          if (
            race != null &&
            race.courses.id(req.params.courseId) != null
          ) {
            race.courses.id(req.params.courseId).remove();
            race.save().then(
              (race) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(race);
              },
              (err) => next(err)
            );
          } else if (race == null) {
            err = new Error(
              "Race " + req.params.raceId + " not found"
            );
            err.status = 404;
            return next(err);
          } else {
            err = new Error("course " + req.params.courseId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
//End routes for courses array within races

module.exports = raceRouter;
