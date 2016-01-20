var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);

var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

//twit
//  .verifyCredentials(function (err, data) {
//    console.log(data);
//  });
var sio = require('socket.io').listen(server);
var count=0;
sio.sockets.on('connection', function(socket){
console.log('Web client connected');
var love_count=0;
var hate_count=0;
var total=0;
twit.stream('statuses/filter', {track: ['love','hate']}, function(stream) {
  stream.on('data', function(tweet) {
    //console.log(tweet.user.screen_name+": "+tweet.text);
	if(tweet.text.indexOf('love')>-1)
	{
		love_count+=1;
		socket.emit('ss-tweet-love',{user:tweet.user.screen_name, text: tweet.text});
	}
	if(tweet.text.indexOf('hate')>-1)
	{
		hate_count+=1;
		socket.emit('ss-tweet-hate',{user:tweet.user.screen_name, text: tweet.text});
	}	
	total = love_count+hate_count;
    //console.log('love_count: '+Math.round(love_count*100/total));
    //console.log('hate_count: '+Math.round(hate_count*100/total));
	socket.emit('ss-total',total);
	socket.emit('ss-love', Math.round(love_count*100/total));
	socket.emit('ss-hate', Math.round(hate_count*100/total));
  });

  stream.on('error', function(error) {
    throw error;
  });
});

socket.on('disconnect', function() {
console.log('Web client disconnected');
});
});

module.exports = app;
