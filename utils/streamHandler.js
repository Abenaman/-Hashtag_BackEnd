let Tweet = require ('../models/Tweet');
module.exports = (stream, io) => {
  // When tweets get sent our way ...
  stream.on ('data', data => {
    // Construct a new tweet object
    let tweet = {
      tweets: data['text'],
      country: data['country_code'],
      count: data['count'],
      date: data['created_at'],
    };
    // Create a new model instance with our object
    let tweetEntry = new Tweet (tweet);
    // Save 'er to the database
    tweetEntry.save (err => {
      if (!err) {
        // If everything is cool, socket.io emits the tweet.
        io.emit ('tweet', tweet);
      }
    });
  });
};
