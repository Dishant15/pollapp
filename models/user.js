
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
        username: {type : String, trim : true, unique : true, required : true},
        email: String,
        password: {type: String, required : true},
        time_stamp: { type: Date, default: Date.now }
    },
    { collection: 'user' }
    );

// user authentication methods
UserSchema.methods.authenticate = function(username, password){
	return username == this.username && password == this.password;
};

UserSchema.methods.get_absolute_url = function(){
	return "/user/home/" + this.username + "/";
};
    
module.exports = mongoose.model('Search', UserSchema);