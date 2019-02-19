let express = require ('express');
let path = require ('path');
let logger = require ('morgan');
let bodyParser = require ('body-parser');
let mongoose = require ('mongoose');
const cors = require ('cors');
let tweet = require ('./routes/tweet.route');
let app = express ();
// Connect to our mongo database
mongoose.Promise = global.Promise;
let dev_db_url = //create mlab account (https://mlab.com/ and place your database username and password)
  'mongodb://<username>:<password>@cluster0-shard-00-00-8qisf.mongodb.net:27017,cluster0-shard-00-01-8qisf.mongodb.net:27017,cluster0-shard-00-02-8qisf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect (mongoDB, {useNewUrlParser: true});
app.use (cors ());
app.use (logger ('dev'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: 'false'}));
app.use (express.static (path.join (__dirname, 'build')));
app.use ('/api/hashtags', tweet);

// catch 404 and forward to error handler
app.use (function (req, res, next) {
  let err = new Error ('Not Found');
  err.status = 404;
  next (err);
});

// error handler
app.use (function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get ('env') === 'development' ? err : {};

  // render the error page
  res.status (err.status || 500);
  res.render ('error');
});

module.exports = app;
