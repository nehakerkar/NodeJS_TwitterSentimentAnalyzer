
var server_name = "http://127.0.0.1:3000/";
var server = io.connect(server_name);
console.log('Client: Connecting to server '+server_name);
var total = document.getElementById('total');
var love = document.getElementById('love');
var hate = document.getElementById('hate');
//var tweets = document.getElementById('tweetlist');
server.on('ss-total',function(data){
total.innerHTML = 'Total count: '+data;//prints total count
});
server.on('ss-love',function(data){
love.innerHTML = 'Love: '+data+'%';//prints love count
});
server.on('ss-hate',function(data){
hate.innerHTML = 'Hate: '+data+'%';//prints hate count
});

//prints Tweets
server.on('ss-tweet-love',function(data){
$('#tweetlist-love').prepend('<li>' +
data.user+': '
+ data.text + '</li>');
if( $("#tweetlist-love li").size() > 10 ) {
	$("#tweetlist-love li:last").remove();
}
});

server.on('ss-tweet-hate',function(data){
$('#tweetlist-hate').prepend('<li>' +
data.user+': '
+ data.text + '</li>');
if( $("#tweetlist-hate li").size() > 10 ) {
	$("#tweetlist-hate li:last").remove();
}
});
