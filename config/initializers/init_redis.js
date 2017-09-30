var redis  = require('redis');
var env    = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../redis.json')[env];

module.exports = function() {
	// connect redis
	global.redis_client = redis.createClient(config.port, config.host, { password: config.auth });
	global.redis_client.on('connect', function() {
	  console.log('Connected Redis successfully - port: ' + config.port + ' - ' + ' host: ' + config.host);
	});

	global.redis_client.on('error', function (err) {
	  console.log("Error " + err);
	});
	
	// global.redis_client.sadd('frameworks', JSON.stringify(test));
	// global.redis_client.sadd('frameworks', JSON.stringify(test1));
	//
	// global.redis_client.smembers('frameworks', function(err, object) {
	//   console.log(object);
	// });
};
