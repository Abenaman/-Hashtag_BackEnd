#!/usr/bin/env node

/**
 * Module dependencies.
 */
let HashtagCount = require ('hashtag-count');
let app = require ('../app');
let debug = require ('debug') ('mean-app:server');
let http = require ('http');
const Twitter = require ('twitter');
let credentials = require ('../utils/credentials');
let streamHandler = require ('../utils/streamHandler');
let Tweet = require ('../models/TweetCount');
//hash tag count
let hc = new HashtagCount ({
  consumer_key: credentials.consumer_key,
  consumer_secret: credentials.consumer_secret,
  access_token: credentials.access_token_key,
  access_token_secret: credentials.access_token_secret,
});
let server = http.createServer (app);
// Create a new ntwitter instance
let twit = new Twitter ({
  consumer_key: credentials.consumer_key,
  consumer_secret: credentials.consumer_secret,
  access_token_key: credentials.access_token_key,
  access_token_secret: credentials.access_token_secret,
});
let io = require ('socket.io').listen (server);
// Array of hashtags
var hashtags = ['US', 'UK', 'Germany'];
let interval = '30 seconds';
// Delete data older than this.
let history = '5 minutes';
let intervalCb = function (err, results) {
  if (err) {
    console.error (err);
  } else {
    console.log (results);
  }
};
// Open a connection to Twitter's Streaming API and start capturing tweets!
hc.start ({
  hashtags: hashtags, // required
  interval: interval, // required
  history: history, // optional
  intervalCb: intervalCb, // optional
});
/**
 * Get port from environment and store in Express.
 */

let port = normalizePort (process.env.PORT || '3000');
app.set ('port', port);

/**
 * Create HTTP server.
 */

// Set a stream listener for tweets matching tracking keywords
twit.stream (
  'statuses/filter',
  {track: '#UK', track: '#US', track: '#Germany'},
  function (stream) {
    streamHandler (stream, io);
  }
);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen (port);
server.on ('error', onError);
server.on ('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  let port = parseInt (val, 10);

  if (isNaN (port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error (bind + ' requires elevated privileges');
      process.exit (1);
      break;
    case 'EADDRINUSE':
      console.error (bind + ' is already in use');
      process.exit (1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  let addr = server.address ();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug ('Listening on ' + bind);
}
