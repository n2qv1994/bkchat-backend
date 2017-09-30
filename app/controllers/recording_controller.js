var mkdirp = require('mkdirp');
var fs = require('fs');
var formidable = require('formidable');
var recording_services = require('../services/recording_services');


exports.get_all_recording = function(req, res) {
  recording_services.get_all_recording(function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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

exports.add_video = function(req, res) {
  var upload = {};
  upload.room_name = req.body.room_name || "";
  upload.user_name = req.body.user_name || "";
  upload.video_name = req.body.video_name || "";
  upload.link       = req.body.link || ""; 
  console.log(upload);
  recording_services.add_video(upload, function(error, result) {
    if(!error) {
      return res.status(result.status_code).json({
        "error": {
          "data": result.message
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