// var StorageModel = require('../models/storagemodel.js');
// var database = require('../db/connection.js');
// var dateFormat = require('dateformat');
// var formidable = require('formidable');
// var fs = require('fs');
// var path = require('path');
// var mkdirp = require('mkdirp');
// var rmdir = require('rimraf');
// var child_process = require('child_process');
// var exec = child_process.exec;

// exports.saveVideo = function(req, res) {
	
// 	var username = req.body.username || '';
// 	var roomid = req.body.roomid || '';

// 	if(username == '' || roomid == '') {
// 		req.send(500);
// 	}
	
// 	var date = new Date();
// 	var time = date.getTime();
// 	var create_at= dateFormat(time, "yyyy-mm-dd h:MM:ss");

// 	var connection = database.connect();
// 	storageModel = new StorageModel(connection);
// 	storageModel.saveVideo(roomid,username,create_at, function(error, result) {
// 		if(error) {
// 			res.send(401);
// 		}
// 		res.json({data: result});
// 	});		
// };

// exports.deleteRoomId = function(req, res) {
	
// 	var username = req.body.username || '';
// 	var roomid = req.body.roomid || '';

// 	if(username == '' || roomid == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	storageModel = new StorageModel(connection);
// 	storageModel.deleteRoomId(roomid,username, function(error, result) {
// 		if(error) {
// 			res.send(401);
// 		}
// 		res.json({data: result});
// 	});		
// };

// exports.clearStorage = function(req, res) {
	
// 	var username = req.body.username || '';
// 	if(username == '') {
// 		req.send(500);
// 	}
// 	var connection = database.connect();
// 	storageModel = new StorageModel(connection);
// 	storageModel.clearStorage(username, function(error, result) {
// 		if(error) {
// 			res.send(401);
// 		}
// 		res.json({data: result});
// 	});		
// };

// exports.upload = function(req, res, next) {
// 	var form = new formidable.IncomingForm();
//   var roomid = req.params.roomid;
//   var username = req.params.username;
//   var fileType = '.webm';
//   var directory = "/home/" + process.env.APP_USER + "/videosystem/" + username + "/" +roomid;
//   var connection = database.connect();
// 	storageModel = new StorageModel(connection);

//   mkdirp(directory, function (err) {
//     if (err) {
//       console.error(err); 
//     }
//     else {
//       // specify that we want to allow the user to upload multiple files in a single request
//       form.multiples = true;

//       // store all uploads in the /uploads directory
//       form.uploadDir = directory;

//       // every time a file has been uploaded successfully,
//       // rename it to it's orignal name
//       form.on('file', function(field, file) {
//         fs.rename(file.path, path.join(form.uploadDir, file.name));
//       });

//       // log any errors that occur
//       form.on('error', function(err) {
//         console.log('An error has occured: \n' + err);
//       });

//       // once all the files have been uploaded, send a response to the client
//       form.on('end', function() {
//       	storageModel.saveStorage(roomid, username, function(err, storageId) {
// 			  	if(err) {
// 			  		console.log(storageId);
// 			  	}

// 			  	fs.readdir(directory, function(err,list) {
// 					  if(err) {
// 					  	throw err;
// 					  }

// 					  var cli = "ffmpeg -i " + directory + "/" +list[0] + " -i " + directory + "/" + list[1] + " -map 0:0 -map 1:0 -strict experimental " + directory + "/" + roomid + ".webm"; 
// 					  console.log(cli);
// 					  var child = exec(cli);
// 					  child.on('close', function(code) {
// 						  exec("rm " + directory + "/" +list[0]);
// 						  exec("rm " + directory + "/" +list[1]);
// 						});

// 					  var videoname = roomid + fileType;
// 					  storageModel.saveStorageDetail(videoname, storageId, function(err, result) {
// 	          	if(err) {
// 	          		console.log(result);
// 	          	}
// 	          });
// 					});
// 			  });
//         res.end('success');
//       });

//       // parse the incoming request containing the form data
//       form.parse(req);
//     }
//   });
// };

// exports.delete = function(req, res, next) {
// 	var roomid = req.params.roomid;
//   var username = req.params.username;
//   var directory = "/home/" + process.env.APP_USER + "/videosystem/" + username + "/" +roomid;
//   var fileType = '.webm';
//   var connection = database.connect();
// 	var storageModel = new StorageModel(connection);

//   storageModel.deleteVideo(roomid, function(err, result) {
//   	if(err) {
//   		console.log(result);
//   	}
//   	var connection = database.connect();
// 		var storageModel = new StorageModel(connection);
//   	storageModel.deleteStorage(roomid, function(err, result) {
// 	  	if(err) {
// 	  		console.log(result);
// 	  	}
// 	  });
//   });
    
//   rmdir(directory, function(error,result){
//     if(error){
//       return res.json({message: error});  
//     }
//     return res.json({message: "success"});
//   });
// };

// exports.showStorage = function(req, res) {
// 	var userid = req.params.userid || '';
	
// 	if(userid === '') {
// 		return res.status(400).send("Bad request"); 
// 	}

// 	var connection = database.connect();
// 	var storageModel = new StorageModel(connection);

// 	storageModel.showStorage(userid, function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}
// 		return res.json({message: result});
// 	});
// };

// exports.showStorageDetail = function(req, res) {
// 	var storageid = req.params.storageid || '';

// 	if(storageid === '') {
// 		return res.status(400).send("Bad request"); 
// 	}

// 	var connection = database.connect();
// 	var storageModel = new StorageModel(connection);

// 	storageModel.showStorage(storageid, function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}
// 		return res.json({message: result});
// 	});
// };

// exports.download = function(req, res) {
// 	var roomid = req.params.roomid || '';
//   var username = req.params.username || '';

//   if(roomid === '' || username === '') {
//   	return res.status(400).send("Bad request"); 
//   }

//   var directory = "/home/" + process.env.APP_USER + "/videosystem/" + username + "/" +roomid;
 
//   fs.readdir(directory, function(err,list) {
// 	  if(err) {
// 	  	throw err;
// 	  }
// 	  var path = directory + "/" + list[0];
// 	  res.download(path);
// 	});
// };
