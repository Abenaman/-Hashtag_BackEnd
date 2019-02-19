var express = require ('express');
var router = express.Router ();
var Tweet = require ('../models/Tweet.js');

/* GET ALL Tweets */
router.get ('/', function (req, res, next) {
  Tweet.find (function (err, products) {
    if (err) return next (err);
    res.json (products);
  });
});

/* GET SINGLE Tweet BY ID */
router.get ('/:id', function (req, res, next) {
  Tweet.findById (req.params.id, function (err, post) {
    if (err) return next (err);
    res.json (post);
  });
});

/* SAVE Tweet */
router.post ('/', function (req, res, next) {
  Tweet.create (req.body, function (err, post) {
    if (err) return next (err);
    res.json (post);
  });
});

/* UPDATE Tweet */
router.put ('/:id', function (req, res, next) {
  Tweet.findByIdAndUpdate (req.params.id, req.body, function (err, post) {
    if (err) return next (err);
    res.json (post);
  });
});

/* DELETE Tweet */
router.delete ('/:id', function (req, res, next) {
  Tweet.findByIdAndRemove (req.params.id, req.body, function (err, post) {
    if (err) return next (err);
    res.json (post);
  });
});

module.exports = router;
