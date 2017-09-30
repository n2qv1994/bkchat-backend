var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var roleSchema = new Schema({
	role_name: { 
		type: String, 
		require: true,
		trim: true
	}
});

module.exports = mongoose.model('Role', roleSchema);
