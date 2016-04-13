var mongoose = require("mongoose");

var ChoiceSchema = mongoose.Schema({
	name: {type: String, required : true},
	votes: {type: Number, default : 0},
});

var PollSchema = mongoose.Schema({
	creator : String,
	name : String,
	choices : [ChoiceSchema]
	}, 
	{ collection: 'polls' }
);

PollSchema.statics.get_all = function (cb) {
	this.find({},{__v:0}, cb);
};

PollSchema.methods.get_absolute_url = function() {
	return "/poll/detail/" + this._id + "/";
};

PollSchema.methods.total_votes = function() {
	var sum = 0;
	for (var i = 0; i < this.choices.length; i++) {
		sum = sum + this.choices[i].votes;
	}
	return sum;
};

module.exports = mongoose.model('Polls', PollSchema);