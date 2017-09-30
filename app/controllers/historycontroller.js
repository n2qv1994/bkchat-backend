
var history_services = require("../services/history_services");
// var database = require('../db/connection.js');
// var HistoryModel = require('../models/historymodel.js');
// var connection = database.connect();


exports.invited = function(req,res) {
	var user_id = req.params.user_id || "";
	if(user_id === "") {
		return;
	};
	history_services.invited(user_id, function(error, result) {
		if(!error) {
			return res.status(result.status_code).json({message: result});
		}
		return res.status(result.status_code).json({message: result});
	});
};

// exports.showUserHistory = function(req, res) {

//   var userId = req.params.userid || '';

//   if(userId === '') {
//     return res.status(400).send("Bad request");
//   }
//   console.log(userId);
//   historyModel = new HistoryModel(connection);
//   historyModel.showUserHistory(userId, function(err, result) {
//     if(err) {
//       return res.status(500).send(result);
//     }
//     return res.json({message: result});
//   });
// };

// exports.showRecentHistory = function(req, res) {
//   var userId = req.params.userid || '';

//   if(userId === '') {
//     return res.status(400).send("Bad request");
//   }
//   console.log(userId);
//   historyModel = new HistoryModel(connection);
//   historyModel.showRecentHistory(userId, function(err, result) {
//     if(err) {
//       return res.status(500).send(result);
//     }
//     return res.json({message: result});
//   });
// };

// exports.deleteHistory = function(req, res) {

//   var roomId = req.params.roomid || '';

//   if(roomId === '') {
//     return res.status(400).send("Bad request");
//   }

//   historyModel = new HistoryModel(connection);
//   historyModel.deleteHistory(roomId, function(err, result) {
//     if(err) {
//       return res.status(500).send(err);
//     }
//     return res.json({message: result});
//   });
// };
