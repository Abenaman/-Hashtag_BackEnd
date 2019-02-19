let mongoose = require ('mongoose');

// Create a new schema for our tweet data
let schema = new mongoose.Schema ({
  tweets: String,
  country_code: String,
  count: Number,
  date: Date,
});

// Create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function (page, skip, callback) {
  let tweets = [], start = page * 10 + skip * 1;

  // Query the db, using skip and limit to achieve page chunks
  Tweet.find ({}, 'tweets  autcountry_code count date ', {
    skip: start,
    limit: 10,
  })
    .sort ({date: 'desc'})
    .exec (function (err, docs) {
      // If everything is cool...
      if (!err) {
        tweets = docs; // We got tweets
        tweets.forEach (function (tweet) {
          tweet.active = true; // Set them to active
        });
      }

      // Pass them back to the specified callback
      callback (tweets);
    });
};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model ('Tweet', schema);
