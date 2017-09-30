/**
 * Author: Nguyen Hoang Anh
 * Controllers: user_controller
 */

var user_services = require("../services/user_services");
var jwt           = require('jsonwebtoken');
var config        = require('../../config/config')();
var regex         = require('regex-email');

// var mkdirp = require('mkdirp');
// var rmdir = require('rimraf');

// exports.create = function(req, res) {

// 	var user = req.body.user || '';

// 	if(user === '') {
// 		return res.sendStatus(400);
// 	}

// 	var directory = "/home/" + process.env.APP_USER + "/videosystem/" + user.username;

// 	mkdirp(directory, function (err) {});

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.create(user, function(error, result) {
// 		if(error) {
// 			return res.status(500).send();
// 		}
// 		return res.status(201).send(result);
// 	});
// };

exports.get_list_users = function(req, res) {
	user_services.get_users(function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		for(var i = 0; i < result.data.length; i++) {
			if(result.data[i].user_name === req.decoded.user_name) {
				result.data.splice(i, 1);
				break;
			}
		}
		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};

exports.get_all_users = function(req, res) {
	user_services.get_users(function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};

exports.get_user = function(req, res) {
	var user_code = req.params.user_code;

	if(user_code === "" || user_code === undefined) {
		var err = "Params's not invalid";
		return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
	}

	user_services.get_user(user_code.trim(), function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};

exports.update_profile = function(req, res) {
	if(Object.keys(req.body).length === 0) {
		var err = "Params's not invalid";
		return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
	}

	var first_name = req.body.first_name || "";
	var last_name  = req.body.last_name  || "";
	var email      = req.body.email      || "";
	var phone      = req.body.phone      || "";
	var address    = req.body.address    || "";

	if(first_name === "" && last_name === "" && email === "" && phone === "" && user_name === "" && address === "") {
		var err = "Params are not invalid";
		return res.status(401).json({
      "error": {
        "data": err
      },
      status_code: 401
    });
	}

	var user = {};
	if(first_name !== "") {
		user.first_name = first_name.trim();
	}
	if(last_name !== "") {
		user.last_name = last_name.trim();
	}
	if(email !== "") {
		var regex_mail = regex.test(email.trim());
		if(regex_mail) {
			user.email = email.trim();
		}
		else {
			var err = "Params's not invalid";
			return res.status(401).json({
	      "error": {
	        "data": err
	      },
	      status_code: 401
	    });
		}
	}
	if(phone !== "") {
		user.phone = phone.trim();
	}
	if(address !== "") {
		user.address = address.trim();
	}

	user_services.update_profile(req.decoded.user_code, user, function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};

exports.change_pass = function(req, res) {
	var old_pass = req.body.old_pass || "";
	var new_pass = req.body.new_pass || "";

	if(old_pass === "" || new_pass === "") {
		var err = "Params's not invalid";
		return res.status(401).json({
			"error": {
				"data": err
			},
			status_code: 401
		});
	}

	user_services.change_pass(req.decoded.user_code, old_pass, new_pass, function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};

exports.authenticate = function(req, res) {
	console.log(req.body);
	var user_name = req.body.user_name || "";
	var pass_word = req.body.pass_word || "";

	if(user_name === "" || pass_word === "") {
		var err = "username or password are not valid";
		return res.status(401).json({
			error: {
				data: err
			},
			status_code: 401
		});
	}

	user_services.login({user_name: user_name, pass_word: pass_word}, function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}

		var token = jwt.sign(result.data, config.secret, {
      		expiresIn: 86400 // expires in 24 hours
   		 });

		return res.status(result.status_code).json({
			"success": {
				"data": result.data,
				"token": token
			},
			"status_code": result.status_code
		});
	});
};

exports.get_message_history = function(req, res) {
	// var sender_id = req.params.sender_id;
	// var receiver_id = req.params.receiver_id;
	var id_1 = req.body.id_1;
	var id_2 = req.body.id_2;
  
	if(id_1 === "" || id_1 === undefined || id_2 === "" || id_2 === undefined) {
		var err = "Params's not invalid";
		return res.status(401).json({
			"error": {
				"data": err
			},
			status_code: 401
		});
	}
	user_services.get_message_history(id_1, id_2, function(err, result) {
		if(err) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}
		return res.status(result.status_code).json({
			"success": {
				"data": result.data,
			},
			"status_code": result.status_code
		});
	});
};

exports.create_user = function(req, res) {
	if(Object.keys(req.body).length === 0) {
		var err = "Params's not invalid";
		return res.status(401).json({
	      "error": {
	        "data": err
	      },
	      status_code: 401
	    });
	};

	var user_name  = req.body.user_name  || "";
	var pass_word  = req.body.pass_word  || "";
	var first_name = req.body.first_name || "";
	var last_name  = req.body.last_name  || "";
	var email      = req.body.email      || "";
	var phone      = req.body.phone      || "";
	var address    = req.body.address    || "";

	if(user_name === "" && first_name === "" && last_name === "" && email === "" && phone === "" && user_name === "" && address === "") {
		var err = "Params are not invalid";
		return res.status(401).json({
	      "error": {
	        "data": err
	      },
	      status_code: 401
	    });
	}

	var user = {};
	if(user_name !== "") {
		user.user_name = user_name.trim();
	}
	if(pass_word !== "") {
		user.pass_word = pass_word.trim();
	}
	if(first_name !== "") {
		user.first_name = first_name.trim();
	}
	if(last_name !== "") {
		user.last_name = last_name.trim();
	}
	if(email !== "") {
		var regex_mail = regex.test(email.trim());
		if(regex_mail) {
			user.email = email.trim();
		}
		else {
			var err = "Params's not invalid";
			return res.status(401).json({
	      "error": {
	        "data": err
	      },
	      status_code: 401
	    });
		}
	}
	if(phone !== "") {
		user.phone = phone.trim();
	}
	if(address !== "") {
		user.address = address.trim();
	}

	user_services.create_user(user, function(error, result) {
		if(error) {
			return res.status(result.status_code).json({
				"error": {
					"data": result.data
				},
				"status_code": result.status_code
			});
		}
		return res.status(result.status_code).json({
			"success": {
				"data": result.data
			},
			"status_code": result.status_code
		});
	});
};
// exports.getInfoUser = function(req, res) {

// 	var username = req.body.username || '';

// 	if(username === '' ) {
// 		return res.sendStatus(401);
// 	}

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.getUserByName(username, function(error, result) {
// 		if(error) {
// 			return res.sendStatus(401);
// 		}
// 		return res.json({message: result});
// 	});
// };

// exports.delete = function(req, res) {

// 	var userId = req.params.userId || '';
// 	var userName = req.params.userName || '';
// 	var directory = "/home/" + process.env.APP_USER + "/videosystem/" + userName;

// 	if( userId === '' || userName === '') {
// 		return res.send(400);
// 	}

// 	rmdir(directory, function(error,result) {});

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.deleteUser(userId, function(error, result) {
// 		if(error) {
// 			return res.status(500).send(result);
// 		}
// 		return res.status(200).send(result);
// 	});
// };

// exports.update = function(req, res) {

// 	var user = req.body.user || '';

// 	if(user === '') {
// 		return res.sendStatus(400);
// 	}

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.updateUser(user, function(error, result) {
// 		if(error) {
// 			return res.status(500).send(result);
// 		}
// 		return res.status(200).send(result);
// 	});
// };

// exports.logout = function(req, res) {
// 	var username = req.body.username || '';

// 	if(username == '' ) {
// 		res.send(401);
// 	}

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.logout(username, function(error, result) {
// 		if(error) {
// 			res.send(401);
// 			return res.json({message:"logout false"});
// 		}
// 		res.json({message: result});
// 	});
// };

// exports.getRoomInWeek = function(req, res) {
// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.getRoomInWeek(function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}

// 		return res.json({message: result});
// 	});
// };

// exports.getRoomInMonth = function(req, res) {
// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.getRoomInMonth(function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}

// 		return res.json({message: result});
// 	});
// };

// exports.getRoomSchedule = function(req, res) {
// 	var userName = req.params.userName || '';
// 	if(userName === '') {
//     return res.status(400).send("Bad request");
//   }

//   var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.getRoomSchedule(userName, function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}

// 		return res.json({message: result});
// 	});
// };

// exports.endToConverstation = function(req, res) {
// 	var roomId = req.body.roomId || '';
// 	var userName = req.body.userName || '';

// 	if(roomId === '' || userName === '') {
// 		return res.status(400).send("Bad request");
// 	}

// 	var connection = database.connect();
// 	var	userModel = new UserModel(connection);

// 	userModel.endToConverstation(roomId, userName, function(err, result) {
// 		if(err) {
// 			return res.status(500).send(result);
// 		}

// 		return res.json({message: result});
// 	});
// };
