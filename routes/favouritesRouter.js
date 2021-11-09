const express = require("express");
const bodyParser = require("body-parser");
var authenticate = require('../authenticate');
const cors = require("./cors");

const Favourites = require('../models/favourite');
const favouriteRouter = express.Router();

favouriteRouter.use(express.json());

favouriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        (favourites) => {
          // filter the favourites that match the req.user._id
          if (favourites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favourites);
          } else {
            var err = new Error(
              "There are no favourites list for user with username " +
              req.user.username
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then((favourites) => {
          if (favourites) {            
            req.body.forEach((element) => {
              var index = favourites.dishes.indexOf(element._id);
              if (index == -1) {
                favourites.dishes.push(element._id);
              }
            });
            favourites.save()            
            .then((favourites) => {
              Favourites.findById(favourites._id)
              .populate("user")
              .populate("dishes")
              .then((favourites) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favourites);
              })
            })           
          } else {
            req.body.user = req.user._id;
            Favourites.create({ user: req.user._id }).then(
              (favourites) => {
                req.body.forEach((element) => {
                  favourites.dishes.push(element._id);
                });
                favourites.save()
                .then((favourites) => {
                  Favourites.findById(favourites._id)
                  .populate("user")
                  .populate("dishes")
                  .then((favourites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favourites);
                  })
                })
                .catch((err) => next(err));
              },(err) => next(err))
          }
        }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favourites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOneAndRemove({ "user": req.user._id })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      }, (err) => next(err)
      )
      .catch((err) => next(err));
  });

favouriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({ user: req.user._id })
      .then((favourites) => {
        if (favourites) {
          //Is dishId part of the favourites?
            var index = favourites.dishes.indexOf(req.params.dishId);
            if (index >= 0) {//dish is in favourites
              res.statusCode = 200;
              res.setHeader("Content-Type", "application-json");
              return res.json({"exists": true, "favourites": favourits});
            } else {//dish is not in favourites
                res.statusCode = 200;
                res.setHeader("Content-Type", "application-json");
                return res.json({"exists": false, "favourites": favourites});
            }
      } else { //favourites does not exist
        res.statusCode = 200;
        res.setHeader("Content-Type", "application-json");
        return res.json({"exists": false, "favourites": favourites});
      }
  }, (err) => next(err))
  .catch((err) => (err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
  Favourites.findOne({"user": req.user._id})
  .then((favourites) => {
    //Is dish already in favourite list?
    var index = favourites.dishes.indexOf(req.params.dishId);
    if(index == -1) {
      favourites.dishes.push(req.params.dishId);
      favourites.save()
      .then((favourites) => {
        Favourites.findById(favourites._id)
        .populate("user")
        .populate("dishes")
        .then((favourites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favourites);
        })
      })      
    } else {
      Favourites.findById(favourites._id)
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favourites);
      })
    }
  })
  .catch((err) => (err));
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
  Favourites.findOne({"user": req.user._id})
  .then((favourites) => {
    var index = favourites.dishes.indexOf(req.params.dishId);
    if(index !== -1) {
      favourites.dishes.splice(index, 1);
      favourites.save()
      .then((favourites) => {
        Favourites.findById(favourites._id)
        .populate("user")
        .populate("dishes")
        .then((favourites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favourites);
        })
      })      
    } else {
      Favourites.findById(favourites._id)
      .populate("user")
      .populate("dishes")
      .then((favourites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favourites);
      })
    }
  })
  .catch((err) => (err));
});

module.exports = favouriteRouter;
