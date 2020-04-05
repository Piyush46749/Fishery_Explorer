var mongoose=require("mongoose");

var announcementSchema= new mongoose.Schema({
	fishing_date : {
		type : String,
		required : true,
	},
	fishing_time : {
		type : String,
		required : true
	},
	place : {
		type : String,
		required : true
	},
	species: {
		type : String,
		required : true
	},
	weight: {
		type : String,
		required : true
	},
	target_specie : {
			type : Boolean,
			default : false
	}
});

module.exports = mongoose.model("Announcement", announcementSchema);