const express = require("express");
const bodyParser = require("body-parser");

const Favorites = require('../models/favorite');
const cors = require('./cors');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
        .populate('user')
        .populate('dishes')
        .then(
          (favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })

    .post( cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user":req.user._id })
        .then(
            (favorite) => {
                if(!favorite){
                    let fav = {
                        "user":req.user._id,
                        "dishes":[]
                    }
                    req.body.forEach(element => fav.dishes.push(element._id));
                    Favorites.create(fav)
                    .then((favorite) =>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    },
                    (err)=>next(err));
                }
                else {
                    req.body.filter(item => favorite.dishes.indexOf(item._id)==-1).forEach(element => favorite.dishes.push(element._id));
                    favorite.save()
                    .then(
                        (favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        }, (err) => (next(err))
                    );
                }

            }, 
            (err)=>next(err)
        )
        .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT opeation not supported on /favorites');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({"user":req.user._id })
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

favoriteRouter
    .route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end(`GET opeation not supported on /favorites/ ${req.params.dishId}`);
    })

    .post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        Favorites.findOne({"user":req.user._id })
        .then(
            (favorite)=>{
                if (favorite && favorite.dishes.indexOf(req.params.dishId)==-1) {
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                    .then(
                        (favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        }, (err) => (next(err))
                    );
                }
                else if (!favorite){
                    var err = new Error('No favorites found for the user');
                    err.status = 403;
                    return next(err);
                }
                else {
                    var err = new Error('Dish is already in the favorites!');
                    err.status = 403;
                    return next(err);
                }
            }, 
            (err)=>next(err))
        .catch((err)=> next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT opeation not supported on /favorites/ ${req.params.dishId}`);
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user":req.user._id })
        .then((favorite)=>{
            if (favorite){
                let index_dish = favorite.dishes.indexOf(req.params.dishId);
                if ( index_dish>-1) {
                    favorite.dishes.splice(index_dish, 1);
                    favorite.save()
                    .then(
                        (favorite) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        }, (err) => (next(err))
                    );
                }
                else {
                    var err = new Error(`Dish does'nt exist in the favorites!`);
                    err.status = 403;
                    return next(err);
                }
            }
            else{
                var err = new Error('No favorites found for the user');
                err.status = 403;
                return next(err);
            }

        }, 
        (err)=> next(err))
        .catch((err)=> next(err));
    });

module.exports = favoriteRouter;
