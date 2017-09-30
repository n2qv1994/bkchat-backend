var express = require('express');
var router = express.Router();
var jwt    = require('jsonwebtoken');
var config = require('../../config/config')();

var user_controller     = require('../controllers/user_controller');
var meeting_controller  = require('../controllers/meeting_controller');
var room_controller = require('../controllers/room_controller');
// var storageController = require('../controllers/storagecontroller.js');
var history_controller  = require('../controllers/historycontroller');
var activity_controller = require('../controllers/activity_controller');
var notification_controller = require('../controllers/notification_controller');
var recording_controller = require('../controllers/recording_controller');

// API User
router.post('/authenticate', user_controller.authenticate);
router.get('/users', ensure_authorized, user_controller.get_list_users);
router.get('/users/all', ensure_authorized, user_controller.get_all_users);
router.get('/users/show/:user_code', ensure_authorized, user_controller.get_user);
router.put('/users/create_user', ensure_authorized, user_controller.create_user);
// router.get('/users/get_message_history/:sender_id/:recever_id', ensure_authorized, user_controller.get_message_history);
router.post('/users/get_message_history', ensure_authorized, user_controller.get_message_history);
// API Account
router.put('/account/update_profile', ensure_authorized, user_controller.update_profile);
router.put('/account/change_pass', ensure_authorized, user_controller.change_pass);
// router.post('/logout', userController.logout);
// router.post('/users', userController.create);
// router.post('/getInfoUser', userController.getInfoUser);
// router.put('/users', userController.update);
// router.get('/room_in_week', userController.getRoomInWeek);
// router.get('/room_in_month', userController.getRoomInMonth);
// router.get('/room_schedule/:userName', userController.getRoomSchedule);
// router.put('/converstation', userController.endToConverstation);
// router.delete('/users/:userId/:userName', userController.delete);

// API Meeting
router.get('/get_schedule', ensure_authorized, meeting_controller.get_schedule);
router.get('/get_meeting', ensure_authorized, meeting_controller.get_meeting);
router.get('/get_previous', ensure_authorized, meeting_controller.get_previous_meeting);
router.get('/get_room/:room_code', ensure_authorized, meeting_controller.get_room);
router.get('/get_reserve_this_month', ensure_authorized, meeting_controller.get_reserve_this_month);
router.get('/ask_room/:room_code', ensure_authorized, room_controller.ask_room);
router.post('/reserve_room', ensure_authorized, meeting_controller.reserve_room);
router.post('/create_room', ensure_authorized, meeting_controller.create_room);
router.put('/update_room', ensure_authorized, meeting_controller.update_room);
router.post('/upload', ensure_authorized, recording_controller.add_video);
router.get('/recording', ensure_authorized, recording_controller.get_all_recording);

router.get('/get_all_schedule', ensure_authorized, meeting_controller.get_all_schedule);
router.get('/get_all_meeting', ensure_authorized, meeting_controller.get_all_meeting);
router.get('/get_all_previous', ensure_authorized, meeting_controller.get_all_previous);


// API Activities
router.get('/get_activities/:offset', ensure_authorized, activity_controller.get_activities);

// API notifications
router.get('/user/notifications', ensure_authorized, notification_controller.get_notifications);
router.get('/user/notifications/unread_count', ensure_authorized, notification_controller.get_unread_notifications);
router.put('/user/notifications', ensure_authorized, notification_controller.read_notify);
// //API Rooms
// router.post('/createRoom', roomController.createRoom);
// router.post('/joinName', roomController.joinName);
// router.post('/checkLimit', roomController.checkLimit);
// router.post('/findRoomName', roomController.findRoomName);
// router.post('/updateInfoRoom', roomController.updateInfoRoom);
// router.post('/findRoomWithUser', roomController.findRoomWithUser);
// router.post('/deleteRoomm', roomController.deleteRoomm);
// router.post('/listRoom', roomController.listRoom);
// router.post('/inviteUsers', roomController.inviteUsers);

// //API storage
// router.post('/saveVideo', storageController.saveVideo);
// router.post('/deleteRoomId', storageController.deleteRoomId);
// router.post('/clearStorage', storageController.clearStorage);
// router.get('/storage/:userid', storageController.showStorage);
// router.get('/storage/:storageid', storageController.showStorageDetail);

// // API history
// router.get('/history/:userid', historyController.showUserHistory);
// router.get('/recent_history/:userid', historyController.showRecentHistory);
// router.delete('/history/:roomid', historyController.deleteHistory);
router.get('/invited/:user_id', ensure_authorized, history_controller.invited);
// router.post('/invited',history_controller.invited);

function ensure_authorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
      var bearer = bearerHeader.split(" ");
      bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, config.secret, function(err, decoded) {
        if (err) {
          return res.status(403).json({
            error: {
              data: 'Failed to authenticate token.'
            },
            status_code: 403
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).json({
        error: {
          data: "Invalid token"
        },
        status_code: 403
      });
    }
}

module.exports = router;
